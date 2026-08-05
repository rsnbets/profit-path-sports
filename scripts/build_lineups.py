#!/usr/bin/env python3
"""Snapshot RotoWire's projected MLB lineups → data/lineups.json.

Adapted from the HR projector's rotowire_client (same selectors, same ARI→AZ
fix). This file only matters BEFORE lineups are official: the player page
checks MLB's own API live for confirmed lineups first (statsapi posts them the
moment the card drops, with player ids), and falls back to this snapshot for
the "projected, batting 5th" designation earlier in the day.

Runs on its own workflow several times a day — lineups are intraday data, the
nightly stats build is not the right vehicle. Commit-if-changed keeps quiet
runs free.

Needs: requests, beautifulsoup4 (pip-installed in the workflow).
"""
import json
import os
import sys
from datetime import datetime, timezone

import requests
from bs4 import BeautifulSoup

URL = "https://www.rotowire.com/baseball/daily-lineups.php"
HEADERS = {
    "User-Agent": ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                   "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36")
}
# RotoWire uses ARI for Arizona; MLB's official abbreviation is AZ.
_ABBR_FIX = {"ARI": "AZ"}
OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "lineups.json")


def fetch():
    out = {}
    html = requests.get(URL, headers=HEADERS, timeout=20).text
    soup = BeautifulSoup(html, "html.parser")
    for box in soup.select(".lineup.is-mlb"):
        abbrs = [a.get_text(strip=True) for a in box.select(".lineup__abbr")]
        if len(abbrs) < 2:
            continue
        # First abbr = visiting team, second = home (RotoWire's layout).
        for side, abbr in (("is-visit", abbrs[0]), ("is-home", abbrs[1])):
            lst = box.select_one(f".lineup__list.{side}")
            if not lst:
                continue
            abbr = _ABBR_FIX.get(abbr, abbr)
            status = lst.select_one(".lineup__status")
            confirmed = bool(status and "is-confirmed" in (status.get("class") or []))
            players = []
            for a in lst.select(".lineup__player a"):
                name = (a.get("title") or a.get_text(strip=True)).strip()
                if name:
                    players.append([len(players) + 1, name])
            if players:
                out[abbr] = {"confirmed": confirmed, "players": players[:9]}
    return out


def main():
    teams = fetch()
    if len(teams) < 2:
        # A markup change or a block shouldn't wipe yesterday's snapshot —
        # stale projected lineups beat none, and confirmed comes live anyway.
        print(f"Only {len(teams)} lineups parsed — refusing to overwrite.",
              file=sys.stderr)
        sys.exit(1)
    payload = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "rotowire",
        "teams": teams,
    }
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(payload, f, separators=(",", ":"))
    conf = sum(1 for t in teams.values() if t["confirmed"])
    print(f"Wrote {OUT_PATH} — {len(teams)} lineups ({conf} confirmed)")


if __name__ == "__main__":
    main()
