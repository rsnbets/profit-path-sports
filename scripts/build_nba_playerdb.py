#!/usr/bin/env python3
"""Build the on-repo NBA player database, the NBA twin of build_nfl_playerdb.py.

Source is ESPN's public site API (free, no key, already the house NBA source in
pps-hoops). stats.nba.com was ruled out: it blocks cloud runners.

Calls per run: 1 teams list + 30 rosters + 8 scoreboard days + one game log per
rostered player for the current season. Last season's log is fetched once per
player and then reused from the existing shard, so the nightly run is about
600 small requests.

Writes:
  data/nba/players.json       search index + field legend + each team's next game
  data/nba/players/{id}.json  one shard per rostered player: this season's games
                              ("g"), last season's games ("prev"), headshot,
                              position bucket (G / F / C)
  data/nba/matchups.json      what each DEFENSE allows per game to each position
                              bucket this season, with league rank (1 = allows
                              the least) and last season's final ranks
  data/nba/injuries.json      ESPN's current injury designation per player

Same discipline as MLB and NFL: shards carry no timestamp (idle player =
identical bytes = no git churn), unchanged snapshots keep their previous
generatedAt, and the derive scripts read only these files.

Game rows carry a "po" flag (1 = playoff game) so the pages can include or
exclude the postseason. Preseason games are never stored.

Stdlib only. Code uses UTC and zoneinfo, no hardcoded offsets.
"""
import json
import os
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo

# ESPN names a season by the year it ends: 2027 == 2026-27.
SEASON = int(os.environ.get("NBADB_SEASON", "2027"))
PREV = SEASON - 1
FULL = os.environ.get("NBADB_FULL") == "1"          # refetch last season for everyone
ROOT = os.path.join(os.path.dirname(__file__), "..", "data", "nba")
SHARD_DIR = os.path.join(ROOT, "players")
INDEX_PATH = os.path.join(ROOT, "players.json")
MATCHUP_PATH = os.path.join(ROOT, "matchups.json")
INJ_PATH = os.path.join(ROOT, "injuries.json")

SITE = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba"
WEB = "https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
ET = ZoneInfo("America/New_York")      # the league's own calendar for "game date"

# One row per game, published once in the index. date is the ET game date.
FIELDS = ["date", "opp", "home", "po", "min", "pts", "reb", "ast", "tpm", "tpa",
          "stl", "blk", "tov", "fgm", "fga", "ftm", "fta"]
# ESPN game-log stat name -> our field(s). Pair stats ("6-15") split in order.
STAT_MAP = {
    "minutes": ("min",),
    "fieldGoalsMade-fieldGoalsAttempted": ("fgm", "fga"),
    "threePointFieldGoalsMade-threePointFieldGoalsAttempted": ("tpm", "tpa"),
    "freeThrowsMade-freeThrowsAttempted": ("ftm", "fta"),
    "totalRebounds": ("reb",), "assists": ("ast",), "blocks": ("blk",),
    "steals": ("stl",), "turnovers": ("tov",), "points": ("pts",),
}
BUCKET = {"PG": "G", "SG": "G", "G": "G", "SF": "F", "PF": "F", "F": "F",
          "GF": "F", "FC": "C", "C": "C"}
# matchup stats: what a defense allows per game to a bucket. Combos sum parts.
ALLOW = {"pts": ["pts"], "reb": ["reb"], "ast": ["ast"], "tpm": ["tpm"],
         "stl": ["stl"], "blk": ["blk"], "tov": ["tov"],
         "pra": ["pts", "reb", "ast"], "pr": ["pts", "reb"], "pa": ["pts", "ast"],
         "ra": ["reb", "ast"], "sb": ["stl", "blk"]}
# for these a defense that gives up MORE is the better defense (forced turnovers)
HIGHER_IS_BETTER_FOR_DEF = {"tov"}


def get_json(url, tries=4, required=True):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:                      # noqa: BLE001
            last = e
            time.sleep(1.5 * (i + 1))
    if required:
        raise RuntimeError(f"{url}: {last}")
    print(f"  (skipped {url.rsplit('/', 1)[-1][:60]}: {last})")
    return None


def _i(v):
    try:
        return int(float(str(v).replace("+", "")))
    except (TypeError, ValueError):
        return 0


def et_date(iso):
    """'2026-05-12T02:30:00.000+00:00' -> '2026-05-11' (the game's ET date)."""
    s = iso.replace("Z", "+00:00")
    if "." in s:
        s = s.split(".")[0] + s[-6:]
    return datetime.fromisoformat(s).astimezone(ET).strftime("%Y-%m-%d")


