# PPS Pick'em v1: Step 0 findings

Written Oct 15, 2026 (2026 Week 6), before any build work.

Verdict: 0.1 passes on coverage (NFL moneylines per book and totals per book for every game are in the store). Snapshot timing is the weak spot, and the store's scheduled pull is currently broken. Details below. The build continues.

## 0.1 Odds store NFL coverage

There is no survivor board on this machine and no earlier `STEP0_FINDINGS.md`, so this was measured fresh.

**Where the store is.** The NFL odds store is `rsnbets/nfl-ev` (private repo, local clone at `NFL_EV/`, gitignored from this site repo). Its GitHub Action commits `lines.json` after every pull. `lines.json` is the game-lines feed: one record per game with `eventID`, `startsAt` (UTC), `away`, `home` (nflverse codes, `LA` = Rams, `WAS`), `ml` (moneyline pair per book), `spread` and `total` (per line, per book), and a `sgo` block with the consensus total. The `history/nfl/*.jsonl` files are props only, not game lines. `nfl_slate.json` (the 7 MB Underdog slate) goes to `rsnbets/nfl-odds` and is also private.

So the "store snapshot" for this tool is the git history of `lines.json` in `rsnbets/nfl-ev`.

**Coverage.** Every one of the 93 games seen since Sep 9 has a moneyline from 20 to 23 books and a total ladder with 76 to 109 line keys. Books present on moneylines: draftkings, fanduel, betmgm, caesars, espnbet, hardrockbet, betrivers, sugarhouse, ballybet, pointsbet, fliff, thescorebet, bovada, betonline, betus, lowvig, mybookie, betanysports, bookmakereu, plus novig, prophetexchange, matchbook, betfairexchange. No `unknown` junk book on NFL moneylines. All 14 Week 6 games are present with 20 to 23 books each.

**Snapshot timing.** Last `lines.json` commit before kickoff, measured over the 79 games that have already kicked off (Weeks 1 to 5 plus the Week 6 Thursday game):

| Kickoff window | Typical gap to last pre-kickoff snapshot |
|---|---|
| Sunday 1:00 PM ET (17:00 UTC) | 578 to 639 minutes (about 10 hours) |
| London 9:30 AM ET (13:30 UTC) | 368 to 387 minutes |
| Sunday 4:05 / 4:25 PM ET | 48 to 156 minutes |
| Sunday night | 95 to 180 minutes |
| Monday night | 28 to 149 minutes |
| Thursday night | 33 to 185 minutes |

Median across all 79 games: 578 minutes. The 1:00 PM ET window is the problem. The Action's 15:00 UTC cron does not land before 17:00 UTC on Sundays in practice. The commit log shows the four daily pulls landing near 02:00, 07:30, 19:00 to 20:30, and 22:00 to 23:00 UTC, not at the scheduled 01:30, 15:00, 19:00, 23:00. GitHub cron drift on the 15:00 slot pushes it past the early kickoffs, so the early-window "frozen at kickoff" number is really a Saturday-night number.

What the build does about it: the data build takes the last snapshot before each game's kickoff and records `gap_minutes` per game, so the page and the calibration log always know how stale the freeze is. Nothing is hidden.

What would fix it (belongs in the fetcher, not this tool): add two Sunday crons to `rsnbets/nfl-ev`, for example `30 16 * * 0` and `45 19 * * 0` UTC, plus `0 0 * * 1` for SNF and `0 0 * * 2` for MNF. Each is one lines-only pull (about 16 SGO entities). Not done here.

**The scheduled pull is broken right now.** Every scheduled run of `rsnbets/nfl-ev` since Oct 13 20:27 UTC has failed (8 in a row as of Oct 15). The log says `git add` refused `nfl_slate.json` because the file is now gitignored, and the step exits 1. The three successful runs on Oct 15 were manual `workflow_dispatch` runs. The commit step in the checked-in workflow adds `master.json lines.json props.json history/` only, so the working copy differs from what is running on GitHub, or a later step adds the slate. Either way, until it is fixed, no Week 6 freeze will come from the store on its own. The data build falls back to nflverse moneylines (tagged `nflverse`) for any game the store cannot freeze. This needs a fix in `rsnbets/nfl-ev` before Sunday. Not done here.

**Access from CI.** `raw.githubusercontent.com/rsnbets/nfl-ev/main/lines.json` returns 404 (private). The site repo has no NFL sync workflow; the committed `data/nfl/lines.json` the Key Number Toolkit reads is from Sep 9. The pick'em data build therefore clones `rsnbets/nfl-ev` with a token secret named `NFL_EV_TOKEN` (a fine-grained PAT with read access to that one repo). Without the secret it logs the gap and uses nflverse for every game. Locally it reads the sibling `NFL_EV/` clone directly.

