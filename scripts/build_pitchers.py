#!/usr/bin/env python3
"""Derive data/pitchers.json + data/pitchers_prev.json from the player DB.

No API calls — build_playerdb.py is the only puller. Run it first.
Output format is unchanged from the fetch-based version of this script,
so starting-pitchers.html needs no edits.
"""
import json
import os
from datetime import datetime, timezone

ROOT = os.path.join(os.path.dirname(__file__), "..", "data")

# The board's per-start layout (unchanged): shard rows carry the same fields
# plus a `gs` flag, which selects starts and is then dropped.
FIELDS = ["date", "opp", "home", "outs", "h", "hr", "er", "k", "bb", "r", "bf", "pit"]


def starts_from(shard_rows, PF):
    out = []
    for r in shard_rows:
        if r[PF["gs"]] >= 1:
            out.append([r[PF[f]] for f in FIELDS])
    return out


def main():
    index = json.load(open(os.path.join(ROOT, "players.json")))
    PF = {f: i for i, f in enumerate(index["pitFields"])}

    cur, prev = {}, {}
    for pid, *_ in index["players"]:
        with open(os.path.join(ROOT, "players", f"{pid}.json")) as f:
            sh = json.load(f)
        pit = sh.get("pit")
        if not pit:
            continue
        g = starts_from(pit.get("g", []), PF)
        if g:
            cur[str(pid)] = {"name": sh["name"], "team": sh["team"], "starts": g}
        p = starts_from(pit.get("prev", []), PF)
        if p:
            prev[str(pid)] = {"name": sh["name"], "starts": p}

    now = index["generatedAt"]   # derived data is exactly as fresh as its source
    for path, season, pitchers in (
            (os.path.join(ROOT, "pitchers.json"), index["season"], cur),
            (os.path.join(ROOT, "pitchers_prev.json"), index["prevSeason"], prev)):
        payload = {"generatedAt": now, "season": season, "fields": FIELDS,
                   "pitcherCount": len(pitchers), "pitchers": pitchers}
        with open(path, "w") as f:
            json.dump(payload, f, separators=(",", ":"))
        total = sum(len(v["starts"]) for v in pitchers.values())
        print(f"Wrote {path} — {len(pitchers)} pitchers, {total} starts")


if __name__ == "__main__":
    main()
