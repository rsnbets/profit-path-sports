#!/usr/bin/env python3
"""Derive data/streaks.json (hot-streaks board) from the on-repo player DB.

No API calls — build_playerdb.py is the only puller. Run it first.
Output format is unchanged from the fetch-based version of this script,
so hot-streaks.html needs no edits.
"""
import json
import os
from datetime import datetime, timezone

ROOT = os.path.join(os.path.dirname(__file__), "..", "data")
OUT_PATH = os.path.join(ROOT, "streaks.json")

MIN_STREAK = 2          # below this a "streak" is noise; keep the file small
TOP_N = 40              # per ranking view (streak / L5 / L10 / L15)

# (slate market key, line, label, shard field for the stat). Market keys match
# the prop-zone slate so the page can join odds. "points" = Runs Scored.
BATTER_MARKETS = [
    ("batting_hits", 0.5, "1+ Hits", "h"),
    ("batting_hits", 1.5, "2+ Hits", "h"),
    ("batting_totalBases", 1.5, "2+ Total Bases", "tb"),
    ("batting_totalBases", 2.5, "3+ Total Bases", "tb"),
    ("batting_RBI", 0.5, "1+ RBI", "rbi"),
    ("points", 0.5, "1+ Run", "r"),
    ("batting_hits+runs+rbi", 1.5, "2+ H+R+RBI", "hrr"),
    ("batting_homeRuns", 0.5, "Home Run", "hr"),
    ("batting_basesOnBalls", 0.5, "1+ Walk", "bb"),
    ("batting_strikeouts", 0.5, "1+ Batter K", "k"),
]
# Pitcher streaks count STARTS only.
PITCHER_MARKETS = [
    ("pitching_strikeouts", 4.5, "5+ Ks", "k"),
    ("pitching_strikeouts", 5.5, "6+ Ks", "k"),
    ("pitching_strikeouts", 6.5, "7+ Ks", "k"),
    ("pitching_outs", 17.5, "6+ Innings", "outs"),
]


def player_row(shard, games, values, dates, line):
    """values/dates: newest-last per qualifying game."""
    if not games:
        return None
    hits = [v > line for v in values]
    streak = 0
    for ok in reversed(hits):
        if not ok:
            break
        streak += 1
    n = len(hits)
    row = {
        "name": shard["name"], "team": shard["team"], "mlbId": shard["id"],
        "streak": streak,
        "since": dates[-streak] if streak else None,
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
    index = json.load(open(os.path.join(ROOT, "players.json")))
    BF = {f: i for i, f in enumerate(index["batFields"])}
    PF = {f: i for i, f in enumerate(index["pitFields"])}

    shards = []
    for pid, *_ in index["players"]:
        with open(os.path.join(ROOT, "players", f"{pid}.json")) as f:
            shards.append(json.load(f))

    markets = []
    for mkey, line, label, field in BATTER_MARKETS:
        rows = []
        for sh in shards:
            g = sh.get("bat", {}).get("g", [])
            if not g:
                continue
            if field == "hrr":
                vals = [r[BF["h"]] + r[BF["r"]] + r[BF["rbi"]] for r in g]
            else:
                vals = [r[BF[field]] for r in g]
            row = player_row(sh, g, vals, [r[BF["date"]] for r in g], line)
            if row:
                rows.append(row)
        players = market_rows(rows)
        markets.append({"market": mkey, "line": line, "label": label,
                        "group": "batter", "players": players})
        print(f"{label}: {len(players)} players, best streak "
              f"{players[0]['streak'] if players else 0}")

    for mkey, line, label, field in PITCHER_MARKETS:
        rows = []
        for sh in shards:
            g = [r for r in sh.get("pit", {}).get("g", []) if r[PF["gs"]] >= 1]
            if not g:
                continue
            row = player_row(sh, g, [r[PF[field]] for r in g],
                             [r[PF["date"]] for r in g], line)
            if row:
                rows.append(row)
        players = market_rows(rows)
        markets.append({"market": mkey, "line": line, "label": label,
                        "group": "pitcher", "players": players})
        print(f"{label}: {len(players)} players, best streak "
              f"{players[0]['streak'] if players else 0}")

    out = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "season": index["season"],
        "playerCount": len(shards),
        "markets": markets,
    }
    with open(OUT_PATH, "w") as f:
        json.dump(out, f, separators=(",", ":"))
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
