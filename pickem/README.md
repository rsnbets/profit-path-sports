# PPS Pick'em v1 (shadow mode)

Weekly NFL pick'em "who can still win" board. Unlisted, `noindex`, no accounts, no pick entry, no server writes.

Picks for the 2026 shadow season are published with the site as `pickem/data/picks-<season>-w<week>.json` (option A, decided Oct 18 2026: the pool owner accepted that handles and picks are visible in this public repo). Without a published file the page falls back to a browser import or a share link.

Pages: `index.html` (live board) and `standings.html` (week grid). No season-long data: the pool is weekly. Add `?demo=1` to either for the anonymized design fixture.

## Sunday routine (shadow mode)

1. Once PoolHost shows the picks (they are visible only after they lock, at the first Sunday kickoff), download the All Picks page (`allpicks.xls`).
2. Publish it: `node pickem/publish_picks.js ~/Downloads/allpicks.xls`, then commit and push `pickem/data/picks-<key>.json`. "No Picks" accounts sat the week out and are left off the board. Fallback without a push: drop the file into the page's "Pool data" panel on one device and use "Copy share link" for the others.
3. The board runs on its own: ESPN scores every 60 seconds while games are live, exact enumeration of every ending, what-ifs by tapping teams.
4. After MNF: "Export week JSON" saves the snapshot log (status + win % for every player at picks-locked time and after each final). Keep it in `pickem/private/` for calibration later. Never commit it.

## Data build

`pickem/data/<season>-w<week>.json` comes from `pickem/build.py` (GitHub Action `pickem-data.yml`, or locally with the sibling `NFL_EV/` clone):

```bash
python3 pickem/build.py --week 6
```

Per game: nflverse id, ESPN id, kickoff and lock time (zoneinfo), frozen `p_home` with `p_source` (`store` = power de-vig per book, median across books, from the last `lines.json` commit in `rsnbets/nfl-ev` before kickoff; `nflverse` = fallback), snapshot time and gap in minutes, and the market total for the tiebreak game. `latest.json` points the page at the current week. No picks in these files.

In CI the store needs the `NFL_EV_TOKEN` secret (read access to `rsnbets/nfl-ev`). Without it every game is tagged `nflverse`.

## Tests

```bash
node pickem/tests/run.js && python3 pickem/tests/test_lock.py
```

Fixture (anonymized, plus the raw handoff fixture and any `pickem/private/fixture-*.json` when present), Monte Carlo vs exact, win % sums to 100, tiebreak shares, performance (14 games x 50 players), parser round trip, PoolHost adapter and validation, copy rules, lock rule with DST.

See `STEP0_FINDINGS.md` for the odds-store timing, the ESPN field check, and the open questions.
