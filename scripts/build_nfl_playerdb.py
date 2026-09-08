#!/usr/bin/env python3
"""Build the on-repo NFL player database — the NFL twin of build_playerdb.py.

Source is nflverse (free, no key): one CSV per season with every player-week
stat line, plus the players crosswalk and the season schedule. No per-player
API calls at all — the whole league is four downloads.

Writes:
  data/nfl/players.json       search index + field legend + each team's next game
  data/nfl/players/{id}.json  one shard per skill player: 2026 weeks ("g"),
                              2025 weeks ("prev"), headshot, position

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
POSITIONS = {"QB", "RB", "FB", "WR", "TE"}

# One row per week, published once in the index.
FIELDS = ["week", "opp", "home", "cmp", "att", "pyd", "ptd", "int",
          "car", "ryd", "rtd", "rec", "tgt", "recyd", "rectd"]
STAT_COLS = ["completions", "attempts", "passing_yards", "passing_tds",
             "passing_interceptions", "carries", "rushing_yards", "rushing_tds",
             "receptions", "targets", "receiving_yards", "receiving_tds"]


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
        return int(float(v))
    except (TypeError, ValueError):
        return 0


def week_rows(rows):
    """player_id -> [FIELDS rows], week-ordered. game_id is AWAY_HOME, so a
    player is home when his team is the last segment."""
    out = {}
    for r in rows:
        if r.get("position") not in POSITIONS:
            continue
        home = 1 if r.get("game_id", "").endswith("_" + r.get("team", "?")) else 0
        out.setdefault(r["player_id"], []).append(
            [_n(r.get("week")), r.get("opponent_team", "?"), home] +
            [_n(r.get(c)) for c in STAT_COLS])
    for rows_ in out.values():
        rows_.sort(key=lambda x: x[0])
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

    cur_rows, prev_rows = week_rows(cur), week_rows(prev)
    meta = {p["gsis_id"]: p for p in players if p.get("gsis_id")}

    shards = []
    for pid in sorted(set(cur_rows) | set(prev_rows)):
        m = meta.get(pid, {})
        pos = m.get("position") or "?"
        if pos not in POSITIONS:
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

    total = sum(os.path.getsize(os.path.join(SHARD_DIR, f))
                for f in os.listdir(SHARD_DIR))
    print(f"Wrote {len(shards)} shards ({changed} changed, {pruned} pruned, "
          f"{total/1e6:.1f}MB) + players.json ({len(teams)} team next-games)")


if __name__ == "__main__":
    main()
