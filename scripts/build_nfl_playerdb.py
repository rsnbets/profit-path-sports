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
POSITIONS = {"QB", "RB", "FB", "WR", "TE", "K"}

# One row per week, published once in the index.
FIELDS = ["week", "opp", "home", "cmp", "att", "pyd", "ptd", "int",
          "car", "ryd", "rtd", "rec", "tgt", "recyd", "rectd", "fgm", "fga", "xpm"]
STAT_COLS = ["completions", "attempts", "passing_yards", "passing_tds",
             "passing_interceptions", "carries", "rushing_yards", "rushing_tds",
             "receptions", "targets", "receiving_yards", "receiving_tds",
             "fg_made", "fg_att", "pat_made"]
MATCHUP_PATH = os.path.join(ROOT, "matchups.json")
INJ_PATH = os.path.join(ROOT, "injuries.json")
# what a defense "allows" per position bucket; values are FIELDS keys or sums of them
BUCKET = {"QB": "QB", "RB": "RB", "FB": "RB", "WR": "WR", "TE": "TE", "K": "K"}
ALLOW = {
    "QB": {"pyd": ["pyd"], "ptd": ["ptd"], "int": ["int"], "cmp": ["cmp"], "att": ["att"], "ryd": ["ryd"], "pr": ["pyd", "ryd"], "anytd": ["rtd", "rectd"]},
    "RB": {"car": ["car"], "ryd": ["ryd"], "rtd": ["rtd"], "rec": ["rec"], "recyd": ["recyd"], "tgt": ["tgt"], "rr": ["ryd", "recyd"], "anytd": ["rtd", "rectd"]},
    "WR": {"rec": ["rec"], "recyd": ["recyd"], "rectd": ["rectd"], "tgt": ["tgt"], "ryd": ["ryd"], "rr": ["ryd", "recyd"], "anytd": ["rtd", "rectd"]},
    "TE": {"rec": ["rec"], "recyd": ["recyd"], "rectd": ["rectd"], "tgt": ["tgt"], "rr": ["ryd", "recyd"], "anytd": ["rtd", "rectd"]},
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


def build_matchups(rows):
    """rows: raw nflverse player-week rows (current season). -> matchups.json body."""
    fi = {f: i for i, f in enumerate(FIELDS)}
    per_game = {}   # (defense, bucket, game_id) -> {field: sum}
    for r in rows:
        pos = r.get("position")
        if pos not in POSITIONS or r.get("season_type", "REG") != "REG":
            continue
        b = BUCKET[pos]; d = r.get("opponent_team", "?"); gid = r.get("game_id", "")
        acc = per_game.setdefault((d, b, gid), {})
        for f, c in zip(FIELDS[3:], STAT_COLS):
            acc[f] = acc.get(f, 0) + _n(r.get(c))
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

    mu = build_matchups(cur)
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
