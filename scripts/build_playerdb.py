#!/usr/bin/env python3
"""Build the on-repo MLB player database — the master stats pull.

One nightly fetch pass writes:
  data/players.json        search index + field legends (small, always loaded)
  data/players/{id}.json   one shard per player: current + previous season
                           game logs, and vs-L/vs-R + home/away splits

Everything downstream (streaks.json, pitchers.json, the player prop pages)
derives from these shards with NO further API calls — the same one-puller
pattern as the SGO odds slate. Shards deliberately carry no generatedAt, so a
player who didn't play yesterday produces identical bytes and no git churn.

The build self-verifies against MLB's own season totals (sum of game-log hits
must equal season hits, etc.) and refuses to write a broken snapshot.

Stdlib only — safe for a bare GitHub Actions python container.
"""
import json
import os
import shutil
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

API = "https://statsapi.mlb.com/api/v1"
SEASON = int(os.environ.get("PLAYERDB_SEASON", "2026"))
PREV = SEASON - 1
ROOT = os.path.join(os.path.dirname(__file__), "..", "data")
SHARD_DIR = os.path.join(ROOT, "players")
INDEX_PATH = os.path.join(ROOT, "players.json")

# Array layouts for shard game rows — published once in players.json,
# never repeated per shard.
BAT_FIELDS = ["date", "opp", "home", "pa", "ab", "h", "d", "t", "hr",
              "rbi", "r", "bb", "k", "sb", "tb", "hbp"]
BAT_STATS = ["plateAppearances", "atBats", "hits", "doubles", "triples",
             "homeRuns", "rbi", "runs", "baseOnBalls", "strikeOuts",
             "stolenBases", "totalBases", "hitByPitch"]
PIT_FIELDS = ["date", "opp", "home", "gs", "outs", "h", "hr", "er",
              "k", "bb", "r", "bf", "pit"]
PIT_STATS = ["gamesStarted", "outs", "hits", "homeRuns", "earnedRuns",
             "strikeOuts", "baseOnBalls", "runs", "battersFaced",
             "numberOfPitches"]
# Counting stats kept per situational split (vl/vr/h/a). No `runs` — MLB does
# not provide runs scored in vs-hand splits, and a stored 0 would read as fact.
BAT_SPLIT = ["plateAppearances", "atBats", "hits", "homeRuns", "totalBases",
             "rbi", "baseOnBalls", "strikeOuts"]
PIT_SPLIT = ["battersFaced", "outs", "hits", "homeRuns", "earnedRuns",
             "strikeOuts", "baseOnBalls"]
SPLIT_CODES = ["vl", "vr", "h", "a"]

RETRIES = 3
# Tolerated verification failures before the build aborts. A broken feed causes
# many; the odd one is normal — and a DAYTIME run (games live) will show a
# handful of off-by-ones because stats move between the log fetch and the
# verification fetch. The nightly 09:00 UTC run has no live games.
MAX_BAD_FRACTION = 0.02


def get_json(url):
    last = None
    for i in range(RETRIES):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "pps-playerdb/1.0"})
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.load(r)
        except Exception as e:
            last = e
            time.sleep(1.5 * (i + 1))
    raise last


def _n(v):
    return v if isinstance(v, (int, float)) else 0


# ── universe ─────────────────────────────────────────────────────────────────

def fetch_team_abbrevs():
    teams = get_json(f"{API}/teams?sportId=1&season={SEASON}")["teams"]
    return {t["id"]: t.get("abbreviation", "?") for t in teams}


def fetch_game_teams(season):
    """gamePk -> (awayTeamId, homeTeamId). gameLog's opponent hydration is
    unreliable for pitching lines, so opponents always resolve off the gamePk —
    and always through the CURRENT season's abbreviation map (ids are stable
    across seasons, abbreviations are not: OAK -> ATH)."""
    sched = get_json(f"{API}/schedule?sportId=1&startDate={season}-02-15"
                     f"&endDate={season}-12-01&gameType=R")
    out = {}
    for day in sched.get("dates", []):
        for g in day.get("games", []):
            out[g["gamePk"]] = (g["teams"]["away"]["team"]["id"],
                                g["teams"]["home"]["team"]["id"])
    return out


