#!/usr/bin/env python3
"""Build the on-repo NFL player database — the NFL twin of build_playerdb.py.

Source is nflverse (free, no key): one CSV per season with every player-week
stat line, plus the players crosswalk and the season schedule. No per-player
API calls at all — the whole league is four downloads.

Writes:
  data/nfl/players.json       search index + field legend + each team's next game
  data/nfl/players/{id}.json  one shard per skill player (+ kickers): 2026 weeks ("g"),
                              2025 weeks ("prev"), headshot, position
  data/nfl/matchups.json      what each DEFENSE allows per game to each position
                              (QB/RB/WR/TE/K) this season, with league rank
                              (1 = allows the least) — the Prop Finder's matchup line
  data/nfl/injuries.json      the latest official injury report, by gsis_id

Same discipline as MLB: shards carry no timestamp (idle player = identical
bytes = no git churn), unchanged snapshots keep their previous generatedAt,
and the derive scripts read only these files.
"""
import csv
import io
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone, date

SEASON = int(os.environ.get("NFLDB_SEASON", "2026"))
PREV = SEASON - 1
ROOT = os.path.join(os.path.dirname(__file__), "..", "data", "nfl")
SHARD_DIR = os.path.join(ROOT, "players")
INDEX_PATH = os.path.join(ROOT, "players.json")

REL = "https://github.com/nflverse/nflverse-data/releases/download"
DEF_POS = {"DE", "DT", "NT", "DL", "EDGE", "LB", "OLB", "ILB", "MLB", "CB", "S", "SAF", "FS", "SS", "DB"}
POSITIONS = {"QB", "RB", "FB", "WR", "TE", "K"} | DEF_POS

# One row per week, published once in the index.
FIELDS = ["week", "opp", "home", "cmp", "att", "pyd", "ptd", "int",
          "car", "ryd", "rtd", "rec", "tgt", "recyd", "rectd", "fgm", "fga", "xpm",
          "solo", "ast", "sk", "dint", "tkl", "lrec", "lrush", "lcmp"]
STAT_COLS = ["completions", "attempts", "passing_yards", "passing_tds",
             "passing_interceptions", "carries", "rushing_yards", "rushing_tds",
             "receptions", "targets", "receiving_yards", "receiving_tds",
             "fg_made", "fg_att", "pat_made",
             "def_tackles_solo", "def_tackle_assists", "def_sacks", "def_interceptions"]
# derived per row: tkl = solo + ast (the books' "combined tackles"); lrec/lrush/lcmp from play-by-play (max yards on one play)
DERIVED = ["tkl", "lrec", "lrush", "lcmp"]
MAX_FIELDS = {"lrec", "lrush", "lcmp"}       # matchups aggregate these per game by MAX, not sum
MATCHUP_PATH = os.path.join(ROOT, "matchups.json")
INJ_PATH = os.path.join(ROOT, "injuries.json")
# what a defense "allows" per position bucket; values are FIELDS keys or sums of them
BUCKET = {"QB": "QB", "RB": "RB", "FB": "RB", "WR": "WR", "TE": "TE", "K": "K", **{p: "DEF" for p in DEF_POS}}
ALLOW = {
    "QB": {"pyd": ["pyd"], "ptd": ["ptd"], "int": ["int"], "cmp": ["cmp"], "att": ["att"], "ryd": ["ryd"], "pr": ["pyd", "ryd"], "anytd": ["rtd", "rectd"], "lcmp": ["lcmp"]},
    "RB": {"car": ["car"], "ryd": ["ryd"], "rtd": ["rtd"], "rec": ["rec"], "recyd": ["recyd"], "tgt": ["tgt"], "rr": ["ryd", "recyd"], "anytd": ["rtd", "rectd"], "lrush": ["lrush"], "lrec": ["lrec"]},
    "WR": {"rec": ["rec"], "recyd": ["recyd"], "rectd": ["rectd"], "tgt": ["tgt"], "ryd": ["ryd"], "rr": ["ryd", "recyd"], "anytd": ["rtd", "rectd"], "lrec": ["lrec"]},
    "TE": {"rec": ["rec"], "recyd": ["recyd"], "rectd": ["rectd"], "tgt": ["tgt"], "rr": ["ryd", "recyd"], "anytd": ["rtd", "rectd"], "lrec": ["lrec"]},
    "K":  {"fgm": ["fgm"], "fga": ["fga"], "xpm": ["xpm"], "kpts": ["fgm", "fgm", "fgm", "xpm"]},
}
# a stat where allowing MORE is worse for the defense (rank 1 = allows least). int is the exception.
LOWER_IS_BETTER_FOR_DEF = {k for b in ALLOW.values() for k in b} - {"int"}


