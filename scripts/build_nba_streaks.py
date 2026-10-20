#!/usr/bin/env python3
"""Derive data/nba/streaks.json (NBA streak scanner) from the NBA player DB.

No network: build_nba_playerdb.py is the only puller. Streaks run across the
season boundary, playoffs included, the same convention as the NFL board, so
the scanner is not empty on opening night. Only games with minutes count: a
DNP cannot break or pad a run. Windows are L5 / L10 / L20, an 82-game sport.
"""
import json
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "data", "nba")
OUT_PATH = os.path.join(ROOT, "streaks.json")

MIN_STREAK = 2
TOP_N = 40
WINDOWS = (5, 10, 20)

# (key, label, group, line, value fn)
MARKETS = [
    ("pts15",  "15+ Points",      "scoring", 14.5, lambda r, F: r[F["pts"]]),
    ("pts20",  "20+ Points",      "scoring", 19.5, lambda r, F: r[F["pts"]]),
    ("pts25",  "25+ Points",      "scoring", 24.5, lambda r, F: r[F["pts"]]),
    ("pts30",  "30+ Points",      "scoring", 29.5, lambda r, F: r[F["pts"]]),
    ("reb6",   "6+ Rebounds",     "boards",  5.5,  lambda r, F: r[F["reb"]]),
    ("reb8",   "8+ Rebounds",     "boards",  7.5,  lambda r, F: r[F["reb"]]),
    ("reb10",  "10+ Rebounds",    "boards",  9.5,  lambda r, F: r[F["reb"]]),
    ("ast4",   "4+ Assists",      "boards",  3.5,  lambda r, F: r[F["ast"]]),
    ("ast6",   "6+ Assists",      "boards",  5.5,  lambda r, F: r[F["ast"]]),
    ("ast8",   "8+ Assists",      "boards",  7.5,  lambda r, F: r[F["ast"]]),
    ("tpm2",   "2+ Threes",       "threes",  1.5,  lambda r, F: r[F["tpm"]]),
    ("tpm3",   "3+ Threes",       "threes",  2.5,  lambda r, F: r[F["tpm"]]),
    ("tpm4",   "4+ Threes",       "threes",  3.5,  lambda r, F: r[F["tpm"]]),
    ("pra25",  "25+ Pts+Reb+Ast", "combos",  24.5, lambda r, F: r[F["pts"]] + r[F["reb"]] + r[F["ast"]]),
    ("pra35",  "35+ Pts+Reb+Ast", "combos",  34.5, lambda r, F: r[F["pts"]] + r[F["reb"]] + r[F["ast"]]),
    ("dd",     "Double-Double",   "combos",  0.5,  lambda r, F: 1 if sum(1 for k in ("pts", "reb", "ast", "stl", "blk") if r[F[k]] >= 10) >= 2 else 0),
    ("stl1",   "1+ Steal",        "defense", 0.5,  lambda r, F: r[F["stl"]]),
    ("stl2",   "2+ Steals",       "defense", 1.5,  lambda r, F: r[F["stl"]]),
    ("blk1",   "1+ Block",        "defense", 0.5,  lambda r, F: r[F["blk"]]),
    ("blk2",   "2+ Blocks",       "defense", 1.5,  lambda r, F: r[F["blk"]]),
    ("sb2",    "2+ Stl+Blk",      "defense", 1.5,  lambda r, F: r[F["stl"]] + r[F["blk"]]),
]


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
    for key, label, group, line, val in MARKETS:
        rows = []
        for sh in shards:
            if not sh["active"]:
                continue
            games = [r for r in sh["prev"] + sh["g"] if r[F["min"]] > 0]   # played only
            if not games:
                continue
            row = player_row(sh, games, [val(r, F) for r in games], line,
                             cur_count=len([r for r in sh["g"] if r[F["min"]] > 0]))
            if row:
                rows.append(row)
        players = market_rows(rows)
        markets.append({"key": key, "label": label, "group": group,
                        "line": line, "players": players})
        print(f"{label}: {len(players)} players, best streak "
              f"{players[0]['streak'] if players else 0}")

    cur_dates = sorted({r[F["date"]] for sh in shards for r in sh["g"]})
    out = {
        "generatedAt": index["generatedAt"],
        "season": index["season"], "prevSeason": index["prevSeason"],
        "seasonLabel": index["seasonLabel"], "prevSeasonLabel": index["prevSeasonLabel"],
        "gameDays": len(cur_dates),
        "lastGameDate": cur_dates[-1] if cur_dates else None,
        "teams": index["teams"],
        "markets": markets,
    }
    with open(OUT_PATH, "w") as f:
        json.dump(out, f, separators=(",", ":"))
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
