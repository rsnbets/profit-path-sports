#!/usr/bin/env python3
"""Build data/pitchers.json — per-start logs for every 2026 starting pitcher.

The starting-pitchers.html board joins this against TODAY'S probable pitchers,
which it fetches live from statsapi in the browser (that API sends
Access-Control-Allow-Origin: *). That split matters: probables get named,
confirmed, and scratched all day long, so the volatile part stays live while
the expensive part (a season of game logs) is prebuilt here once a day.

Every pitcher with >=1 start this season is included, not just today's
probables, so a late-named or just-activated starter still resolves.

Stdlib only — safe to run in a bare GitHub Actions python container.
"""
import json
import os
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

API = "https://statsapi.mlb.com/api/v1"
SEASON = int(os.environ.get("PITCHERS_SEASON", "2026"))
OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "pitchers.json")

# Per-start record layout. Kept as a bare array per start (and published in the
# JSON as "fields") because keys-per-start would triple the file size.
FIELDS = ["date", "opp", "home", "outs", "h", "hr", "er", "k", "bb", "r", "bf", "pit"]
RETRIES = 3


def get_json(url):
    last = None
    for i in range(RETRIES):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "pps-pitchers/1.0"})
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.load(r)
        except Exception as e:  # transient API hiccups — retry with backoff
            last = e
            time.sleep(1.5 * (i + 1))
    raise last


def _n(v):
    return v if isinstance(v, (int, float)) else 0


def fetch_team_abbrevs():
    teams = get_json(f"{API}/teams?sportId=1&season={SEASON}")["teams"]
    return {t["id"]: t.get("abbreviation", "?") for t in teams}


def fetch_game_teams():
    """gamePk -> (awayTeamId, homeTeamId) for the whole regular season."""
    sched = get_json(f"{API}/schedule?sportId=1&startDate={SEASON}-02-15"
                     f"&endDate={SEASON}-12-01&gameType=R")
    out = {}
    for day in sched.get("dates", []):
        for g in day.get("games", []):
            out[g["gamePk"]] = (g["teams"]["away"]["team"]["id"],
                                g["teams"]["home"]["team"]["id"])
    return out


def fetch_starters():
    """Every pitcher with at least one start this season."""
    data = get_json(f"{API}/stats?stats=season&group=pitching&season={SEASON}"
                    f"&sportId=1&limit=1500&playerPool=All")
    out = []
    for s in data["stats"][0]["splits"]:
        if _n(s["stat"].get("gamesStarted")) >= 1:
            out.append({
                "id": s["player"]["id"],
                "name": s["player"]["fullName"],
                "teamId": s.get("team", {}).get("id"),
            })
    return out


def fetch_starts(pitcher, game_teams, abbrevs):
    url = (f"{API}/people/{pitcher['id']}/stats?stats=gameLog"
           f"&season={SEASON}&group=pitching")
    try:
        data = get_json(url)
    except Exception as e:
        print(f"  ! {pitcher['name']}: {e}", file=sys.stderr)
        return None

    rows = []
    for block in data.get("stats", []):
        if block.get("group", {}).get("displayName") != "pitching":
            continue
        for sp in sorted(block.get("splits", []), key=lambda s: s.get("date", "")):
            st = sp.get("stat", {})
            if _n(st.get("gamesStarted")) < 1:
                continue          # relief appearances would poison the averages
            # gameLog leaves `opponent` empty, so resolve it off the gamePk
            team_id = (sp.get("team") or {}).get("id")
            away, home = game_teams.get((sp.get("game") or {}).get("gamePk"), (None, None))
            opp_id = away if team_id == home else home
            rows.append([
                sp.get("date", ""),
                abbrevs.get(opp_id, "?"),
                1 if sp.get("isHome") else 0,
                _n(st.get("outs")),
                _n(st.get("hits")),
                _n(st.get("homeRuns")),
                _n(st.get("earnedRuns")),
                _n(st.get("strikeOuts")),
                _n(st.get("baseOnBalls")),
                _n(st.get("runs")),
                _n(st.get("battersFaced")),
                _n(st.get("numberOfPitches")),
            ])
    if not rows:
        return None
    return {
        "id": pitcher["id"],
        "name": pitcher["name"],
        "team": abbrevs.get(pitcher["teamId"], "?"),
        "starts": rows,
    }


def main():
    print("Fetching team map and season schedule…")
    abbrevs = fetch_team_abbrevs()
    game_teams = fetch_game_teams()
    print(f"{len(game_teams)} games mapped.")

    starters = fetch_starters()
    print(f"{len(starters)} pitchers with a start. Fetching game logs…")

    out = {}
    with ThreadPoolExecutor(max_workers=12) as ex:
        futures = [ex.submit(fetch_starts, p, game_teams, abbrevs) for p in starters]
        for i, f in enumerate(futures):
            rec = f.result()
            if rec:
                out[str(rec["id"])] = {"name": rec["name"], "team": rec["team"],
                                       "starts": rec["starts"]}
            if (i + 1) % 100 == 0:
                print(f"  {i + 1}/{len(starters)}")

    payload = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "season": SEASON,
        "fields": FIELDS,
        "pitcherCount": len(out),
        "pitchers": out,
    }
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(payload, f, separators=(",", ":"))
    total = sum(len(v["starts"]) for v in out.values())
    print(f"Wrote {OUT_PATH} — {len(out)} pitchers, {total} starts")


if __name__ == "__main__":
    main()
