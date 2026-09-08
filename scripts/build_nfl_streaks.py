#!/usr/bin/env python3
"""Derive data/nfl/streaks.json (NFL hot-streaks board) from the NFL player DB.

No network — build_nfl_playerdb.py is the only puller. Streaks run across the
season boundary on purpose (playoffs included): "TD in 6 straight dating to
last season" is exactly the NFL convention, and until 2026 weeks land the
board would otherwise be empty. Windows are L3/L5/L10 — it's a 17-game sport.
"""
import json
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "data", "nfl")
OUT_PATH = os.path.join(ROOT, "streaks.json")

MIN_STREAK = 2
TOP_N = 40
WINDOWS = (3, 5, 10)

# (key, label, group, qualifier fields, value fn description)
# qual: game counts toward the denominator only if he had that kind of usage —
# a WR's 0-carry week shouldn't break (or pad) a rushing streak.
MARKETS = [
    ("td",     "Anytime TD",      "td",   None,
     lambda r, F: r[F["rtd"]] + r[F["rectd"]]),
    ("ryd50",  "50+ Rush Yds",    "rush", ("car", 1), lambda r, F: r[F["ryd"]]),
    ("ryd100", "100+ Rush Yds",   "rush", ("car", 1), lambda r, F: r[F["ryd"]]),
    ("rec4",   "4+ Receptions",   "recv", ("tgt", 1), lambda r, F: r[F["rec"]]),
    ("rec6",   "6+ Receptions",   "recv", ("tgt", 1), lambda r, F: r[F["rec"]]),
    ("recyd50", "50+ Rec Yds",    "recv", ("tgt", 1), lambda r, F: r[F["recyd"]]),
    ("recyd75", "75+ Rec Yds",    "recv", ("tgt", 1), lambda r, F: r[F["recyd"]]),
    ("pyd250", "250+ Pass Yds",   "pass", ("att", 10), lambda r, F: r[F["pyd"]]),
    ("ptd2",   "2+ Pass TDs",     "pass", ("att", 10), lambda r, F: r[F["ptd"]]),
]
LINES = {"td": 0.5, "ryd50": 49.5, "ryd100": 99.5, "rec4": 3.5, "rec6": 5.5,
         "recyd50": 49.5, "recyd75": 74.5, "pyd250": 249.5, "ptd2": 1.5}


def player_row(sh, games, values, line, cur_count):
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
        "name": sh["name"], "team": sh["team"], "pos": sh["pos"], "pid": sh["id"],
        "streak": streak,
        "carried": streak > cur_count,   # part of the run predates this season
        "games": n,
        "rate": round(sum(hits) / n, 3),
        "seq": [1 if b else 0 for b in hits[-10:]],
    }
    for w in WINDOWS:
        win = hits[-w:]
        row[f"l{w}"] = sum(win)
        row[f"l{w}n"] = len(win)
    return row


def market_rows(rows):
    keep = set()
    views = [
        (lambda r: (-r["streak"], -r["rate"]), lambda r: r["streak"] >= MIN_STREAK),
        *[(lambda r, w=w: (-r[f"l{w}"], -r[f"l{w}"] / max(r[f"l{w}n"], 1), -r["rate"]),
           lambda r, w=w: r[f"l{w}"] >= 2) for w in WINDOWS],
    ]
    for keyfn, incl in views:
        for r in sorted([r for r in rows if incl(r)], key=keyfn)[:TOP_N]:
            keep.add(r["pid"])
    out = [r for r in rows if r["pid"] in keep]
    out.sort(key=lambda r: (-r["streak"], -r["rate"]))
    return out


def main():
    index = json.load(open(os.path.join(ROOT, "players.json")))
    F = {f: i for i, f in enumerate(index["fields"])}
    shards = []
    for pid, *_ in index["players"]:
        with open(os.path.join(ROOT, "players", f"{pid}.json")) as f:
            shards.append(json.load(f))

    markets = []
    for key, label, group, qual, val in MARKETS:
        line = LINES[key]
        rows = []
        for sh in shards:
            if not sh["active"]:
                continue                     # a cut/retired player can't extend a streak
            games = sh["prev"] + sh["g"]     # streaks cross the season boundary
            if qual:
                qf, qmin = qual
                games = [r for r in games if r[F[qf]] >= qmin]
            if not games:
                continue
            row = player_row(sh, games, [val(r, F) for r in games], line,
                             cur_count=len([r for r in sh["g"]]))
            if row:
                rows.append(row)
        players = market_rows(rows)
        markets.append({"key": key, "label": label, "group": group,
                        "line": line, "players": players})
        print(f"{label}: {len(players)} players, best streak "
              f"{players[0]['streak'] if players else 0}")

    out = {
        "generatedAt": index["generatedAt"],
        "season": index["season"], "prevSeason": index["prevSeason"],
        "weeksPlayed": max((r[F["week"]] for sh in shards for r in sh["g"]), default=0),
        "teams": index["teams"],
        "markets": markets,
    }
    with open(OUT_PATH, "w") as f:
        json.dump(out, f, separators=(",", ":"))
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
