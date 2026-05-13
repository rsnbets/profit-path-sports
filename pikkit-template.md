# Pikkit Post Template — +EV Bet Workflow

**Internal use only.** Canonical reference for generating Pikkit social posts about +EV bets found via the Bet X-Ray calculator on Profit Path Sports.

> **Workflow:** User pastes bet info or a screenshot → Claude runs the X-Ray math (both devig methods) → Claude outputs finished SHORT + LONG posts ready to copy-paste into Pikkit.

---

## Locked-in defaults

| Setting | Default | Rationale |
|---|---|---|
| Bankroll | **$1,000** | Makes dollar stakes = % of roll cleanly. Always shown in post so readers can scale. |
| Kelly fraction | **¼-Kelly** | PPS-aligned conservative sizing. Full-Kelly shown as reference, never as recommendation. |
| Devig method | **Multiplicative** | Standard for moderate-vig markets. Power devig only if user explicitly requests. |
| Devig sources | **Two: sharpest two-way + market average** | Shown side-by-side. Lets reader see the edge range across methodologies. |
| Matchup line | **Omitted** | Pikkit auto-captures the matchup from the linked bet slip. |
| Sport / book hashtags | **Auto-include** | `#PlusEV #[Sport] #[Book]` minimum, plus signature `#SharpAction` and `#DegenButMakeItMath` on LONG. |

---

## What the user sends Claude per bet

### Minimum required
1. **The bet** — player/team, market, side, line. E.g. *"Courtney Williams O5.5 assists"*
2. **Book + odds** — e.g. *"FD +140"*
3. **Sharp source(s)** — at least one of:
   - **Two-way odds from a sharp book/exchange** (Pinnacle, ProphetX, Circa) — e.g. *"PX +106 / -141"*
   - **OddsJam / PTO screenshot** — Claude reads the average column and sharpest two-way visible
   - **User's own true probability estimate** — e.g. *"I model this at 48%"*
4. **Sport** — e.g. *"WNBA"*

### Optional overrides
- Different bankroll size (anything other than $1k)
- Specific Kelly fraction (½-Kelly, full Kelly, etc.)
- Power devig instead of multiplicative
- Custom "WHY this edge exists" reasoning (otherwise Claude generates one from the math)
- Custom CLV target (otherwise Claude estimates from fair line + book lag pattern)

---

## SHORT template (Pikkit feed-card length, ≤280 chars)

```
🩻 +EV: [Player/Team] [Market] [Side] [Line] @ [Book] [Odds]

Fair (PX devig):  [Fair-A] → Edge +[EV%-A] · +$[EV/100-A]/100
Fair (Mkt avg):   [Fair-B] → Edge +[EV%-B] · +$[EV/100-B]/100

¼-Kelly: $[Stake-low]–$[Stake-high] ([U-low]–[U-high]u · $1k roll)
Found via @ProfitPathSports X-Ray
#PlusEV #[Sport] #[Book]
```

**Notes:**
- SHORT always shows both fair-line reads — they're the headline differentiator
- Stake range = mkt-avg ¼-Kelly (low) to sharp ¼-Kelly (high)
- Drop `Found via @ProfitPathSports X-Ray` line if over character limit, but keep it whenever possible

---

## LONG template (full commentary body)

