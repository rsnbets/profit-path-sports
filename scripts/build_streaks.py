#!/usr/bin/env python3
"""Build data/streaks.json — active MLB player prop streaks.

Pulls every active-roster player's season game log from the free MLB Stats API
(statsapi.mlb.com, no key) and computes the longest ACTIVE streak for each
prop/threshold the site cares about. The hot-streaks.html page merges this file
with live odds from the prop-zone slate client-side.

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
SEASON = int(os.environ.get("STREAKS_SEASON", "2026"))
OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "streaks.json")

# (slate market key, line, label, stat getter). Market keys match the
# prop-zone slate so the page can join odds by market+player.
# "points" is the slate's key for Runs Scored.
def _hrr(s):
    return _n(s.get("hits")) + _n(s.get("runs")) + _n(s.get("rbi"))

def _n(v):
    return v if isinstance(v, (int, float)) else 0

BATTER_MARKETS = [
    ("batting_hits", 0.5, "1+ Hits", lambda s: _n(s.get("hits"))),
    ("batting_hits", 1.5, "2+ Hits", lambda s: _n(s.get("hits"))),
    ("batting_totalBases", 1.5, "2+ Total Bases", lambda s: _n(s.get("totalBases"))),
    ("batting_totalBases", 2.5, "3+ Total Bases", lambda s: _n(s.get("totalBases"))),
    ("batting_RBI", 0.5, "1+ RBI", lambda s: _n(s.get("rbi"))),
    ("points", 0.5, "1+ Run", lambda s: _n(s.get("runs"))),
    ("batting_hits+runs+rbi", 1.5, "2+ H+R+RBI", _hrr),
    ("batting_homeRuns", 0.5, "Home Run", lambda s: _n(s.get("homeRuns"))),
    ("batting_basesOnBalls", 0.5, "1+ Walk", lambda s: _n(s.get("baseOnBalls"))),
    ("batting_strikeouts", 0.5, "1+ Batter K", lambda s: _n(s.get("strikeOuts"))),
]
# Pitcher streaks count STARTS only.
PITCHER_MARKETS = [
    ("pitching_strikeouts", 4.5, "5+ Ks", lambda s: _n(s.get("strikeOuts"))),
    ("pitching_strikeouts", 5.5, "6+ Ks", lambda s: _n(s.get("strikeOuts"))),
    ("pitching_strikeouts", 6.5, "7+ Ks", lambda s: _n(s.get("strikeOuts"))),
    ("pitching_outs", 17.5, "6+ Innings", lambda s: _n(s.get("outs"))),
]

MIN_STREAK = 2          # below this a "streak" is noise; keep the file small
TOP_N = 40              # per ranking view (streak / L5 / L10 / L15)
RETRIES = 3


def get_json(url):
    last = None
    for i in range(RETRIES):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "pps-streaks/1.0"})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:  # transient API hiccups — retry with backoff
            last = e
            time.sleep(1.5 * (i + 1))
    raise last


def fetch_players():
    teams = get_json(f"{API}/teams?sportId=1&season={SEASON}")["teams"]
    abbrev = {t["id"]: t.get("abbreviation", "?") for t in teams}
    players = []
    for t in teams:
        roster = get_json(f"{API}/teams/{t['id']}/roster?rosterType=active&season={SEASON}")
        for r in roster.get("roster", []):
            players.append({
                "id": r["person"]["id"],
                "name": r["person"]["fullName"],
                "team": abbrev[t["id"]],
                "pos": r["position"]["abbreviation"],
            })
    return players


def fetch_log(player):
    is_pitcher = player["pos"] == "P"
    is_twp = player["pos"] == "TWP"
    groups = "pitching" if is_pitcher else ("hitting,pitching" if is_twp else "hitting")
    url = f"{API}/people/{player['id']}/stats?stats=gameLog&season={SEASON}&group={groups}"
    try:
        data = get_json(url)
    except Exception as e:
        print(f"  ! {player['name']}: {e}", file=sys.stderr)
        return None
    out = {"player": player, "hitting": [], "pitching": []}
    for block in data.get("stats", []):
        g = block.get("group", {}).get("displayName")
        splits = sorted(block.get("splits", []), key=lambda s: s.get("date", ""))
        if g in ("hitting", "pitching"):
            out[g] = [{"date": s.get("date", ""), "stat": s.get("stat", {})} for s in splits]
    return out


def player_row(player, games, getter, line):
    """games: newest-last list of qualifying {date, stat} game entries."""
    if not games:
        return None
    hits = [getter(g["stat"]) > line for g in games]
    streak = 0
    for ok in reversed(hits):
        if not ok:
            break
        streak += 1
    n = len(hits)
    row = {
        "name": player["name"],
        "team": player["team"],
        "mlbId": player["id"],
        "streak": streak,
        "since": games[-streak]["date"] if streak else None,
        "games": n,
        "rate": round(sum(hits) / n, 3),
        "seq": [1 if b else 0 for b in hits[-15:]],
    }
    for w in (5, 10, 15):
        win = hits[-w:]
        row[f"l{w}"] = sum(win)
        row[f"l{w}n"] = len(win)
    return row


def market_rows(rows):
    """Union of the top-N players under each ranking view, streak-sorted."""
    keep = set()
    views = [
        (lambda r: (-r["streak"], -r["rate"]), lambda r: r["streak"] >= MIN_STREAK),
        *[(lambda r, w=w: (-r[f"l{w}"], -r[f"l{w}"] / max(r[f"l{w}n"], 1), -r["rate"]),
           lambda r, w=w: r[f"l{w}"] >= 2) for w in (5, 10, 15)],
    ]
    for keyfn, incl in views:
        ranked = sorted([r for r in rows if incl(r)], key=keyfn)[:TOP_N]
        keep.update(r["mlbId"] for r in ranked)
    out = [r for r in rows if r["mlbId"] in keep]
    out.sort(key=lambda r: (-r["streak"], -r["rate"]))
    return out


def main():
    print("Fetching active rosters…")
    players = fetch_players()
    print(f"{len(players)} active players. Fetching game logs…")

    logs = []
    with ThreadPoolExecutor(max_workers=12) as ex:
        for i, log in enumerate(ex.map(fetch_log, players)):
            if log:
                logs.append(log)
            if (i + 1) % 100 == 0:
                print(f"  {i + 1}/{len(players)}")

    markets = []
    for mkey, line, label, getter in BATTER_MARKETS:
        rows = []
        for log in logs:
            batting = [g for g in log["hitting"] if _n(g["stat"].get("plateAppearances")) >= 1]
            r = player_row(log["player"], batting, getter, line)
            if r:
                rows.append(r)
        players = market_rows(rows)
        markets.append({"market": mkey, "line": line, "label": label,
                        "group": "batter", "players": players})
        print(f"{label}: {len(players)} players, best streak {players[0]['streak'] if players else 0}")

    for mkey, line, label, getter in PITCHER_MARKETS:
        rows = []
        for log in logs:
            starts = [g for g in log["pitching"] if _n(g["stat"].get("gamesStarted")) >= 1]
            r = player_row(log["player"], starts, getter, line)
            if r:
                rows.append(r)
        players = market_rows(rows)
        markets.append({"market": mkey, "line": line, "label": label,
                        "group": "pitcher", "players": players})
        print(f"{label}: {len(players)} players, best streak {players[0]['streak'] if players else 0}")

    out = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "season": SEASON,
        "playerCount": len(logs),
        "markets": markets,
    }
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(out, f, separators=(",", ":"))
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