def fetch_csv(url, required=True):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "pps-nfldb/1.0"})
        with urllib.request.urlopen(req, timeout=120) as r:
            return list(csv.DictReader(io.TextIOWrapper(r, encoding="utf-8")))
    except Exception as e:
        if required:
            raise
        # the current-season file doesn't exist until Week 1 is in the books
        print(f"  (no file yet: {url.rsplit('/',1)[-1]} — {e})")
        return []


def _n(v):
    try:
        f = float(v)
    except (TypeError, ValueError):
        return 0
    return int(f) if f == int(f) else round(f, 1)


def week_rows(rows, longest=None):
    """player_id -> [FIELDS rows], week-ordered. game_id is AWAY_HOME, so a
    player is home when his team is the last segment. longest: {(game_id, player_id): {lrec, lrush, lcmp}}."""
    out = {}
    longest = longest or {}
    for r in rows:
        if r.get("position") not in POSITIONS:
            continue
        gid = r.get("game_id", "")
        home = 1 if gid.endswith("_" + r.get("team", "?")) else 0
        row = [_n(r.get("week")), r.get("opponent_team", "?"), home] + [_n(r.get(c)) for c in STAT_COLS]
        fi = {f: i for i, f in enumerate(FIELDS)}
        lg = longest.get((gid, r["player_id"]), {})
        row += [row[fi["solo"]] + row[fi["ast"]], lg.get("lrec", 0), lg.get("lrush", 0), lg.get("lcmp", 0)]
        out.setdefault(r["player_id"], []).append(row)
    for rows_ in out.values():
        rows_.sort(key=lambda x: x[0])
    return out


def longest_plays(season):
    """play-by-play -> {(game_id, player_id): {lrec, lrush, lcmp}}: the longest single reception /
    rush / completion in each game, regular season AND playoffs (the shards include playoff weeks).
    Streams the gz; ~1 min per season."""
    import gzip
    url = f"{REL}/pbp/play_by_play_{season}.csv.gz"
    out = {}
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "pps-nfldb/1.0"})
        with urllib.request.urlopen(req, timeout=300) as r:
            with gzip.open(r, "rt", newline="") as f:
                for p in csv.DictReader(f):
                    # REG *and* POST: the shards carry playoff weeks (19-22), so skipping POST here
                    # left every playoff game with longest = 0 even when the player caught passes.
                    gid = p.get("game_id", "")
                    if p.get("complete_pass") == "1":
                        y = _n(p.get("receiving_yards") or p.get("yards_gained"))
                        rid, qid = p.get("receiver_player_id"), p.get("passer_player_id")
                        # first play seeds the value so a player whose only catch LOST yards
                        # records -2, not a floored 0
                        if rid:
                            d = out.setdefault((gid, rid), {}); d["lrec"] = max(d["lrec"], y) if "lrec" in d else y
                        if qid:
                            d = out.setdefault((gid, qid), {}); d["lcmp"] = max(d["lcmp"], y) if "lcmp" in d else y
                    if p.get("rush_attempt") == "1" and p.get("rusher_player_id"):
                        y = _n(p.get("rushing_yards") or p.get("yards_gained"))
                        d = out.setdefault((gid, p["rusher_player_id"]), {}); d["lrush"] = max(d["lrush"], y) if "lrush" in d else y
    except Exception as e:
        print(f"  (longest plays unavailable for {season}: {e})")
    return out