```
🩻 +EV PLAY · [Player/Team] [Market] [Line] [Side] @ [Book] [Odds]

📊 X-RAY · TWO DEVIG SOURCES (same calc, two runs)

                        SHARP ([Source])     MARKET AVG
   Fair odds:           [Fair-A]              [Fair-B]
   Fair prob:           [Prob-A]%             [Prob-B]%
   Edge vs fair:        +[Gap-A] pp           +[Gap-B] pp
   EV%:                 +[EV%-A]              +[EV%-B]
   EV per $100:         +$[EV-A]              +$[EV-B]
   ¼-Kelly stake:       $[Stake-A]            $[Stake-B]

   Implied @ [Book]:    [Implied%]
   Breakeven rate:      [BE%]

📐 REPLICATE — run the X-Ray twice with these sharp inputs:
   Run 1 ([Source A]):  Sharp A [A-odds-over] / Sharp B [A-odds-under] / Book [Book-odds]
   Run 2 (Market avg):  Sharp A [Avg-over] / Sharp B [Avg-under] / Book [Book-odds]
   Both: Multiplicative devig method
   → profitpathsports.com/bet-x-ray.html

💰 SIZING · $1,000 bankroll · ¼-Kelly
   Conservative (mkt avg):   $[Stake-low]   ([%-low]% of roll · [u-low]u)
   Aggressive ([Source]):    $[Stake-high]  ([%-high]% of roll · [u-high]u)
   Midpoint suggestion:      $[Stake-mid]   ([%-mid]% · [u-mid]u)

🎯 WHY
[1-3 sentence reasoning. Standard angles:
 - Which book is the outlier and which way (stale line)
 - Where the rest of the market sits (cluster)
 - Cross-book signals (e.g. another book offering best price on the opposite side
   = they're trying to attract action that way = action has been on YOUR side)
 - Game-script / injury / pace / matchup edge if relevant]

🎯 CLV TARGET
[Expected closing line on the specific book — usually fair odds ± book's typical
juice pattern. e.g. "Expect FD to drop to +110/+120 by tip."]

#PlusEV #SharpAction #[Sport] #[Book] #DegenButMakeItMath
```

---

## The math Claude runs (reference)

### American → implied probability
- If `o > 0`: `p = 100 / (o + 100)`
- If `o < 0`: `p = |o| / (|o| + 100)`

### Multiplicative devig (two-way)
- `p_A_raw = americanToImplied(odds_A)`
- `p_B_raw = americanToImplied(odds_B)`
- `total = p_A_raw + p_B_raw`
- `p_A_fair = p_A_raw / total`
- `p_B_fair = p_B_raw / total`
- Convert each back to American

### EV%
- `decimal_payout = book_odds_to_decimal(book_odds)`
- `EV% = (decimal_payout × p_fair) - 1`
- `EV/$100 = EV% × 100`

### ¼-Kelly stake
- `b = decimal_payout - 1` (profit per $1 risked)
- `f_full = (b × p_fair - (1 - p_fair)) / b`
- `f_quarter = f_full / 4`
- `stake_$ = bankroll × f_quarter`

### Two devig sources to compute
1. **Sharpest two-way visible** — usually Pinnacle, ProphetX, Circa. From an OddsJam screenshot, scan for these. If none visible, use the tightest-vigged two-way (lowest combined implied prob).
2. **Market average** — the "AVERAGE" column on OddsJam / PTO. If only individual books are shown, mean of the two-ways across all books with both sides priced.

---

## Worked example — Courtney Williams O5.5 assists @ FD +140

**User input:** *"WNBA · Courtney Williams O5.5 assists, FD +140. PX shows +106/-141, market average +113/-149."*

**Devig math:**

| | PX (sharp) | Market Avg |
|---|---|---|
| Over raw imp | 48.54% | 46.95% |
| Under raw imp | 58.51% | 59.84% |
| Sum (vig) | 107.05% | 106.79% |
| Fair p(over) | 45.34% | 43.97% |
| Fair odds (over) | +120 | +127 |

**Bet evaluation @ FD +140:**

| | PX | Mkt Avg |
|---|---|---|
| Implied @ FD | 41.67% | 41.67% |
| Prob gap | +3.68 pp | +2.30 pp |
| EV% | +8.83% | +5.53% |
| EV/$100 | +$8.83 | +$5.53 |
| ¼-Kelly @ $1k | $16 | $10 |

**SHORT output:**
```
🩻 +EV: Courtney Williams O5.5 assists @ FD +140

Fair (PX devig):  +120 → Edge +8.83% · +$8.83/100
Fair (Mkt avg):   +127 → Edge +5.53% · +$5.53/100

¼-Kelly: $10–$16 (1.0–1.6u · $1k roll)
Found via @ProfitPathSports X-Ray
#PlusEV #WNBA #FanDuel
```