**De-vig method.** `profitpath-core` does not exist as a repo. The house method lives in `js/keynum-math.js` and the NFL Prop Finder: power de-vig per two-sided book (`p1^k + p2^k = 1`), then the median across books. The build ports that exactly and tags the result `store` with the book count. Books with a missing side are skipped. If fewer than 2 books price a game, the build falls back to nflverse.

## 0.2 ESPN NFL scoreboard

Both endpoint shapes work:

- `site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=20261011` returned Week 5's 13 games.
- `...scoreboard?week=6&seasontype=2&dates=2026` returned Week 6's 14 games with `week.number = 6` and `teamsOnBye`.

Fields confirmed per event: `id` (the ESPN event id), `date` (kickoff, UTC, `2026-10-18T17:00Z`), `shortName`, `status.type.name`, `status.type.state` (`pre` / `in` / `post`), `status.type.completed`, `status.type.detail` (`Final` or `Final/OT`), `status.period`, `status.displayClock`, and `competitions[0].competitors[]` with `homeAway`, `team.abbreviation`, `score` (a string), `winner`.

Final status: `STATUS_FINAL` with `state = post`. Overtime shows as `period = 5` and `detail = "Final/OT"`. Checked on five Week 1 to 5 OT games. A real tie happened in 2026 Week 5: NYG at WSH ended 27 to 27 in OT with `STATUS_FINAL`. Ties are real this season, which makes the tie-scoring rule (open question 2) worth settling before Sunday.

Scheduled games: `STATUS_SCHEDULED`, `state = pre`, scores `"0"`.

ESPN abbreviations differ from nflverse in two places: ESPN `WSH` is nflverse `WAS`, ESPN `LAR` is nflverse `LA`. The page joins on the ESPN event id, not the abbreviation, and maps those two for display sanity checks.

nflverse join: `games.csv` has `espn` filled for all 272 rows of 2026, and every Week 6 id matches the scoreboard (for example `2026_06_WAS_SF` is `401873008`). nflverse moneylines and `total_line` are present for Week 6 and blank for future weeks (166 of 272 rows blank, all future).

CORS: the response carries `access-control-allow-origin: *` on both endpoint shapes with an `Origin: https://profitpathsports.com` request header. A browser cross-origin fetch works. No fallback needed.

Live win probability (open question 5): the scoreboard response has no `probability` or `situation` block for live games in what was checked. ESPN's `summary?event=` endpoint usually carries `winprobability`. Not verified, not needed for v1.

## 0.3 PoolHost export

Not available yet. Picks do not go public in the pool until the Sunday deadline, so the first export arrives Sunday. Until then:

- The CSV template format is the import format and is fully supported, with the validation report.
- The PoolHost adapter is a stub that recognizes a non-template file, reports "unknown format", and never silently drops rows. It will be filled in once the real export is in hand.
- If the export has no per-game picks, the fallback stays the CSV template filled from a screenshot in chat.

## 0.4 Site structure

- Tool pages are single HTML files at the repo root with inline CSS plus `styles/sidebar.css` and `styles/topbar.css`, and the sidebar nav markup copied into each page. Data loads from `/data/<area>/<file>.json` with a cache-busting query and `cache: 'no-store'`, with an optional live-feed URL tried first.
- Fonts come from Google Fonts: Plus Jakarta Sans and Space Grotesk. DM Mono is not loaded on existing pages, so the pick'em pages load it themselves.
- Tokens from the v2 system: `--green #4DFF78`, `--cyan #00D4FF`, `--red #FF3D3D`, `--yellow #F5B545`, `--bg #090909`, surfaces `#0D0D0D` / `#141414` / `#1C1C1C`, text `#F0EEE8`.
- The mockups use their own compact header (wordmark, "Pick'em", section links) instead of the site sidebar. The pick'em pages follow the mockups since they are unlisted.
- Unlisted pages here use `<meta name="robots" content="noindex">` and are left out of `sitemap.xml`. Same treatment for `pickem/`.
- The repo is public. `pickem-handoff/` and `pickem/private/` were added to `.gitignore` before anything else.
- Pages live at `pickem/index.html` (live board) and `pickem/standings.html`, with shared code in `pickem/js/` and built data in `pickem/data/<season>-w<week>.json`.
- CI commits from the site repo must be authored as RSN (`rsnbets@gmail.com`) or Vercel refuses the deploy. The pick'em workflow uses that identity.

## Open questions, status

1. PoolHost export format: waits for Sunday.
2. Pool rules: not known. Defaults in v1: ties score nobody, a missed pick counts wrong, tiebreak is closest absolute with equal distance split evenly. A real tie already happened this season (Week 5).
3. Real deadline times: placeholder 10:50 AM America/Denver Sunday stays until Jackie confirms.
4. Store snapshot gap: measured above. Early window is about 10 hours stale, later windows 1 to 3 hours.
5. ESPN live win probability: not on the scoreboard endpoint, likely on the summary endpoint. Phase 2.
6. Weeks 1 to 5 history: the season view accepts a `season.csv`. Nothing to import yet.