def next_games(sched):
    """team -> its next unplayed game {opp, home, date, time, week}."""
    today = date.today().isoformat()
    out = {}
    for g in sorted(sched, key=lambda g: (g.get("gameday", ""), g.get("gametime", ""))):
        if str(g.get("season")) != str(SEASON) or g.get("game_type") != "REG":
            continue
        if (g.get("gameday", "") or "") < today:
            continue
        for team, opp, home in ((g["home_team"], g["away_team"], 1),
                                (g["away_team"], g["home_team"], 0)):
            if team not in out:
                out[team] = {"opp": opp, "home": home, "date": g.get("gameday", ""),
                             "time": g.get("gametime", ""), "week": _n(g.get("week"))}
    return out


def build_matchups(rows, longest):
    """rows: raw nflverse player-week rows (current season). -> matchups.json body."""
    fi = {f: i for i, f in enumerate(FIELDS)}
    per_game = {}   # (defense, bucket, game_id) -> {field: sum}
    for r in rows:
        pos = r.get("position")
        if pos not in POSITIONS or r.get("season_type", "REG") != "REG":
            continue
        b = BUCKET[pos]; d = r.get("opponent_team", "?"); gid = r.get("game_id", "")
        if b == "DEF":
            continue
        acc = per_game.setdefault((d, b, gid), {})
        for f, c in zip(FIELDS[3:], STAT_COLS):
            acc[f] = acc.get(f, 0) + _n(r.get(c))
        lg = longest.get((gid, r["player_id"]), {})
        for f in MAX_FIELDS:
            acc[f] = max(acc.get(f, 0), lg.get(f, 0))
    # every defense's game count = distinct game_ids it appears in (any bucket)
    games = {}
    for (d, b, gid) in per_game:
        games.setdefault(d, set()).add(gid)
    out = {}
    for b, stats in ALLOW.items():
        for stat, parts in stats.items():
            vals = {}
            for d, gids in games.items():
                tot = 0.0
                for gid in gids:
                    acc = per_game.get((d, b, gid), {})
                    tot += sum(acc.get(p, 0) for p in parts)
                vals[d] = tot / len(gids) if gids else 0.0
            if not vals:
                continue
            lg = sum(vals.values()) / len(vals)
            order = sorted(vals, key=lambda d: vals[d], reverse=(stat not in LOWER_IS_BETTER_FOR_DEF))
            # rank 1 = best defense (allows least; for int: creates most)
            order = sorted(vals, key=lambda d: vals[d]) if stat in LOWER_IS_BETTER_FOR_DEF else sorted(vals, key=lambda d: -vals[d])
            for i, d in enumerate(order, 1):
                out.setdefault(d, {}).setdefault(b, {})[stat] = [round(vals[d], 1), i, round(lg, 1)]
    return {"season": SEASON, "n": len(games), "games": {d: len(g) for d, g in games.items()}, "ranks": out}


def build_injuries():
    rows = fetch_csv(f"{REL}/injuries/injuries_{SEASON}.csv", required=False)
    rows = [r for r in rows if r.get("season_type") == "REG"]
    if not rows:
        return None
    week = max(_n(r.get("week")) for r in rows)
    players = {}
    for r in rows:
        if _n(r.get("week")) != week or not r.get("gsis_id"):
            continue
        st, pr = r.get("report_status") or "", r.get("practice_status") or ""
        if not st and not pr.startswith(("Did Not", "Limited")):
            continue
        pr_short = {"Did Not Participate In Practice": "DNP", "Limited Participation in Practice": "Limited",
                    "Full Participation in Practice": "Full"}.get(pr, pr.split(" Participation")[0].strip())
        players[r["gsis_id"]] = [st, pr_short,
                                 r.get("report_primary_injury") or r.get("practice_primary_injury") or "", r.get("team") or ""]
    return {"season": SEASON, "week": week, "players": players}