def fetch_universe(abbrevs):
    """Active rosters, plus EVERYONE who has appeared in a game this season —
    an IL star (Judge spent June on the 60-day) or a demoted starter must
    still be searchable, with `active:0` so pages can badge them."""
    players = {}
    for tid in abbrevs:
        roster = get_json(f"{API}/teams/{tid}/roster?rosterType=active&season={SEASON}")
        for r in roster.get("roster", []):
            pos = r["position"]["abbreviation"]
            players[r["person"]["id"]] = {
                "id": r["person"]["id"], "name": r["person"]["fullName"],
                "team": abbrevs[tid], "pos": pos, "active": 1,
                # which gameLog groups to pull — grown below by the season
                # pools, so a reliever who pinch-ran or a position player
                # who mopped up gets BOTH sides of his ledger
                "grp": {"pitching"} if pos == "P"
                       else {"hitting", "pitching"} if pos == "TWP"
                       else {"hitting"},
            }
    for group in ("hitting", "pitching"):
        data = get_json(f"{API}/stats?stats=season&group={group}&season={SEASON}"
                        f"&sportId=1&limit=1500&playerPool=All")
        for s in data["stats"][0]["splits"]:
            pid = s["player"]["id"]
            if _n(s["stat"].get("gamesPlayed")) < 1:
                continue
            if pid not in players:
                players[pid] = {
                    "id": pid, "name": s["player"]["fullName"],
                    "team": abbrevs.get(s.get("team", {}).get("id"), "?"),
                    "pos": "?", "active": 0, "grp": set(),
                }
            players[pid]["grp"].add(group)
    return players


def fetch_hands(players):
    """bats/throws (+ position for pool-only players), batched — /people
    takes comma-separated ids."""
    ids = list(players)
    for i in range(0, len(ids), 100):
        chunk = ids[i:i + 100]
        data = get_json(f"{API}/people?personIds={','.join(map(str, chunk))}")
        for p in data.get("people", []):
            rec = players.get(p["id"])
            if rec is not None:
                rec["bats"] = p.get("batSide", {}).get("code", "?")
                rec["throws"] = p.get("pitchHand", {}).get("code", "?")
                if rec["pos"] == "?":
                    rec["pos"] = p.get("primaryPosition", {}).get("abbreviation", "?")


# ── per-player fetch ─────────────────────────────────────────────────────────

def groups_for(rec):
    return ",".join(sorted(rec["grp"])) or "hitting"


def game_rows(splits, game_teams, abbrevs, kind):
    stats, min_field = (BAT_STATS, "plateAppearances") if kind == "bat" else (PIT_STATS, None)
    rows = []
    for sp in sorted(splits, key=lambda s: s.get("date", "")):
        st = sp.get("stat", {})
        if kind == "bat" and _n(st.get(min_field)) < 1:
            continue                       # 0-PA pinch-run cameos aren't games
        team_id = (sp.get("team") or {}).get("id")
        away, home = game_teams.get((sp.get("game") or {}).get("gamePk"), (None, None))
        opp_id = away if team_id == home else home
        rows.append([sp.get("date", ""), abbrevs.get(opp_id, "?"),
                     1 if sp.get("isHome") else 0] + [_n(st.get(k)) for k in stats])
    return rows


def fetch_player(rec, games_cur, games_prev, abbrevs):
    pid, groups = rec["id"], groups_for(rec)
    shard = {"id": pid, "name": rec["name"], "team": rec["team"], "pos": rec["pos"],
             "bats": rec.get("bats", "?"), "throws": rec.get("throws", "?"),
             "active": rec["active"]}
    try:
        for season, gmap, key in ((SEASON, games_cur, "g"), (PREV, games_prev, "prev")):
            data = get_json(f"{API}/people/{pid}/stats?stats=gameLog"
                            f"&season={season}&group={groups}")
            for block in data.get("stats", []):
                gname = block.get("group", {}).get("displayName")
                kind = "bat" if gname == "hitting" else "pit" if gname == "pitching" else None
                if not kind:
                    continue
                rows = game_rows(block.get("splits", []), gmap, abbrevs, kind)
                if rows:
                    shard.setdefault(kind, {})[key] = rows
        # situational splits, current season only
        data = get_json(f"{API}/people/{pid}/stats?stats=statSplits"
                        f"&sitCodes={','.join(SPLIT_CODES)}&season={SEASON}&group={groups}")
        for block in data.get("stats", []):
            gname = block.get("group", {}).get("displayName")
            kind = "bat" if gname == "hitting" else "pit" if gname == "pitching" else None
            if not kind:
                continue
            keys = BAT_SPLIT if kind == "bat" else PIT_SPLIT
            for sp in block.get("splits", []):
                code = sp.get("split", {}).get("code")
                if code in SPLIT_CODES:
                    shard.setdefault(kind, {}).setdefault("splits", {})[code] = \
                        [_n(sp.get("stat", {}).get(k)) for k in keys]
    except Exception as e:
        print(f"  ! {rec['name']}: {e}", file=sys.stderr)
        return None
    return shard


