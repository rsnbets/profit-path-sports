# PPS Pick'em v1 (shadow mode)

Weekly NFL pick'em "who can still win" board. Unlisted, `noindex`, no accounts, no pick entry, no server writes. Pool picks are loaded in the browser and stay there.

Pages: `index.html` (live board) and `standings.html` (week grid + season). Add `?demo=1` to either for the anonymized design fixture.

## Sunday routine (shadow mode)

1. After the pool deadline, fill `picks-template-<season>-w<week>.csv` (header `player,tiebreak,AWAY@HOME,...`, nflverse codes, `LA` = Rams, `WAS`). Download a blank one from the page's "Pool data" panel.
2. Open the live board, open "Pool data", drop the CSV (or paste it). Read the validation report. Fix anything red.
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

Fixture (anonymized, plus the raw handoff fixture and any `pickem/private/fixture-*.json` when present), Monte Carlo vs exact, win % sums to 100, tiebreak shares, performance (14 games x 50 players), parser round trip and validation, copy rules, lock rule with DST.

See `STEP0_FINDINGS.md` for the odds-store timing, the ESPN field check, and the open questions.