def main():
    print("Downloading nflverse data…")
    cur = fetch_csv(f"{REL}/stats_player/stats_player_week_{SEASON}.csv", required=False)
    prev = fetch_csv(f"{REL}/stats_player/stats_player_week_{PREV}.csv")
    players = fetch_csv(f"{REL}/players/players.csv")
    sched = fetch_csv(f"{REL}/schedules/games.csv", required=False) or \
        fetch_csv(f"{REL}/schedules/sched_{SEASON}.csv", required=False)
    print(f"  {SEASON}: {len(cur)} rows · {PREV}: {len(prev)} rows · "
          f"crosswalk: {len(players)} · schedule: {len(sched)}")
    if len(prev) < 5000 or len(players) < 5000:
        print("ABORT: nflverse download looks broken — not writing.", file=sys.stderr)
        sys.exit(1)

    print("  play-by-play for longest plays…")
    LONGEST_CUR, LONGEST_PREV = longest_plays(SEASON), longest_plays(PREV)
    cur_rows, prev_rows = week_rows(cur, LONGEST_CUR), week_rows(prev, LONGEST_PREV)
    meta = {p["gsis_id"]: p for p in players if p.get("gsis_id")}

    shards = []
    for pid in sorted(set(cur_rows) | set(prev_rows)):
        m = meta.get(pid, {})
        pos = m.get("position") or "?"
        if pos not in POSITIONS:
            continue
        if pos in DEF_POS and not (cur_rows.get(pid) or prev_rows.get(pid)):
            continue
        shards.append({
            "id": pid,
            "name": m.get("display_name") or "?",
            "team": m.get("latest_team") or "?",
            "pos": pos,
            "active": 1 if m.get("status") == "ACT" else 0,
            "headshot": m.get("headshot") or "",
            "g": cur_rows.get(pid, []),
            "prev": prev_rows.get(pid, []),
        })

    os.makedirs(SHARD_DIR, exist_ok=True)
    keep, changed = set(), 0
    for sh in shards:
        path = os.path.join(SHARD_DIR, f"{sh['id']}.json")
        keep.add(os.path.basename(path))
        blob = json.dumps(sh, separators=(",", ":"))
        try:
            with open(path) as f:
                if f.read() == blob:
                    continue
        except FileNotFoundError:
            pass
        with open(path, "w") as f:
            f.write(blob)
        changed += 1
    pruned = 0
    for fn in os.listdir(SHARD_DIR):
        if fn.endswith(".json") and fn not in keep:
            os.remove(os.path.join(SHARD_DIR, fn))
            pruned += 1

    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    teams = next_games(sched)
    index_body = {
        "season": SEASON, "prevSeason": PREV,
        "fields": FIELDS,
        "playerCount": len(shards),
        "teams": teams,
        "players": [[sh["id"], sh["name"], sh["team"], sh["pos"], sh["active"]]
                    for sh in sorted(shards, key=lambda s: s["name"])],
    }
    # unchanged snapshot keeps its previous timestamp (same trick as MLB) —
    # but the next-game map moves with the calendar, so compare it too
    try:
        with open(INDEX_PATH) as f:
            old = json.load(f)
        if changed == 0 and pruned == 0 and \
           {k: v for k, v in old.items() if k != "generatedAt"} == index_body:
            generated_at = old["generatedAt"]
    except Exception:
        pass
    with open(INDEX_PATH, "w") as f:
        json.dump({"generatedAt": generated_at, **index_body}, f, separators=(",", ":"))

    mu = build_matchups(cur, LONGEST_CUR)
    mu_prev = build_matchups(prev, LONGEST_PREV)          # last season's FINAL ranks: the tier of a 2025 opponent
    mu["prev"] = {"season": PREV, "n": mu_prev["n"], "ranks": mu_prev["ranks"]}
    with open(MATCHUP_PATH, "w") as f:
        json.dump({"generatedAt": generated_at, **mu}, f, separators=(",", ":"))
    inj = build_injuries()
    if inj:
        with open(INJ_PATH, "w") as f:
            json.dump({"generatedAt": generated_at, **inj}, f, separators=(",", ":"))
    print(f"matchups.json: {len(mu['ranks'])} defenses · injuries.json: "
          f"{len(inj['players']) if inj else 0} players (week {inj['week'] if inj else '-'})")

    total = sum(os.path.getsize(os.path.join(SHARD_DIR, f))
                for f in os.listdir(SHARD_DIR))
    print(f"Wrote {len(shards)} shards ({changed} changed, {pruned} pruned, "
          f"{total/1e6:.1f}MB) + players.json ({len(teams)} team next-games)")


if __name__ == "__main__":
    main()
