#!/usr/bin/env python3
"""Grade every NFL prop the feed tracked — the Prop Shop's honesty loop.

Reads nfl-ev's history (one JSONL per event: a record per player-market per pull,
first = OPEN, last pre-kickoff = CLOSE) and this repo's player shards (nflverse
weekly stats), and writes data/nfl/prop_results.json:

  rows[]     every graded player-market: open, close, result, over hit at close,
             line move, and the "read" at the open (L10 hit rate vs the open line,
             computed from games BEFORE that week only)
  summary    per week: props, overs hit at close by market, and the read test —
             did props with a hot L10 at the open hit more / get line movement?

Nothing here is a model. It measures whether the Outlier-style read (hit rate +
matchup) beats the market, the same way the board grades its leans vs the close.
"""
import csv, io, json, os, sys, urllib.request
from collections import defaultdict
from datetime import datetime, timezone, timedelta

HIST = os.environ.get("NFL_HISTORY", "https://nfl-ev-sigma.vercel.app/history/nfl/")
ROOT = os.path.join(os.path.dirname(__file__), "..", "data", "nfl")
OUT = os.path.join(ROOT, "prop_results.json")
SEASON = int(os.environ.get("NFLDB_SEASON", "2026"))
KEY = {"passing_yards": "pyd", "passing_touchdowns": "ptd", "passing_completions": "cmp", "passing_attempts": "att",
       "passing_interceptions": "int", "rushing_yards": "ryd", "rushing_attempts": "car", "receiving_yards": "recyd",
       "receiving_receptions": "rec", "touchdowns": "anytd", "rushing+receiving_yards": "rr", "passing+rushing_yards": "pr",
       "fieldGoals_made": "fgm", "kicking_totalPoints": "kpts", "extraPoints_kicksMade": "xpm",
       "receiving_longestReception": "lrec", "rushing_longestRush": "lrush", "passing_longestCompletion": "lcmp",
       "defense_combinedTackles": "tkl", "defense_soloTackles": "solo", "defense_assistedTackles": "ast",
       "defense_sacks": "sk", "defense_interceptions": "dint"}
BUCKETS = [(0, .3, "cold <30%"), (.3, .5, "30-50%"), (.5, .7, "50-70%"), (.7, 1.01, "hot >=70%")]