def rosters():
    """-> players [{id,name,team,pos,bucket,active,headshot,inj}], teams {abbr: espn id}"""
    data = get_json(f"{SITE}/teams?limit=40")
    teams = {}
    for t in data["sports"][0]["leagues"][0]["teams"]:
        teams[t["team"]["abbreviation"]] = t["team"]["id"]
    if len(teams) < 30:
        print(f"ABORT: ESPN returned {len(teams)} teams.", file=sys.stderr)
        sys.exit(1)
    players = []
    for abbr, tid in sorted(teams.items()):
        ros = get_json(f"{SITE}/teams/{tid}/roster")
        for a in ros.get("athletes", []):
            pos = (a.get("position") or {}).get("abbreviation") or "?"
            inj = None
            for x in a.get("injuries") or []:
                st = x.get("status")
                if st:
                    inj = [st, (x.get("details") or {}).get("type") or "", x.get("date") or ""]
                    break
            players.append({
                "id": str(a["id"]),
                "name": a.get("displayName") or a.get("fullName") or "?",
                "team": abbr,
                "pos": pos,
                "bucket": BUCKET.get(pos, "F"),
                "active": 1 if (a.get("status") or {}).get("name", "Active") == "Active" else 0,
                "headshot": (a.get("headshot") or {}).get("href", ""),
                "inj": inj,
            })
    return players, teams


def parse_gamelog(data, teams):
    """-> ([FIELDS rows] date-ordered, {row index: eventId}). Preseason skipped,
    and so is anything against a non-team (All-Star weekend: STARS / STRIPES /
    WORLD show up in the logs as opponents)."""
    if not data or "events" not in data:
        return [], {}
    names = data.get("names") or []
    ev_meta = data.get("events") or {}
    rows, eids = [], {}
    for st in data.get("seasonTypes") or []:
        dn = (st.get("displayName") or "").lower()
        if "preseason" in dn:
            continue
        po = 1 if "postseason" in dn or "playoff" in dn else 0
        for cat in st.get("categories") or []:
            for e in cat.get("events") or []:
                meta = ev_meta.get(str(e.get("eventId")))
                if not meta:
                    continue
                vals = {f: 0 for f in FIELDS}
                for name, raw in zip(names, e.get("stats") or []):
                    fields = STAT_MAP.get(name)
                    if not fields:
                        continue
                    parts = str(raw).split("-") if len(fields) == 2 else [raw]
                    for f, p in zip(fields, parts):
                        vals[f] = _i(p)
                opp = (meta.get("opponent") or {}).get("abbreviation") or "?"
                if opp not in teams or (meta.get("team") or {}).get("abbreviation", opp) not in teams:
                    continue
                home = 1 if meta.get("atVs") == "vs" else 0
                row = [et_date(meta.get("gameDate", "1970-01-01T00:00:00Z")), opp, home, po] + \
                      [vals[f] for f in FIELDS[4:]]
                rows.append((row, str(e.get("eventId"))))
    rows.sort(key=lambda t: t[0][0])
    out = [r for r, _ in rows]
    eids = {i: eid for i, (_, eid) in enumerate(rows)}
    return out, eids


def gamelog(pid, season):
    return get_json(f"{WEB}/athletes/{pid}/gamelog?season={season}", required=False)


def next_games():
    """team -> its next scheduled game {opp, home, utc}. Eight single-day
    scoreboard calls (ESPN rejects date ranges on this endpoint)."""
    out = {}
    today = datetime.now(ET).date()
    for d in range(0, 8):
        day = (today + timedelta(days=d)).strftime("%Y%m%d")
        sb = get_json(f"{SITE}/scoreboard?dates={day}", required=False) or {}
        for ev in sorted(sb.get("events") or [], key=lambda e: e.get("date", "")):
            comp = (ev.get("competitions") or [{}])[0]
            state = ((comp.get("status") or {}).get("type") or {}).get("state")
            if state == "post":
                continue
            cs = comp.get("competitors") or []
            if len(cs) != 2:
                continue
            home = next((c for c in cs if c.get("homeAway") == "home"), None)
            away = next((c for c in cs if c.get("homeAway") == "away"), None)
            if not home or not away:
                continue
            h, a = home["team"]["abbreviation"], away["team"]["abbreviation"]
            for team, opp, is_home in ((h, a, 1), (a, h, 0)):
                if team not in out:
                    out[team] = {"opp": opp, "home": is_home, "utc": ev.get("date", "")}
    return out


def build_matchups(shards, which, eids_by_pid):
    """Per defense, per bucket: average allowed per game this season (regular
    season only), league rank, league average. Built from the shards we hold,
    so a player who left every roster mid-season is not counted."""
    fi = {f: i for i, f in enumerate(FIELDS)}
    per_game = {}                       # (defense, bucket, eventId) -> {field: sum}
    games = {}                          # defense -> set(eventId)
    for sh in shards:
        rows = sh[which]
        eids = eids_by_pid.get((sh["id"], which), {})
        for i, r in enumerate(rows):
            if r[fi["po"]]:
                continue
            eid = eids.get(i)
            if not eid:
                continue
            d = r[fi["opp"]]
            acc = per_game.setdefault((d, sh["bucket"], eid), {})
            for f in ("pts", "reb", "ast", "tpm", "stl", "blk", "tov"):
                acc[f] = acc.get(f, 0) + r[fi[f]]
            games.setdefault(d, set()).add(eid)
    out = {}
    for b in ("G", "F", "C"):
        for stat, parts in ALLOW.items():
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
            order = sorted(vals, key=lambda d: -vals[d]) if stat in HIGHER_IS_BETTER_FOR_DEF \
                else sorted(vals, key=lambda d: vals[d])
            for i, d in enumerate(order, 1):
                out.setdefault(d, {}).setdefault(b, {})[stat] = [round(vals[d], 1), i, round(lg, 1)]
    return {"n": len(games), "games": {d: len(g) for d, g in games.items()}, "ranks": out}