# ── verification ─────────────────────────────────────────────────────────────

def fetch_season_totals(group):
    data = get_json(f"{API}/stats?stats=season&group={group}&season={SEASON}"
                    f"&sportId=1&limit=1500&playerPool=All")
    out = {}
    for s in data["stats"][0]["splits"]:
        out[s["player"]["id"]] = s["stat"]
    return out


def verify(shards):
    """Sum of game-log counting stats must match MLB's own season line."""
    bat_tot, pit_tot = fetch_season_totals("hitting"), fetch_season_totals("pitching")
    checked = bad = 0
    for sh in shards:
        for kind, tot, fields, cols in (("bat", bat_tot, BAT_FIELDS, ("h", "hits")),
                                        ("pit", pit_tot, PIT_FIELDS, ("k", "strikeOuts"))):
            g = sh.get(kind, {}).get("g")
            season_line = tot.get(sh["id"])
            if not g or not season_line:
                continue
            checked += 1
            i = fields.index(cols[0])
            if sum(r[i] for r in g) != _n(season_line.get(cols[1])):
                bad += 1
                print(f"  verify MISMATCH {sh['name']} [{kind}]: "
                      f"log {cols[0]}={sum(r[i] for r in g)} "
                      f"season={season_line.get(cols[1])}", file=sys.stderr)
    print(f"verified {checked} stat lines, {bad} mismatches")
    if checked and bad / checked > MAX_BAD_FRACTION:
        print("ABORT: snapshot failed verification — not writing.", file=sys.stderr)
        sys.exit(1)


# ── output ───────────────────────────────────────────────────────────────────

def main():
    print("Universe…")
    abbrevs = fetch_team_abbrevs()
    players = fetch_universe(abbrevs)
    fetch_hands(players)
    print(f"{len(players)} players. Schedules…")
    games_cur = fetch_game_teams(SEASON)
    games_prev = fetch_game_teams(PREV)
    print(f"{len(games_cur)} + {len(games_prev)} games mapped. Fetching player data…")

    shards = []
    with ThreadPoolExecutor(max_workers=12) as ex:
        futs = [ex.submit(fetch_player, rec, games_cur, games_prev, abbrevs)
                for rec in players.values()]
        for i, f in enumerate(futs):
            sh = f.result()
            if sh:
                shards.append(sh)
            if (i + 1) % 100 == 0:
                print(f"  {i + 1}/{len(players)}")

    verify(shards)

    # shards — write-if-changed keeps git quiet for idle players
    os.makedirs(SHARD_DIR, exist_ok=True)
    keep = set()
    changed = 0
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
    # prune players who left the universe
    pruned = 0
    for fn in os.listdir(SHARD_DIR):
        if fn.endswith(".json") and fn not in keep:
            os.remove(os.path.join(SHARD_DIR, fn))
            pruned += 1

    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    if changed == 0 and pruned == 0:
        # Nothing moved (retry run, or an off day) — keep the previous
        # timestamp so the whole snapshot stays byte-identical and the
        # workflow's commit step no-ops.
        try:
            with open(INDEX_PATH) as f:
                generated_at = json.load(f)["generatedAt"]
        except Exception:
            pass
    index = {
        "generatedAt": generated_at,
        "season": SEASON, "prevSeason": PREV,
        "batFields": BAT_FIELDS, "pitFields": PIT_FIELDS,
        "batSplit": BAT_SPLIT, "pitSplit": PIT_SPLIT, "splitCodes": SPLIT_CODES,
        "playerCount": len(shards),
        "players": [[sh["id"], sh["name"], sh["team"], sh["pos"],
                     sh["bats"], sh["throws"], sh["active"]] for sh in
                    sorted(shards, key=lambda s: s["name"])],
    }
    with open(INDEX_PATH, "w") as f:
        json.dump(index, f, separators=(",", ":"))

    total = sum(os.path.getsize(os.path.join(SHARD_DIR, f))
                for f in os.listdir(SHARD_DIR))
    print(f"Wrote {len(shards)} shards ({changed} changed, {pruned} pruned, "
          f"{total/1e6:.1f}MB) + players.json")


if __name__ == "__main__":
    main()