def read(path):
    if HIST.startswith("http"):
        req = urllib.request.Request(HIST + path, headers={"User-Agent": "pps-propshop/1.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.read().decode("utf-8")
    return open(os.path.join(HIST, path)).read()


def norm(s):
    import unicodedata, re
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"\b(jr|sr|ii|iii|iv)\b\.?", "", s); s = re.sub(r"[^a-z ]", "", s)
    return re.sub(r"\s+", " ", s).strip()


def val(row, F, key):
    g = lambda k: row[F[k]] if k in F and F[k] < len(row) else 0
    if key == "anytd": return g("rtd") + g("rectd")
    if key == "rr": return g("ryd") + g("recyd")
    if key == "pr": return g("pyd") + g("ryd")
    if key == "kpts": return 3 * g("fgm") + g("xpm")
    return g(key)


def main():
    idx = json.loads(read("index.json"))
    players = json.load(open(os.path.join(ROOT, "players.json")))
    F = {f: i for i, f in enumerate(players["fields"])}
    by_name = defaultdict(list)
    for pid, name, team, pos, _ in players["players"]:
        n = norm(name); by_name[n + "|" + team].append(pid); by_name["last:" + n.split(" ")[-1] + "|" + team].append(pid)
    # week map from the nflverse schedule
    sched = csv.DictReader(io.StringIO(urllib.request.urlopen(
        "https://github.com/nflverse/nflverse-data/releases/download/schedules/games.csv", timeout=120).read().decode()))
    wk = {}
    for g in sched:
        if g["season"] == str(SEASON): wk[(g["away_team"], g["home_team"])] = (int(g["week"]), g["gameday"], g["home_score"] != "")
    now = datetime.now(timezone.utc)
    rows, shards = [], {}
    for e in idx["events"]:
        start = datetime.fromisoformat(e["startsAt"].replace("Z", "+00:00"))
        if start > now - timedelta(hours=4): continue             # not final yet
        w = wk.get((e["away"], e["home"]))
        if not w or not w[2]: continue                            # no final score in nflverse yet
        week = w[0]
        recs = [json.loads(l) for l in read(e["file"]).splitlines() if l.strip()]
        recs = [r for r in recs if r["t"] < e["startsAt"]]
        first, last = {}, {}
        for r in recs:
            k = (r["player"], r["team"], r["market"]); first.setdefault(k, r); last[k] = r
        for k, close in last.items():
            opn = first[k]; name, team, market = k; key = KEY.get(market)
            if not key: continue
            n = norm(name); pids = by_name.get(n + "|" + team) or by_name.get("last:" + n.split(" ")[-1] + "|" + team) or []
            if len(pids) != 1: continue
            pid = pids[0]
            if pid not in shards:
                try: shards[pid] = json.load(open(os.path.join(ROOT, "players", pid + ".json")))
                except Exception: shards[pid] = None
            sh = shards[pid]
            if not sh: continue
            game = next((r for r in sh["g"] if r[F["week"]] == week), None)
            if game is None: continue                              # DNP / inactive: no stat line -> not graded
            result = val(game, F, key)
            hist = sh["prev"] + [r for r in sh["g"] if r[F["week"]] < week]
            l10 = hist[-10:]
            read_rate = (sum(1 for r in l10 if val(r, F, key) > opn["line"]) / len(l10)) if l10 else None
            rows.append({"eventID": e["eventID"], "week": week, "away": e["away"], "home": e["home"], "player": name, "team": team,
                         "id": pid, "market": market, "key": key, "open": opn["line"], "close": close["line"],
                         "fairOverClose": close.get("fairOver"), "pulls": len([r for r in recs if (r["player"], r["team"], r["market"]) == k]),
                         "result": result, "overHit": result > close["line"], "push": result == close["line"],
                         "move": round(close["line"] - opn["line"], 1), "readL10": None if read_rate is None else round(read_rate, 2), "n10": len(l10)})
    # summaries
    weeks = defaultdict(lambda: {"props": 0, "games": set(), "byMarket": defaultdict(lambda: [0, 0, 0]), "read": defaultdict(lambda: [0, 0, 0, 0, 0])})
    for r in rows:
        W = weeks[r["week"]]; W["props"] += 1; W["games"].add(r["eventID"])
        m = W["byMarket"][r["market"]]; m[0] += 1; m[1] += r["overHit"]; m[2] += r["push"]
        if r["readL10"] is not None and r["n10"] >= 5:
            b = next(lbl for lo, hi, lbl in BUCKETS if lo <= r["readL10"] < hi)
            x = W["read"][b]; x[0] += 1; x[1] += r["overHit"]; x[2] += r["push"]
            x[3] += (r["move"] > 0); x[4] += (r["move"] < 0)        # line moved UP (toward the over) / down
    summary = {}
    for w, W in weeks.items():
        summary[str(w)] = {"props": W["props"], "games": len(W["games"]),
            "byMarket": {m: {"n": v[0], "overHit": round(100 * v[1] / max(1, v[0] - v[2]), 1), "push": v[2]} for m, v in W["byMarket"].items()},
            "read": {b: {"n": v[0], "overHit": round(100 * v[1] / max(1, v[0] - v[2]), 1), "lineUp": v[3], "lineDown": v[4]} for b, v in W["read"].items()}}
    out = {"generatedAt": now.strftime("%Y-%m-%dT%H:%M:%SZ"), "season": SEASON, "history": HIST, "events_tracked": len(idx["events"]),
           "rows": rows, "summary": summary}
    os.makedirs(ROOT, exist_ok=True)
    json.dump(out, open(OUT, "w"), separators=(",", ":"))
    print("prop_results.json: %d graded rows across %d week(s); %d events tracked" % (len(rows), len(summary), len(idx["events"])))
    for w, S in sorted(summary.items()):
        print("  week %s: %d props / %d games · read buckets: %s" % (w, S["props"], S["games"], {b: v["n"] for b, v in S["read"].items()}))


if __name__ == "__main__":
    main()