def main():
    print("ESPN rosters…")
    players, teams = rosters()
    print(f"  {len(teams)} teams · {len(players)} rostered players")
    if len(players) < 300:
        print("ABORT: roster pull looks broken, not writing.", file=sys.stderr)
        sys.exit(1)

    os.makedirs(SHARD_DIR, exist_ok=True)
    old = {}
    for p in players:
        try:
            with open(os.path.join(SHARD_DIR, f"{p['id']}.json")) as f:
                old[p["id"]] = json.load(f)
        except (FileNotFoundError, ValueError):
            pass

    eids_by_pid = {}
    team_set = set(teams)

    def work(p):
        cur, cur_eids = parse_gamelog(gamelog(p["id"], SEASON), team_set)
        prev_sh = old.get(p["id"])
        if prev_sh and prev_sh.get("prevSeason") == PREV and not FULL and "prev" in prev_sh:
            prev, prev_eids = [], {}
            old_eids = prev_sh.get("prevEids") or {}
            for i, r in enumerate(prev_sh["prev"]):          # re-apply the non-team filter to cached rows
                if r[1] in team_set:
                    prev_eids[len(prev)] = old_eids.get(str(i))
                    prev.append(r)
        else:
            prev, prev_eids = parse_gamelog(gamelog(p["id"], PREV), team_set)
        return p, cur, cur_eids, prev, prev_eids

    print(f"Game logs ({SEASON} for everyone, {PREV} where not cached)…")
    shards = []
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=6) as ex:
        for n, (p, cur, cur_eids, prev, prev_eids) in enumerate(ex.map(work, players), 1):
            eids_by_pid[(p["id"], "g")] = cur_eids
            eids_by_pid[(p["id"], "prev")] = prev_eids
            shards.append({
                "id": p["id"], "name": p["name"], "team": p["team"], "pos": p["pos"],
                "bucket": p["bucket"], "active": p["active"], "headshot": p["headshot"],
                "prevSeason": PREV,
                "g": cur, "prev": prev,
                # event ids for last season ride along so the matchup table can be
                # rebuilt without refetching; the pages ignore them
                "prevEids": {str(k): v for k, v in prev_eids.items()},
            })
            if n % 100 == 0:
                print(f"  {n}/{len(players)} · {time.time() - t0:.0f}s")
    logged = sum(1 for s in shards if s["g"] or s["prev"])
    if logged < len(shards) * 0.6:
        print(f"ABORT: only {logged}/{len(shards)} players have a game log, not writing.", file=sys.stderr)
        sys.exit(1)

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
    ng = next_games()
    index_body = {
        "season": SEASON, "prevSeason": PREV,
        "seasonLabel": f"{SEASON - 1}-{str(SEASON)[2:]}",
        "prevSeasonLabel": f"{PREV - 1}-{str(PREV)[2:]}",
        "fields": FIELDS,
        "playerCount": len(shards),
        "teams": ng,
        "players": [[sh["id"], sh["name"], sh["team"], sh["pos"], sh["active"]]
                    for sh in sorted(shards, key=lambda s: s["name"])],
    }
    try:
        with open(INDEX_PATH) as f:
            prev_idx = json.load(f)
        if changed == 0 and pruned == 0 and \
           {k: v for k, v in prev_idx.items() if k != "generatedAt"} == index_body:
            generated_at = prev_idx["generatedAt"]
    except Exception:                    # noqa: BLE001
        pass
    with open(INDEX_PATH, "w") as f:
        json.dump({"generatedAt": generated_at, **index_body}, f, separators=(",", ":"))

    mu = build_matchups(shards, "g", eids_by_pid)
    mu_prev = build_matchups(shards, "prev", eids_by_pid)
    mu["season"] = SEASON
    mu["prev"] = {"season": PREV, "n": mu_prev["n"], "games": mu_prev["games"], "ranks": mu_prev["ranks"]}
    with open(MATCHUP_PATH, "w") as f:
        json.dump({"generatedAt": generated_at, **mu}, f, separators=(",", ":"))

    inj = {p["id"]: p["inj"] for p in players if p["inj"]}
    with open(INJ_PATH, "w") as f:
        json.dump({"generatedAt": generated_at, "source": "ESPN roster designations",
                   "players": inj}, f, separators=(",", ":"))

    total = sum(os.path.getsize(os.path.join(SHARD_DIR, f)) for f in os.listdir(SHARD_DIR))
    print(f"Wrote {len(shards)} shards ({changed} changed, {pruned} pruned, {total / 1e6:.1f}MB) "
          f"+ players.json ({len(ng)} team next-games) · matchups: {len(mu['ranks'])} defenses "
          f"this season, {len(mu['prev']['ranks'])} last · injuries: {len(inj)} players")


if __name__ == "__main__":
    main()
