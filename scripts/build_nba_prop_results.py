#!/usr/bin/env python3
"""Grade every NBA prop the feed tracked: the Prop Shop's honesty loop, NBA twin
of build_nfl_prop_results.py.

Reads nba-ev's history (one JSONL per event: a record per player-market per pull,
first = OPEN, last pre-tip = CLOSE) and this repo's NBA player shards (ESPN box
scores, rebuilt every morning), and writes data/nba/prop_results.json:

  rows[]     every graded player-market: open, close, result, over hit at close,
             line move, and the "read" at the open (L10 hit rate vs the open line
             from games BEFORE that night only, plus the similar-defense read)
  summary    per night (ET date): props, overs hit at close by market, and the
             read test: did props that looked hot at the open clear the close
             more often than props that looked cold?

Nothing here is a model. It measures whether the hit-rate-plus-matchup read
beats the market, the same way the boards grade their leans against the close.
Win/loss is reported, never used to judge anything.
"""
import json, os, re, sys, unicodedata, urllib.request
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo

HIST = os.environ.get("NBA_HISTORY", "https://nba-ev.vercel.app/history/nba/")
ROOT = os.path.join(os.path.dirname(__file__), "..", "data", "nba")
OUT = os.path.join(ROOT, "prop_results.json")
ET = ZoneInfo("America/New_York")
# SGO market -> player-db key
KEY = {"points": "pts", "rebounds": "reb", "assists": "ast", "threePointersMade": "tpm",
       "points+rebounds+assists": "pra", "points+rebounds": "pr", "points+assists": "pa",
       "rebounds+assists": "ra", "steals": "stl", "blocks": "blk", "blocks+steals": "sb", "turnovers": "tov"}
PARTS = {"pra": ["pts", "reb", "ast"], "pr": ["pts", "reb"], "pa": ["pts", "ast"], "ra": ["reb", "ast"], "sb": ["stl", "blk"]}
# SGO team codes -> ESPN codes (the player DB's codes)
TEAM = {"NYK": "NY", "SAS": "SA", "GSW": "GS", "NOP": "NO", "UTA": "UTAH", "WAS": "WSH", "PHO": "PHX", "BRK": "BKN", "CHO": "CHA"}
BUCKET = {"PG": "G", "SG": "G", "G": "G", "SF": "F", "PF": "F", "F": "F", "GF": "F", "FC": "C", "C": "C"}
BUCKETS = [(0, .3, "cold <30%"), (.3, .5, "30-50%"), (.5, .7, "50-70%"), (.7, 1.01, "hot >=70%")]
FINAL_AFTER_H = 4          # a game that tipped more than this long ago is treated as final
if os.environ.get("NBA_GRADE_ALL"):   # dry run: walk every tracked event (name matching check before any final exists)
    FINAL_AFTER_H = -99999


