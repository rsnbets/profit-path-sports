# Pikkit Post Template — +EV Bet Workflow

**Internal use only.** Canonical reference for generating Pikkit social posts about +EV bets found via the Bet X-Ray calculator on Profit Path Sports.

> **Workflow:** User pastes bet info or a screenshot → Claude runs the X-Ray math (both devig methods) → Claude outputs finished SHORT + LONG posts ready to copy-paste into Pikkit.

---

## ⚠️ STRATEGIC POSITIONING (read this first)

**This is a demonstration channel, not a tipster service.**

PPS does not give out picks as its product. The X-Ray calculator and the educational guides are the product. Pikkit is a finite-duration traction tool to drive awareness back to the site — not a long-term content channel.

**Every post is an example of methodology**, not a recommendation. The bet is the vehicle; the X-Ray demonstration is the cargo. Readers should leave wanting to *run the X-Ray themselves*, not wanting to copy the bet.

**Posting discipline:**
- **Max 1-3 posts/day**, varying the *type* of edge demonstrated (stale line / alt-ladder / cross-market / devig discrepancy / live middle / etc.)
- **Every post ends with the home CTA** — see the "Required outbound CTA" section below
- **60-90 day traction window**, then transition Pikkit to a weekly stats-recap channel (CLV %, ROI, hit rate) rather than daily plays
- **Never use language that says "tail me," "copy this," "lock," "free money," or "guaranteed."** Always frame as "here's what the tool found" / "here's the pattern"
- **Place the bet at small stakes** ($5-25 from a dedicated $250-500 "post bankroll") — Pikkit requires real slips, and the discipline keeps quality high

### Required outbound CTA (closes every post)

```
Plays like this aren't the product — the X-Ray is.
Find your own: profitpathsports.com/bet-x-ray.html
```

This single line is the most important sentence in every post. Never omit it.

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
🩻 X-Ray flagged: [Player/Team] [Market] [Side] [Line] @ [Book] [Odds]

Fair (sharp): [Fair-A] · Edge +[EV%-A]
Fair (avg):   [Fair-B] · Edge +[EV%-B]

The tool, not the tip → profitpathsports.com/bet-x-ray.html
#PlusEV #[Sport] #[Book]
```

**Notes:**
- Lead with "X-Ray flagged" — positions the tool as the actor, not you
- SHORT always shows both fair-line reads — they're the methodology signal
- Closing line is non-negotiable: routes readers to the actual product
- If character limit is tight, drop the hashtags first; keep the X-Ray URL

---

## LONG template (full commentary body)

```
🩻 X-RAY DEMO · [Player/Team] [Market] [Line] [Side] @ [Book] [Odds]

EDGE TYPE: [Stale line · Alt-ladder gap · Cross-market · Devig discrepancy · Live middle]
   ↑ pick one — varies what readers learn each post

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