**LONG output:**
```
🩻 +EV PLAY · Courtney Williams O5.5 assists @ FanDuel +140

📊 X-RAY · TWO DEVIG SOURCES (same calc, two runs)

                        SHARP (PX)     MARKET AVG
   Fair odds:           +120           +127
   Fair prob:           45.34%         43.97%
   Edge vs fair:        +3.68 pp       +2.30 pp
   EV%:                 +8.83%         +5.53%
   EV per $100:         +$8.83         +$5.53
   ¼-Kelly stake:       $16            $10

   Implied @ FD:        41.67%
   Breakeven rate:      41.67%

📐 REPLICATE — run the X-Ray twice with these sharp inputs:
   Run 1 (PX exchange):  Sharp A +106 / Sharp B −141 / Book +140
   Run 2 (Market avg):   Sharp A +113 / Sharp B −149 / Book +140
   Both: Multiplicative devig method
   → profitpathsports.com/bet-x-ray.html

💰 SIZING · $1,000 bankroll · ¼-Kelly
   Conservative (mkt avg):   $10  (1.00% of roll · 1.0u)
   Aggressive  (PX sharp):   $16  (1.58% of roll · 1.6u)
   Midpoint suggestion:      $13  (1.30% · 1.3u)

🎯 WHY
FanDuel stands alone at +140. Rest of the market: PX +106 · DK +115 ·
BetX +116 · Bet365 +120 · MGM −105 (outlier). ProphetX (sharpest
two-way) devigs to +120 fair; market average devigs to +127. Either
way, FD's +140 is the stale line. Hard Rock offering the best UNDER
at −135 = they're trying to attract under action, meaning money's
been hitting the over and FD hasn't moved yet.

🎯 CLV TARGET
Expect FD to drop to +110 / +120 by tip. Track CLV at lock.

#PlusEV #SharpAction #WNBA #FanDuel #DegenButMakeItMath
```

---

## Post-game grading workflow (for later)

After the game settles, follow up the original Pikkit post with a grading comment:

```
📈 GRADED · [Player] [Market] [Result]

Final: [Actual stat] vs [Line] · [HIT/MISS]
Closing line @ [Book]: [Closing odds]  ([CLV in cents])
   Bet @ [Bet odds] → Closed @ [Close odds] = [+/-X cents CLV]

Whether it cashed or not is variance. The CLV is the signal.
[#WinningCLV or #PositiveCLVLosingBet]
```

---

## Pikkit-specific notes

- Pikkit auto-captures the bet slip if the user's book is linked → matchup, line, odds, and stake show in the post card automatically
- Commentary body has effectively no length cap, but **first 2-3 lines show in the feed scroll** — front-load the headline numbers
- Hashtags help discoverability — Pikkit has `#PlusEV` and sport-specific feeds
- If the user **doesn't actually place the bet**, the slip won't auto-capture and they'll need to post as text-only — in that case, the SHORT version + screenshot of the OddsJam line are the right format

---

## Voice + branding rules

- **No exclamation points.** Confident, factual tone.
- **Bold the actual play**, not the marketing copy. The bet is the hero.
- **Always show the math.** Pikkit's audience is bet-tracking nerds who respect "show your work."
- **Never overclaim certainty.** "+EV" is a long-run expectation, not a guarantee of this bet hitting. Phrase as "edge" / "fair line" / "stale line" — not "lock" / "free money" / "easy win."
- **Tag PPS sparingly.** `@ProfitPathSports` once in SHORT, X-Ray URL once in LONG, brand hashtags in both. Don't spam the brand in the body.
- **Always disclose book.** Transparency about which book has the price prevents confusion + signals you're not a tout pushing a non-public line.

---

*Template version 1.0 — May 2026. Refine as we run more posts and learn what converts.*