def read(path):
    if HIST.startswith("http"):
        req = urllib.request.Request(HIST + path, headers={"User-Agent": "pps-propshop/1.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.read().decode("utf-8")
    return open(os.path.join(HIST, path)).read()


def norm(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"\b(jr|sr|ii|iii|iv)\b\.?", "", s); s = re.sub(r"[^a-z ]", "", s)
    return re.sub(r"\s+", " ", s).strip()


def et_date(iso):
    return datetime.fromisoformat(iso.replace("Z", "+00:00")).astimezone(ET).strftime("%Y-%m-%d")


def val(row, F, key):
    g = lambda k: row[F[k]] if k in F and F[k] < len(row) else 0
    return sum(g(k) for k in PARTS[key]) if key in PARTS else g(key)


def main():
    idx = json.loads(read("index.json"))
    players = json.load(open(os.path.join(ROOT, "players.json")))
    try: MU = json.load(open(os.path.join(ROOT, "matchups.json")))
    except Exception: MU = None
    F = {f: i for i, f in enumerate(players["fields"])}
    pos_of = {pid: pos for pid, _, _, pos, _ in players["players"]}

    def ranks_for(opp):
        """this season's table once the opponent has five games, else last season's final"""
        if not MU: return None, False
        if (MU.get("games") or {}).get(opp, 0) >= 5 and MU.get("ranks"): return MU["ranks"], False
        prev = (MU.get("prev") or {}).get("ranks")
        return (prev, True) if prev else (None, False)

    def tier_in(R, opp, b, key):
        m = R and R.get(opp, {}).get(b, {}).get(key)
        if not m: return None
        n = len(R); return "top-10" if m[1] <= 10 else ("bottom-10" if m[1] > n - 10 else "mid")

    by_name = defaultdict(list)
    for pid, name, team, pos, _ in players["players"]:
        n = norm(name); by_name[n + "|" + team].append(pid); by_name["last:" + n.split(" ")[-1] + "|" + team].append(pid)

    now = datetime.now(timezone.utc)
    rows, shards, unmatched = [], {}, defaultdict(int)
    seen_names, matched_names = set(), set()
    for e in idx["events"]:
        start = datetime.fromisoformat(e["startsAt"].replace("Z", "+00:00"))
        if start > now - timedelta(hours=FINAL_AFTER_H): continue      # not final yet
        gdate = et_date(e["startsAt"])
        away, home = TEAM.get(e["away"], e["away"]), TEAM.get(e["home"], e["home"])
        recs = [json.loads(l) for l in read(e["file"]).splitlines() if l.strip()]
        recs = [r for r in recs if r["t"] < e["startsAt"]]
        first, last, pulls = {}, {}, defaultdict(int)
        for r in recs:
            k = (r["player"], r["team"], r["market"]); first.setdefault(k, r); last[k] = r; pulls[k] += 1
        for k, close in last.items():
            opn = first[k]; name, team0, market = k; key = KEY.get(market)
            if not key: continue
            team = TEAM.get(team0, team0)
            n = norm(name); seen_names.add((name, team))
            pids = by_name.get(n + "|" + team) or by_name.get("last:" + n.split(" ")[-1] + "|" + team) or []
            if len(pids) != 1:
                unmatched[(name, team)] += 1; continue
            pid = pids[0]; matched_names.add((name, team))
            if pid not in shards:
                try: shards[pid] = json.load(open(os.path.join(ROOT, "players", pid + ".json")))
                except Exception: shards[pid] = None
            sh = shards[pid]
            if not sh: continue
            opp = home if team == away else away
            game = next((r for r in sh["g"] if r[F["date"]] == gdate and r[F["opp"]] == opp), None)
            if game is None or game[F["min"]] <= 0: continue       # DNP / not in the box yet: not graded
            result = val(game, F, key)
            hist = [r for r in sh["prev"] + sh["g"] if r[F["min"]] > 0 and r[F["date"]] < gdate]
            l10 = hist[-10:]
            read_rate = (sum(1 for r in l10 if val(r, F, key) > opn["line"]) / len(l10)) if l10 else None
            # similar-defense read: games vs defenses in the same tier as this opponent
            b = BUCKET.get(pos_of.get(pid, ""), "F")
            R, R_prev = ranks_for(opp)
            tier = tier_in(R, opp, b, key) if R else None
            Rp = (MU.get("prev") or {}).get("ranks") if MU else None
            Rc = MU.get("ranks") if (MU and MU.get("ranks")) else Rp
            trows = ([r for r in sh["prev"] if r[F["min"]] > 0 and tier_in(Rp, r[F["opp"]], b, key) == tier] +
                     [r for r in sh["g"] if r[F["min"]] > 0 and r[F["date"]] < gdate and tier_in(Rc, r[F["opp"]], b, key) == tier]) if tier else []
            tier_rate = (sum(1 for r in trows if val(r, F, key) > opn["line"]) / len(trows)) if trows else None
            rows.append({"eventID": e["eventID"], "date": gdate, "away": away, "home": home, "player": name, "team": team,
                         "id": pid, "market": market, "key": key, "open": opn["line"], "close": close["line"],
                         "fairOverClose": close.get("fairOver"), "pulls": pulls[k],
                         "result": result, "overHit": result > close["line"], "push": result == close["line"],
                         "move": round(close["line"] - opn["line"], 1), "readL10": None if read_rate is None else round(read_rate, 2), "n10": len(l10),
                         "tier": tier, "tierPrev": bool(R_prev), "readTier": None if tier_rate is None else round(tier_rate, 2), "nTier": len(trows)})

    nights = defaultdict(lambda: {"props": 0, "games": set(), "byMarket": defaultdict(lambda: [0, 0, 0]),
                                  "read": defaultdict(lambda: [0, 0, 0, 0, 0]), "readTier": defaultdict(lambda: [0, 0, 0, 0, 0])})
    for r in rows:
        N = nights[r["date"]]; N["props"] += 1; N["games"].add(r["eventID"])
        m = N["byMarket"][r["market"]]; m[0] += 1; m[1] += r["overHit"]; m[2] += r["push"]
        if r["readL10"] is not None and r["n10"] >= 5:
            b = next(lbl for lo, hi, lbl in BUCKETS if lo <= r["readL10"] < hi)
            x = N["read"][b]; x[0] += 1; x[1] += r["overHit"]; x[2] += r["push"]; x[3] += (r["move"] > 0); x[4] += (r["move"] < 0)
        if r.get("readTier") is not None and r["nTier"] >= 3:
            b = next(lbl for lo, hi, lbl in BUCKETS if lo <= r["readTier"] < hi)
            x = N["readTier"][b]; x[0] += 1; x[1] += r["overHit"]; x[2] += r["push"]; x[3] += (r["move"] > 0); x[4] += (r["move"] < 0)
    summary = {}
    for d, N in nights.items():
        summary[d] = {"props": N["props"], "games": len(N["games"]),
            "byMarket": {m: {"n": v[0], "overHit": round(100 * v[1] / max(1, v[0] - v[2]), 1), "push": v[2]} for m, v in N["byMarket"].items()},
            "read": {b: {"n": v[0], "overHit": round(100 * v[1] / max(1, v[0] - v[2]), 1), "lineUp": v[3], "lineDown": v[4]} for b, v in N["read"].items()},
            "readTier": {b: {"n": v[0], "overHit": round(100 * v[1] / max(1, v[0] - v[2]), 1), "lineUp": v[3], "lineDown": v[4]} for b, v in N["readTier"].items()}}
    out = {"generatedAt": now.strftime("%Y-%m-%dT%H:%M:%SZ"), "season": players.get("season"), "seasonLabel": players.get("seasonLabel"),
           "history": HIST, "events_tracked": len(idx["events"]), "trackingSince": min((e["first"] for e in idx["events"]), default=None),
           "rows": rows, "summary": summary}
    os.makedirs(ROOT, exist_ok=True)
    json.dump(out, open(OUT, "w"), separators=(",", ":"))
    print("prop_results.json: %d graded rows across %d night(s); %d events tracked; feed names matched %d/%d"
          % (len(rows), len(summary), len(idx["events"]), len(matched_names), len(seen_names)))
    for (name, team), n in sorted(unmatched.items(), key=lambda x: -x[1])[:15]:
        print("  unmatched: %s (%s) x%d" % (name, team, n))
    for d, S in sorted(summary.items()):
        print("  %s: %d props / %d games · read buckets: %s" % (d, S["props"], S["games"], {b: v["n"] for b, v in S["read"].items()}))


if __name__ == "__main__":
    main()