🎯 WHY THIS PATTERN MATTERS
[1-3 sentence reasoning, framed as TEACHING the pattern, not selling the bet:
 - Name the pattern explicitly ("This is a stale-line pattern — when one book
   sits 20+ cents above the market average...")
 - Explain how the reader can spot this pattern themselves on their own screen
 - Cross-book signals worth flagging:
   - Best opposite-side price on a different book = action on YOUR side, line
     hasn't caught up
   - Limit / lock icon = sharps already attacking this number
   - Multi-book consensus vs. one outlier = textbook stale-line setup]

🎯 CLV WATCH
[Expected closing line on the specific book — readers can verify pre-game
that the math was right by watching this number converge.
e.g. "Watch FD — expect it to drop to +110/+120 by tip. If it doesn't, the
X-Ray was wrong on this one. That's the test."]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Plays like this aren't the product — the X-Ray is.
Find your own: profitpathsports.com/bet-x-ray.html
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

#PlusEV #SharpAction #[Sport] #[Book] #LearnTheMath
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
🩻 X-Ray flagged: Courtney Williams O5.5 assists @ FD +140

Fair (sharp): +120 · Edge +8.83%
Fair (avg):   +127 · Edge +5.53%

The tool, not the tip → profitpathsports.com/bet-x-ray.html
#PlusEV #WNBA #FanDuel
```

**LONG output:**
```
🩻 X-RAY DEMO · Courtney Williams O5.5 assists @ FanDuel +140

EDGE TYPE: Stale line — one book lagging the market

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

📐 REPLICATE — run the X-Ray twice yourself:
   Run 1 (PX exchange):  Sharp A +106 / Sharp B −141 / Book +140
   Run 2 (Market avg):   Sharp A +113 / Sharp B −149 / Book +140
   Both: Multiplicative devig method
   → profitpathsports.com/bet-x-ray.html

🎯 WHY THIS PATTERN MATTERS
This is a textbook stale-line pattern. FanDuel is the lone outlier at +140
while every other book sits +106 to +120, with the market average at +113.
When you see one book sitting 20+ cents above consensus, that's a line
that hasn't caught up to where action has been hitting. Bonus signal:
Hard Rock is offering the best UNDER at −135 — they're trying to attract
under action, meaning money's been on the over and FD is the last book
holding the stale number. You can spot this same pattern on any OddsJam
screen in 30 seconds.

🎯 CLV WATCH
Watch FD — expect it to drop to +110 / +120 by tip. If it doesn't, the
X-Ray was wrong here. That convergence test is how you verify the math
before you ever care about the result.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Plays like this aren't the product — the X-Ray is.
Find your own: profitpathsports.com/bet-x-ray.html
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

#PlusEV #SharpAction #WNBA #FanDuel #LearnTheMath
```

---

## Live CLV update (pre-game follow-up comment)

Post this as a **comment under the original Pikkit post** when the line moves toward fair before the game starts. This is the highest-value content PPS can produce — public, time-stamped proof that the math identified a real edge.

### Template

```
📈 LIVE CLV UPDATE · [Player] [Market] [Line] [Side]

Posted: [Posted odds] @ [Book]
Now:    [Current odds] @ [Book]
Moved:  −[X] cents toward fair ([Y]% of expected convergence captured pre-game)

Fair ([Source A]):  [Fair-A]
Fair ([Source B]):  [Fair-B]

This is what +EV looks like before the game even starts. Whether the
[side] hits is variance. The line moving is the signal — the market
is agreeing with the math.

#WinningCLV #SharpAction #PlusEV #[Sport]
```

### Math reference

- **Cents moved** = `posted_odds - current_odds` (for plus odds; flip sign for minus)
- **% of expected convergence captured** = `cents_moved / (posted_odds - fair_odds)` × 100
  - Use the more conservative fair line (Market Avg, not PX) for the denominator so we don't overstate
  - Caps at 100% — if the line moves past fair, we've captured >100% which is even better

### Worked example — Courtney Williams (post-time +140 → mid-day +134)

- Posted: +140 · Now: +134 · Moved: 6 cents toward fair
- Expected total convergence to mkt-avg fair (+127): 13 cents
- Captured: 6 / 13 = **46% of expected pre-game CLV**
- Alt frame: vs PX fair (+120), expected convergence is 20 cents, captured 30% — pick the more conservative frame in the post (the higher %)

### When to post the Live CLV Update

- **Best window:** 1-4 hours after the original post, before lineups lock
- **Trigger:** ≥3 cents of movement toward fair on the same book you posted from
- **Don't post if:** the line moved AGAINST your bet (just let the original ride; post the grading update after the game regardless of result)

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

## Pikkit-specific notes (verified May 2026)

### The platform rule
**Pikkit requires real, placed bets — period.** Per Pikkit's own FAQ: *"Pikkit does not support manual bet entry and only supports syncing bets from sportsbooks at this time."* No manual entry, no text-only commentary posts, no "pick"/"prediction" mode separate from auto-synced slips. To post on Pikkit, the bet must exist in their system, which means it must have been placed on a linked sportsbook.

### What this means for PPS
- **Every Pikkit post = a real bet at small stakes.** Treat the wager as marketing spend, not as the play itself. ¼-Kelly on a $250-500 "post bankroll" is plenty — the public-facing math still shows the $1k/¼-Kelly reference numbers for educational consistency.
- **Auto-capture handles everything.** Matchup, line, odds, stake, and CLV all populate from the synced slip. Commentary body is where the X-Ray math + "WHY" + replication block go.
- **First 2-3 lines show in the feed scroll** — front-load the headline numbers in both SHORT and LONG formats.

### The copy-bet flywheel (marketing upside)
Pikkit has a one-tap **"copy bet"** feature — followers tap and the same bet drops into their own slip on their linked book. That's an organic distribution mechanism most other platforms don't have:
- Every PPS-branded Pikkit post is a potential affiliate conversion if followers route through your tracked links to the destination book
- Lean into it: name the book clearly in the post, make the line easy to find on that book

### When NOT to post on Pikkit
- **Bet is no longer available** (line moved, market closed) — post on X/Discord instead with the X-Ray screenshot as proof of when you found it
- **You're limited or restricted on that book** — same; post elsewhere
- **Pre-launch / educational content** (like "here's how to read the X-Ray") — that's website / blog content, not Pikkit

### Channel split

| Channel | What goes there |
|---|---|
| **Pikkit** | +EV plays you actually placed at small stakes |
| **X / Twitter** | Plays you spotted but couldn't or didn't place (limits, closed line, demonstrations) — text + X-Ray screenshot, no fake slips |
| **Discord** (eventually) | Real-time alerts to subscribers, same plays as Pikkit + expanded reasoning |
| **PPS website / weekly recap** | Aggregated stats pulled from Pikkit dashboard |

### CLV update format on Pikkit
Pikkit auto-tracks closing line value on every settled bet — the "Live CLV Update" comment template above is for the **mid-flight** narrative (line moved pre-game), not for post-settlement. After the game settles, the post-game grading template applies, and you can reference Pikkit's own displayed CLV number in the post for credibility.

---

## Voice + branding rules

- **No exclamation points.** Confident, factual tone.
- **The methodology is the hero, not the bet.** Lead with what the X-Ray did, not what to bet.
- **Always show the math.** Pikkit's audience is bet-tracking nerds who respect "show your work." Plus the math is the actual asset PPS is teaching.
- **Never overclaim certainty.** "+EV" is a long-run expectation, not a guarantee of this bet hitting. Phrase as "edge" / "fair line" / "stale line" / "pattern" — never "lock" / "free money" / "easy win" / "tail me" / "smash."
- **Frame as a teaching example, not a recommendation.** Use language like "this is a stale-line pattern," "X-Ray flagged this," "here's how to spot it yourself" — never "I love this play," "hammer this," "best play of the day."
- **Always disclose book + how to find it.** Transparency about which book and which screen tools surfaced it builds trust. Hiding sources = tipster red flag.
- **End every post with the home CTA.** "Plays like this aren't the product — the X-Ray is. Find your own: profitpathsports.com/bet-x-ray.html" — non-negotiable.
- **Don't post if you can't teach something new.** If a play doesn't demonstrate a different pattern than yesterday's post, skip it. Quality of demonstration > quantity of plays.

---

*Template version 2.0 — May 2026.*

*v1.0 → v2.0 changelog: Reframed entire workflow from tipster mode to demonstration mode. PPS is an education brand, not a picks service. Pikkit is now a finite 60-90 day traction tool; every post leads with "X-Ray flagged this" and closes with a mandatory CTA back to the calc. Posting cap dropped to 1-3/day, varying edge type each post. Voice rules updated to ban tipster language ("tail me," "smash," "lock," "easy money"). After traction window, Pikkit transitions to weekly stats-recap channel.*
