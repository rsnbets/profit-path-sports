# Sharper: A Guide to Modern Sports Betting — "True Pokerjoe" (Richard Bennet, 2016, rev. through 2021)

> **Reading status:** ✅ First pass complete. Skimmed front-matter and dense modeling-chapter math; deep-read frameworks (Ch 1-22, 31, Addendum). Player Impact Values (Ch 28-30) noted at conceptual level but not transcribed.
>
> **Length:** ~129 pages, 31 chapters + "Free Money" addendum.

## Bibliography

- **Title:** Sharper: A Guide to Modern Sports Betting
- **Author:** "True Pokerjoe" (pseudonym; real name Richard Bennet per copyright page)
- **First published:** 2016 (revised through ~2021 — addendum references 2021 Colorado promo grind)
- **ISBN:** 9781520109329
- **Voice:** First-person, conversational-acerbic. Self-identifies as career advantage gambler (poker + sports, ~30+ years). Cites old Vegas "Fat Man" as his sports-betting teacher; references the Hilton handicapping contest, the Gambler's Book Club, sports betting forums (Two Plus Two-style culture).
- **Signal of credibility:** Directly cites and recommends LOSB ("Mathew Davidow and Ed Miller, *The Logic of Sports Betting*") in Ch 6 on linemaking. Other sharps in the book's social network include Ganchrow, Fishhead, PlusEVAnalytics, mathdotcom, Elihu Feustel (Justin7), Andrew Mack, Captain Jack Andrews — i.e., the forum-era sharp community LOSB describes from the inside.
- **Significance for PPS Library:** ⭐ **The practical-tactical companion to LOSB.** Where LOSB is the industry-analytical view ("how the business works"), Sharper is the operator's view ("here is the math you do, here are the spreadsheet formulas, here are the decision rules"). Cross-source corroboration on most LOSB themes + heavy operational depth (push frequencies, vig-free line, buying points, Kelly, risk-free promo math) + **first cross-source conflict** (CLV worship vs CLV-as-deepity).

## Thesis in one paragraph

Sports betting is a market, not a casino game. The two paths to edge are **handicapping** (make your own line, compare to market, bet when your line and market line meaningfully diverge) and **line grinding** (use the sharp-market consensus as gold-standard truth, bet anywhere the available line is sufficiently better than that consensus). Most public bettors fail because they confuse calculation with math, win-rate with edge, juice with price, and "feeling right" with being right. The book's mission is to give a working bettor the **specific operational math** (break-even rates, vig-free lines, push frequencies, point-buying decisions, edge estimation, Kelly sizing) needed to function as a sharp, plus the **mindset shifts** (sharps don't talk about "the" line, juice is irrelevant, your edge is unknowable, CLV is overrated, the close isn't always the most efficient line) that separate operators from squares. The closing addendum reframes US legal-sportsbook promos as **the only currently free money in the market**, with explicit math showing why dogs beat favorites for risk-free promos and why deposit bonuses are churn-able for guaranteed EV.

## Key frameworks / named concepts

### 1. Squares vs Sharps — the binary frame
- Beginners/intermediate/expert isn't the right axis. The right axis is **square vs sharp** (or *rec vs pro*).
- Squares ask "Who's going to win?"; sharps ask "What's the chance the team wins, given the price?"
- "You can play this game for years and be square; you can be fairly sharp right from the start if you want."
- Sharpness is a property of *how you think about bets*, not of how long you've been betting.

### 2. The Essence (Ch 1)
> "The essence of sharp sports betting is to bet that your estimate of a team's win chance is more accurate than the market's."

This is a definitional reframe: **you're not betting on a team, you're betting that your probability estimate is more accurate than the market's probability estimate.** Two distinct claims. The book hammers this throughout.

### 3. Every bet has two parts: a definition + a price
- Definition = who/what wins, by how much
- Price = the odds ratio
- Sharps separate these two cleanly. Squares conflate them.

### 4. Price is NOT Juice (Ch 5) — the high-impact reframe
- **Price** is the odds part of any one offer (e.g., -110, +120).
- **Juice** is the *difference* between the prices on both sides of an offer.
- Two flagrant examples:
  - "-1000/+800" sounds like 200 cents of juice; it's actually ~2% — *less* juice than a -110/-110 line.
  - A baseball line of -200/+170 has *less* juice than -110/-110.
- Punchline: **juice is irrelevant to a sharp.** You care about *price* (the price you can get on the side you want). The juice is the bookie's business.
- "A book's usefulness depends only on the chance you can get the best line on a game there, the chance you'll get paid, the chance you can win and not get booted, and so on, but not on their hold."

### 5. Three Lines, Plus Yours (Ch 10)
There is no "the" line:
- **Worldwide line** — the range of best lines available across major books on each side (e.g., "-7.5, -8")
- **Consensus line** — average spread/price at major books
- **Sharp line** — the line at the sharp books (Pinnacle, Heritage, Bookmaker, Circa, Westgate). Sharper than other lines because made by markets of sharp bettors at low-vig books that don't boot winners.
- **Your line** — the best numbers *you* can get at *books that pay you*. This is the only one that matters for your EV.

### 6. The Vig-Free / Juice-Free Sharp Line — gold standard for edge estimation (Ch 11)
**Method:** take the best available prices on each side of a betting offer from across your accepted-sharp books. Strip the juice mathematically. The midpoint is the market's estimate of the bet's true probability.

If sharp range is -120/+115 (after stripping vig), break-even win rate = 54%. Any line you find lower than -115 or better than +120 is +EV by the margin.

**Key epistemic caveat:** the sharp line **cannot be reduced more finely than the width of the market's juice itself.** That's the limit of what you can know.

### 7. Trailing vs Leading Edge of Line Movement (Ch 11)
A novel, under-discussed concept:
- **Square-inspired line movement** → the *trailing* line (the older line before square money moved it) is the sharper number. Squares pay double-juice as the line stretches.
- **Sharp-inspired line movement** → the *leading* edge (the new line after sharps hit) is the sharper number. Sharps move the line to the point where there's no more edge.
- Diagnostic: who's driving? Look at the books leading the charge, the popularity of the teams, the betting %s.

This is why "the closing line" can be *less* sharp than an earlier line — square money near close can move the line *away* from efficiency.

### 8. Push Frequencies (Ch 12) — the missing piece for line-shop math
- PF = the chance a game lands exactly on a spread or total
- Crucial for: buying points, middling, scalping, choosing between alternate lines, edge estimation, valuing line moves
- **Don't trust published PF charts** — they age. Instead, *back out the PF from a sharp book's alternate lines.* Excel formula provided (via @professor042):

```
In A1: road team 2.5 price
In A2: home team 2.5 price
In A3: road team 3.5 price
In A4: home team 3.5 price
Anywhere:
=AVERAGE(ABS(IF(A3>0,100/(100+A3),-A3/(100-A3))-IF(A1>0,100/(100+A1),-A1/(100-A1))),
        ABS(IF(A4>0,100/(100+A4),-A4/(100-A4))-IF(A2>0,100/(100+A2),-A2/(100-A2))))
```

The theory: if a book has a game lined 3 and prices alternates +/- 0.5 around it, the price gap implies the PF the book is using. Sharp books incorporate total-points and game-context into their PF estimates; you can free-ride on that work.

### 9. Middling, Scalping, Parlays, Teasers (Ch 13)
- **Middling:** betting both sides at *different spreads*; want game to land in the gap. Profitable when PF of the gap > combined cost of both -110s (~4.76%).
- **Scalping (arbing):** betting both sides at *different prices* on the same spread; instant locked profit. Books boot you fast.
- **Parlays:** combined independent bets. Most fixed-odds parlay payouts are EV-costly (true 2-team -110 parlay pays 3.64, not 3.60). Workaround: include a non-110 leg to force exact-calculation payout.
- **Correlated parlays (CPs):** legs that aren't independent. The classic soccer example (favored by 3 total goals + over 3 total goals) gets routinely caught and refused. Author notes CPs are his specialty and won't share details — characteristic sharp omertà.
- **Teasers:** always a math question. With rare exceptions (NFL 6-point teasers crossing both 3 AND 7; stale parlay/teaser cards), the math says no.
- **Wong teasers** — historical case study: when Stanford Wong went public with his +EV teaser conditions, the books (via Ganchrow at Heritage) fixed the payouts; the edge dried up. **The market eats published edges.**

### 10. Buying Points: a Math Question, Never a Sport Question (Ch 14)
- Old-school books price each half-point at 10¢. This is mathematically incorrect.
- The cost of 10¢ in price drops as price moves away from -100: -100→-110 costs 2.38% in break-even; -110→-120 costs 2.16%; -120→-130 costs 1.98%; etc.
- **Implication:** in the old-school pricing scheme, **each half-point is cheaper than the previous**. So if you're buying any, buy them all.
- **Decision rule:** buy the half-point only if (difference in break-even win rates of the two prices) < half the PF of the number you're buying on or off.
- Formula provided in spreadsheet form.

### 11. Edge Estimation (Ch 16) — "estimated edge is not edge"
- Edge = (decimal odds) × (estimated win chance) − 1
- The whole apparatus rests on the win-chance *estimate*, which is *always wrong*.
- "I've never known my edge. Neither have you." A core epistemic stance: real edges are slim, estimates are noisy, calibration humility is necessary.
- For line grinders, edge ≈ (off-market line's BE) − (sharp BE). For handicappers, edge ≈ your projected line vs market.

### 12. Kelly Criterion (Ch 17) — math + emotional honesty
- Formula in standard form. Spreadsheet given.
- **Fractional Kelly:** virtually all serious operators use a fraction (often half- or quarter-Kelly). Not because the math is wrong but because the *edge estimate* is wrong.
- Pokerjoe's key claim: **the cost of overestimating your edge is much greater than the cost of underestimating it.** Asymmetric loss → be conservative.
- He further argues: **bet more on favorites, less on dogs, edge-equal.** (Counter-Kelly intuition; reasons: bigger faves are more obvious → less likely to be undervalued → your edge estimate is more likely to be wrong → estimation errors on big faves are catastrophic.)
- BR ("bankroll") is, in honest terms, an emotionally comfortable amount to risk, not a calculation. Stop pretending otherwise.
- Tax-and-stiff-risk are real but uncomputable adjustments to your "true" payoff odds.

### 13. CLV is a Deepity (Ch 20-21) — ⚠️ FIRST CROSS-SOURCE CONFLICT
- **Deepity** (per Dennett): a statement that's trivially true on one level and meaningless on another. "To the extent it's true, it doesn't matter. To the extent it matters, it isn't true."
- Pokerjoe's claim: "Beating the closing line correlates to winning. So does beating the close of live betting. So does picking the game winner. So does beating the spread. It's deepity, isn't it?"
- For **line grinders**: CLV is built into the methodology — you bet because the available line was off-market; the line then moves to consensus *by definition*; that's your CLV, not a separate skill signal.
- For **handicappers**: CLV is a partial signal of sharpness (your bets nudge the market because the market trusts winners) — but it's also *circular* (winners get respected → respected bets move lines → moved lines = CLV).
- The closing line is **not always** the most efficient line; an hour pregame may be sharper because square money near close can de-anchor it.
- Famous example: Seattle-StL Week 8 2013, line moved from -11 Sunday morning to -13.5 Monday evening on square betting on big favorites — pure float, not market intelligence.

> ⚠️ **Tension with LOSB**: Miller & Davidow position CLV (specifically: CLV ≥ half the hold over hundreds of bets) as the #1 long-run profitability predictor. Sharper says CLV is partly tautological and the closing line isn't always the most efficient line. **Reconciliation candidate for PPS:** distinguish CLV-as-skill-signal-for-handicappers (legitimate, with caveats) from CLV-as-tautology-for-line-grinders (built into method). And acknowledge that even for handicappers, the closing line can be a *worse* line than mid-day on square-driven markets. This is a topic where PPS can take a genuine **independent synthesis position**.

### 14. Z-Score: the answer doesn't exist (Ch 18)
- Simple version: (W − L) / sqrt(W + L)
- More math doesn't tell you you've made it. "It doesn't matter how well or how long you've succeeded, you may have only been lucky."
- "Methodology matters more than results." Recognize that even apparent multi-year success can be variance, especially given how many bettors exist.
- ATS results, CLV, and the ability to make lines are the three tests; the last (set a line in advance of seeing the market line) is the most direct, requires the smallest sample, and is the hardest to fake.

### 15. The Three Handicapping Approaches (Ch 25)
A clean taxonomy for rating teams; **use all three, weighted differently across the season**:
1. **Player-based ratings:** sum up player and coach values into a team rating. Sample: Pokerjoe's 2018 Washington offense roster with player ratings and impact values per starter.
2. **Performance-based ratings:** rate teams off observed play. Pokerjoe uses hand-crafted yards-per-play (yppl) for NFL.
3. **Market-based ratings:** start from public ratings (FPI, KenPom, 538). Adjust toward the market when your line and the market diverge — *consider that one of your team ratings might be off* by the gap.

The book's recommendation: NFL → start the first 4 weeks with player-based ratings, then increasingly merge yppl performance ratings, keeping market as a third-party check.

### 16. Generic Points vs Spread Points (Ch 26)
- A 1-point difference in your **power rating** is generic.
- A 1-point difference in **actual scoring margin** is NOT generic — scoring lands disproportionately on certain numbers (NFL 3 and 7; NBA 3 and 5; etc.).
- Therefore: when you have a 3-point power-rating edge, the *actual betting edge* depends on the push frequencies of the numbers crossed.
- Operational consequence: keep a generic-to-spread-points conversion table for each sport. Spread-point value = generic value adjusted by push frequencies of crossed numbers.

### 17. Game-Day Adjustments (Ch 25)
Sample NFL game-day weights from Pokerjoe (2021):
- HFA: 2.0
- Denver +0.25 (altitude, both sides)
- Crossing 2 time zones: 0.25 / 3 zones: 0.5
- Third straight home game: +1.0
- Third straight road game: +0.75
- 7+ pt fave with upcoming break: +1.0
- Raining/snowing: 0.5
- Wind: if >13 mph, (wind − 5) / 20
- 5-day rest: −0.5 (−1.5 if previous OT)
- Off bye: +0.75
- Off 9-day rest: +0.25

Don't take as gospel — point is the *type* of adjustments a sharp keeps, not the exact values.

### 18. Beard Farming (Ch 10)
If you get booted by a sharp book, you "beard your way back in" — open accounts using other people's names with their permission. Sharps with constant booting needs become **beard farmers** running stables of accounts. **Direct cross-reference to Funt Ch 1** (Beau Wagner's beard experiment) and LOSB's discussion of profiling.

### 19. The Sharp Books Roster
Per the book, the books that don't boot or cripple winners (and therefore set the sharpest lines):
- **Pinnacle** (Pinny) — offshore, lowest juice, manages sharp action rather than refusing it
- **Circa** (Vegas)
- **CRIS / Bookmaker**
- **Heritage**
- **Westgate** (Vegas)
- **SBObets** (sharper for soccer than Pinnacle)

PPS practical use: the **Sportsbook Tier-Map** (LOSB-seeded) can be cross-validated against Sharper's named sharp books. Both books separately identify Pinnacle and Circa as canonical market-makers — that's two-source convergence on the tier-map's core.

### 20. The Promo Grind — "Free Money" Addendum
The single most concretely valuable section of the book for the average PPS reader. Walks through Colorado 2021 promos with explicit math:

- **Risk-free bets** (BetMGM, William Hill, Elite, FoxBet, WynnBET, Betfred, PointsBet, The Score, Betway, etc.)
  - Bet $600 risk-free. Results-tree on **2-1 favorites** → EV ≈ $67.
  - Same $600 risk-free on **2-1 dogs** → EV ≈ $267. **~4× the EV.**
  - Reason: with dogs, when you win the 2-to-1 payoff is huge; when you lose the first bet you still get a second chance.
  - **Rule of thumb:** value risk-free promos at ~40¢ on the dollar (assuming you bet dogs).

- **Free-play promos** (free bet returns winnings only, not stake)
  - On a 2-1 dog: 33% × $500 = $166 EV on a $250 free play → **~66¢ on the dollar.**

- **Deposit bonus (DraftKings-style):** match-bonus released via churn. Math: 20% bonus up to $1,000 with 25× rollover requirement.
  - Churning $25K at ~2.4% juice cost = ~$600 lost.
  - $1,000 received − $600 churn cost = **+$400 expected profit.**
  - Critical caveat: this only works if you're churning at sharp-ish prices and have stamina for 25K of bets.

- **Total state-grind value (Colorado 2021):** ~$3,000 EV across all major books, conservatively.

- **Critical operational warnings:**
  - **Screenshot the promo terms** before depositing. Books "lose" the offer when payout time comes.
  - Most books only allow withdrawals via the same method as deposit; avoid credit-card deposits.
  - Cash deposits sometimes get a bonus (FanDuel had a 20% site credit on cash deposits at off-track parlors).
  - Expect 1-week+ payout delays and runaround. Be patient and prepared to go to gaming-control if needed.
  - Most books limit new-account bonuses to one state per book — you can't grind the same FanDuel bonus in two states.

> 🔑 **This addendum is the operational complement to LOSB's "go for broke" deposit-bonus chapter** — and adds risk-free and free-play promos that LOSB doesn't cover. Together with LOSB's go-for-broke math, this is enough material for a flagship PPS guide.

## Strongest claims (with evidence)

| Claim | Evidence | Confidence |
|---|---|---|
| Sports betting is a market (not a casino game) | Repeated structural arguments + LOSB cross-citation | **Very high** — multi-source |
| Price ≠ Juice; juice is irrelevant to sharps | Concrete -1000/+800 ≈ 2% vs -110/-110 ≈ 4.55% comparison | **Very high** — mathematically demonstrated |
| The sharp line cannot be reduced finer than the width of the market juice | Ch 11 final caveat | **High** — epistemically careful |
| Wong-teaser gravy train collapsed when published | Heritage's Ganchrow's public response, quoted in book | **Very high** — primary source |
| Risk-free promos pay ~4× more on dogs than faves | Worked-out results-tree math in addendum | **Very high** — explicit calc |
| CLV is partly a deepity, especially for line grinders | Ch 20 argument + concrete Seattle-StL counter-example | **High** — but contested vs LOSB |
| Closing line is NOT always the most efficient line | Two-universes hypothetical (Ch 21) + Seattle-StL real case | **High** |
| Buying half-points: cost decreases per increment in old-school 10¢ pricing | Worked-out 2.38% → 2.16% → 1.98% chain | **Very high** — arithmetic |
| Edge estimation errors on big faves are catastrophic; bet less per edge-unit on dogs | Bayesian intuition + market structure | **Medium-high** — intuitive but unproven directly |
| All published edges eventually get absorbed by the market | NFL turnover system case (472-346 → 142-148) + Wong teaser case | **High** — multiple examples |
| Three legitimate handicapping skill tests are ATS, CLV, and forward-linemaking | Ch 18 + Ch 22 | **Medium-high** |

## Examples / data points worth preserving

### Worked numerical examples (cleanly usable in PPS content)
- **Break-even win rates:** −110 → 52.38%; −120 → 54.54%; −130 → 56.52%; etc. The first 10¢ costs 2.38%, the second 2.16%, the third 1.98%.
- **Vig calculation:** −110/−110 = 4.55% theoretical hold; −200/+170 = 3.57%; −1000/+800 = ~2%.
- **Risk-free promo on 2-1 dog (full results tree):** P=1/3 × $1200 = $400 + P=2/9 × $600 = $133 + P=4/9 × −$600 = −$267 → +$267 EV.
- **NFL "Just Win" debunk:** spread mattered in ~30% of games headline claim, but that's because most spreads are small. In spreads >30 (CFB), the spread *always* matters.
- **Author's NFL turnover system:** 472-346-19 (57.7%) ATS pre-2012 → 142-148 post-2012. Public systems collapse on publication.

### Operational sample data
- Author's 2018 Washington Redskins offensive PIV (Player Impact Values) table: full roster with player rating, snap %, impact value, totaling 12.03 offensive + 5.3 defensive/coaching/ST = 17.32 team rating.
- Author's NFL game-day adjustment values (Ch 25, 2021 version) — fits in a single small table; could become PPS content.
- Colorado 2021 sportsbook-by-sportsbook promo list with valuations.

## What's unique vs. other sources

- **The "Price is not Juice" reframe.** Not present in LOSB or Funt (at least not as a named, hammered concept). Sharper makes this a foundational mental model.
- **Push frequencies as the missing piece for line-shop math.** LOSB mentions this lightly; Sharper makes it a chapter and provides the back-out-from-alternates spreadsheet formula. **Operationally unique.**
- **CLV-as-deepity critique.** Sharper's explicit pushback on the CLV mantra is rare in print. PPS gets a first cross-source disagreement here. (Funt doesn't address CLV directly; LOSB centralizes it; Sharper pushes back; MV doesn't engage CLV as a metric.)
- **Trailing vs leading edge of line movement.** A subtle concept not found explicitly in LOSB. Sharper specifies WHEN to trust which side of the line.
- **The Risk-Free Promo grind math.** LOSB covers deposit bonuses (go-for-broke math) but doesn't cover risk-free or free-play promos with full results-tree math. Sharper does. **Operationally unique.**
- **The 3-pronged handicapping rating approach (player + performance + market).** A clean, teachable taxonomy. LOSB doesn't articulate this taxonomy explicitly.
- **"Sharp line cannot be reduced finer than the width of the juice."** A rare explicit epistemic limit statement. Worth surfacing in PPS content as a humility marker.
- **"Bet more on favorites, less on dogs, edge-equal."** Counter-Kelly intuition. Possibly contestable but worth surfacing.
- **The Wong teaser case study.** Concrete primary-source documentation of a public-edge-collapse event. Powerful pedagogy.

## Weak claims / limitations / criticisms

- **Self-published, no formal peer review.** Forum-credentialed; not academic.
- **Authorial voice is acerbic-dogmatic** at times. The "squares vs sharps" binary is rhetorically punchy but glosses over the spectrum LOSB articulates with the 1-5 sharpness profile system.
- **Pre-mobile-app pre-PASPA-reversal data in much of the book** (2016 original); the addendum brings it forward to 2021. The bulk of the operational claims are timeless math; the cultural/structural claims about books are mostly the 2010s offshore era.
- **No engagement with the addiction-and-public-health angle** that Funt centers. This is a sharp's pragma book, not a critique.
- **The "edge estimation on big favorites is catastrophic" claim** is stated as intuition, not proven. Worth marking as plausible but unverified.
- **The CLV critique is unmoored from explicit quantification.** Pokerjoe doesn't propose a replacement metric for handicapping skill. He says "results + methodology + linemaking," but those are not operationalizable.
- **Modeling is dismissed too quickly** ("any model will eventually collapse"). The argument has merit but lacks proof; some quant operations clearly persist. Worth noting as a strong opinion rather than gospel.
- **Player Impact Values (PIVs) methodology** is described conceptually but not fully exposed (Ch 28-29 detail-light by intent).

## Where we'd extend or disagree

- **CLV reconciliation (the headline contribution PPS can make):**
  - LOSB's "≥half the hold over hundreds of bets" CLV test is a *handicapper-skill* signal, not a *line-grinder* signal.
  - For line grinders, CLV is largely tautological — they bet because the available line is off-market; the market then converges to consensus; that *is* CLV by construction. So CLV is *built into* line-grinding, not a separate skill demonstration.
  - For handicappers, CLV *is* a partial skill signal, but also partly an artifact of book deference to winners. So even there it's noisy.
  - **PPS synthesis:** CLV is best understood as a *necessary but not sufficient* signal. A line grinder with positive CLV needs to ask "is my CLV better than the average line grinder's?" not just "am I positive on CLV?" A handicapper with positive CLV needs to ask "am I creating it or absorbing it?"
  - The closing line is not always the most efficient line — agree with Sharper.

- **Sharp line × business model.** Sharper identifies sharp books (Pinnacle, Circa, etc.) as low-juice non-booting books. LOSB explains *why* those books can do this (market-maker business model). Combine them: the **structural reason** a sharp line is sharp is the business-model decision to allow sharp action and maximize accuracy rather than profile-and-limit.

- **Risk-free promo math × LOSB go-for-broke math.** Together these are the complete operational treatment of state-legal-sportsbook promo grinding. A PPS guide called **"The Promo Grind: 4 Promo Types and How to Math Each One"** would cover (1) deposit-bonus rollover, (2) deposit-bonus go-for-broke, (3) risk-free bet (bet dogs), (4) free-play bet (bet dogs). This is unique in market; LOSB covers (1) and (2); Sharper covers (3) and (4).

- **Pokerjoe's "bet more on faves, less on dogs" Kelly adjustment.** MV's framework (lottery-preferences inflate underdog prices) actually *supports* this from a different angle: if underdogs are *systematically* mispriced upward by lottery preferences (the FLB), then your edge-estimate on a dog already incorporates a bias-driven inflation, and your Kelly stake should be reduced. **Cross-source synthesis: MV's preference-driven FLB + Sharper's "smaller stake on dogs" rule are mutually reinforcing.**

- **Generic points vs spread points** — the push-frequency adjustment is a small operational tool PPS could turn into a calculator. Input your power-rating edge, the line crossed, and the relevant PFs → output your true spread-point edge.

## Reader pain points exposed

### "I've spent years tracking CLV thinking it was the answer"
Sharper's deepity argument hits readers who've internalized the LOSB-style CLV gospel and now wonder if they've been measuring the wrong thing.
→ Use for: a thoughtful "what does CLV actually measure, and what doesn't it?" piece. Honest engagement with the disagreement.

### "I keep buying half-points because they 'feel safer'"
The decision is a math question, not a feeling question. Squares routinely buy points; sharps occasionally and only when the math works.
→ Use for: a Buying Points lesson + decision calculator.

### "I thought 'high juice' meant high cost — turns out my bookie's price is what matters"
The Price-vs-Juice reframe is genuinely disorienting on first contact. Bettors who've been avoiding "high-juice" books for years discover they've been thinking about it backwards.
→ Use for: a Price-Is-Not-Juice lesson, very Path-01 staple.

### "I thought I had a system but I didn't"
The NFL turnover system case (collapsed when published). Squares confuse data-mined patterns with edge.
→ Use for: lesson on system survivorship bias.

### "I lined up for years to bet on big favorites because they're 'safer'"
Sharper hammers: betting bets you win is not the same as making money. Big-fave bias is square thinking. Combine with MV's FLB analysis for full picture.
→ Use for: "Why your gut wants the favorite (or the underdog) — and why your gut is wrong."

### "I want to bet sports for a living"
Ch 31 ("The Life"). Pokerjoe's brutal honesty: even the most successful operators describe it as "a grind, not fun." The "if it sounds awesome to you, you're not ready" test.
→ Use for: an honest career-realism piece; brand-aligned (we don't sell the dream).

### "I've been told to beat the close, but I bet earlier and now feel bad"
The close isn't always the most efficient line. Sometimes square money near close *de-anchors* it.
→ Use for: "Why beating the close isn't always the goal" guide.

### "Risk-free promo on the favorite seemed safer"
And was 4× *less* EV than the same promo on a 2-1 dog. Worked-out math kills the intuition.
→ Use for: a Risk-Free Promo Math guide + calculator (HIGH demand from US legal-market bettors).

## Direct quotes (with chapter refs)

> "The essence of sharp sports betting is to bet that your estimate of a team's win chance is more accurate than the market's." — Ch 1

> "It's never about who is more likely to win, it's only about how likely are they to win relative to the odds." — Ch 2

> "Sports betting is a market. Lines are only initially made by a linemaker. They are thereafter moved by the bettors themselves." — Ch 6 (also Pokerjoe's direct LOSB cross-reference)

> "Juice is irrelevant to a sharp bettor." — Ch 5

> "The juice, from your point of view, is the total difference between the best numbers you can get on either side of an offer." — Ch 10

> "Beating the closing line correlates to winning. So does beating the close-of-live-betting line. So does picking the game winner. So does beating the spread. It's deepity, isn't it?" — Ch 20

> "The sharp line cannot be reduced beyond the width of the market juice." — Ch 11

> "Whether you should buy a half-point is a math question, and nothing else." — Ch 2

> "Get over the idea that this stuff ever, ever ceases to be gambling." — Ch 18

> "If being a pro bettor sounds fun to you, you haven't learned what being a pro bettor is." — Ch 31

> "Several thousand dollars in expected value just lying on the floor for you to pick up. It's an opportunity that probably won't always exist." — Addendum, on US legal-market promos

> "Books who are destroying sports betting in this country with their crappy, cowardly, dress-making philosophies, I'll have made the world a smidgen better." — Addendum (closing line of book) — direct industry critique echoing Funt's tone

## What this source unlocks (cross-pollination)

- **Direct LOSB cross-citation** in Ch 6 — Pokerjoe explicitly recommends LOSB on linemaking. The two books are in dialogue; PPS sits in their shared universe.
- **Funt cross-pollination on beards** — Pokerjoe's "beard farmer" concept is the operational reality behind Funt's beard-experiment journalism. Same phenomenon, two angles (insider-tactical + outsider-investigative).
- **MV cross-pollination on Kelly + FLB** — Pokerjoe's "smaller stake on dogs" rule + MV's FLB framework reinforce each other.
- **First cross-source conflict** — CLV. LOSB centralizes it; Sharper deflates it. PPS gets to synthesize a position.
- **Bridges LOSB's industry analysis with operational practice** — for a reader who reads LOSB and asks "OK how do I *do* this?", Sharper is the answer.

## Topic tags

For cross-referencing into `library/topics/`:

- `expected-value-foundations` — primary
- `vig-free-line-calculation` — **new topic, primary** (MV touches on this; Sharper operationalizes)
- `push-frequencies` — **new topic, primary** (Sharper is THE source)
- `kelly-criterion-and-sizing` — primary (Sharper is the operational source)
- `buying-and-selling-points` — **new topic, primary** (Sharper)
- `middling-scalping-arbing` — **new topic** (Sharper)
- `parlays-and-sgps` — secondary (Sharper agrees with LOSB on fixed-odds parlay EV cost)
- `teasers` — **new topic, primary** (Wong teaser case study)
- `closing-line-value` — primary — **+ conflict with LOSB**
- `line-movement-interpretation` — **new topic, primary** (trailing vs leading edge concept)
- `sharp-line-construction` — primary (Pinnacle/Circa/Heritage/Bookmaker/Westgate roster)
- `bonus-conversion` — primary — **complements LOSB; Sharper covers risk-free + free-play promos LOSB doesn't**
- `handicapping-methodology` — **new topic, primary** (3-pronged: player + performance + market)
- `power-ratings` — **new topic**
- `injury-impact-modeling` — **new topic** (Sharper provides operational example)
- `square-vs-sharp-thinking` — **new topic, primary**
- `price-vs-juice` — **new topic, primary** (Sharper is THE source)
- `gambling-life-realism` — **new topic** (Ch 31)
- `system-survivorship-bias` — **new topic** (NFL turnover system case)
- `market-efficiency-sports-betting` — secondary (Sharper argues market is only relatively efficient)

## Pedagogical patterns

Sharper's pedagogy is operationally distinct from both LOSB (analytical) and Funt (journalistic). Useful patterns:

### Effective patterns
- **"Don't talk or think like this" dialogues.** Recurring device throughout: a fake conversation showing the square mistake, ending with a sharp's correction. Concrete, memorable, slightly comic. **PPS can borrow:** when introducing a counter-intuitive concept, frame it with a fictional dialogue exposing the wrong mental model. (We already do something similar in tool-page copy; this gives it explicit structure.)
- **Spreadsheet formulas embedded directly in the text.** Each operational tool comes with copy-paste-ready Excel/sheets formulas. Almost unique for a betting book. Lowers the barrier between "reading the concept" and "doing the math." **PPS should consider** including paste-ready formulas (or live mini-calculators) inline with every framework piece.
- **"X is a math question, never a sport question."** Recurring framing in Ch 14 + Ch 18. **PPS can borrow** the cadence: "Whether to bet a teaser is a math question, never a sports question." "Whether to buy a point is a math question, never a sports question." The repetition trains the reader's reflex.
- **Concrete case studies of edge collapse.** NFL turnover system (472-346 → 142-148). Wong teaser (Heritage fix). These are short, named, falsifiable stories that train the reader's pattern-recognition. **PPS can borrow:** every general claim about edge decay should have a concrete named case attached.
- **Epistemic humility as a structural feature.** "Estimated edge is not edge." "The sharp line cannot be reduced beyond the width of the juice." Pokerjoe is unusually willing to mark the limits of what bettors can know. **PPS should borrow** this — be explicit about uncertainty, especially in the calculator tooltips.
- **The deepity / Dennett move.** Quoting a third-party intellectual frame ("deepity") to name a fuzzy bad concept. Adds intellectual credibility without preaching. **PPS can borrow:** when we have a sharp critique of conventional wisdom, naming it cleanly (the way Sharper names "deepity") increases stickiness.

### What we'd avoid
- **Inline URLs to tinyurls.** Pokerjoe drops dozens of tinyurl links inline. Half are link-rotted by now. PPS uses proper citation lists at piece end.
- **Acerbic-dogmatic voice in places.** Pokerjoe occasionally lapses into "if you're math-phobic you won't make it in this game" sermonizing. PPS's tone is more invitational than gatekeeping. Same content, friendlier delivery.
- **Square-vs-sharp binary** as the *only* axis. LOSB's 1-5 sharpness scale + "sharps respect retail readers" framing is more humane. PPS lives somewhere in between.
- **Self-published book formatting** (e.g., "OceanofPDF.com" watermark every chapter, awkward heading hierarchies). Cosmetic but worth noting we don't replicate.

## Content opportunities this book seeds

### Lessons (curriculum)
- **"Price is not Juice — and why this is the most-misunderstood concept in betting"** — Counter-intuitive reframe; very Path-01-staple. **HIGH**.
- **"Don't shop for low juice. Shop for the best price on your side."** — Operationalizes the same reframe. **HIGH**.
- **"Why buying half-points is a math question (and a calculator for it)"** — Anti-square content; fills #11/#15 LOSB gap. **HIGH**.
- **"Why the closing line is not always the most efficient line"** — Counter to received wisdom; tied to the CLV reconciliation. **HIGH**.
- **"Trailing vs leading edge: what line movement tells you"** — Sharper-original concept. **MEDIUM-HIGH**.
- **"The 'Just Win, Baby' fallacy"** — Spread-doesn't-matter critique; recurring tout claim debunked. **MEDIUM**.
- **"Why your handicapping system stopped working when you wrote about it"** — System survivorship + edge decay; uses NFL turnover + Wong teaser cases. **HIGH**.
- **"Risk-free promo on the favorite vs underdog: full math"** — Counter-intuitive (dogs win, 4×); strong viral potential. **HIGH**.
- **"Power ratings 101: the three ways to rate a team"** — Player + performance + market taxonomy. **MEDIUM-HIGH**.

### Guides (deep-dive pages)
- **"The vig-free line: how to read what the market thinks the true odds are"** — A core handicapping tool deeply explained. **HIGH**.
- **"Push frequencies and why they're the missing piece of your edge math"** — Includes the back-out-from-alternates formula. **HIGH**.
- **"The Promo Grind: 4 promo types, full math"** — Combine LOSB go-for-broke + Sharper risk-free/free-play + deposit-bonus rollover. **FLAGSHIP CANDIDATE**.
- **"Choosing between alternate lines on the same game"** (Ch 15 method) — Practical decision guide. **MEDIUM-HIGH**.
- **"Closing line value: what it actually measures (and what it doesn't)"** — The CLV reconciliation piece. Genuine PPS contribution. **HIGH**.
- **"Sharp books vs square books"** — Sharper's named list + LOSB's structural explanation. **HIGH** — corroborates the Sportsbook Tier-Map.

### Tools / calculators
- **Vig-Free Line Calculator** — Input two-sided prices, output juice-free fair odds. Pasteable formula already in note. **HIGH** value, **LOW** build cost.
- **Push Frequency Estimator** — Input a sharp book's alt-line prices around a number → output implied PF. Direct from Sharper's formula. **HIGH** value, **LOW** build.
- **Buying Points Decision Tool** — Input original line/price, alt line/price, PF → output buy/don't buy. **MEDIUM** value, **LOW** build.
- **Risk-Free Promo Optimizer** — Input promo size + sharp dog odds → output expected $ value of grinding it. **HIGH** value, **MEDIUM** build, big SEO.
- **Free-Play Optimizer** — Similar to above. **HIGH** value, **LOW** build.
- **Deposit-Bonus Churn Calculator** — Input bonus %, rollover multiple, avg juice paid → output expected profit. **HIGH** value, **MEDIUM** build.
- **Alternate Line Comparator** — Input two alternate offers on the same game → output which has more relative edge against the sharp line. From Ch 15. **MEDIUM** value, **LOW** build.
- **Edge-to-Bet-Size (Kelly) Calculator** with fractional-Kelly selector and big-favorite warning. **HIGH** value (extends what we already have).

### PPS Originals
- **The Promo Grind (master guide)** — Combines LOSB Go-For-Broke + Sharper Risk-Free + Sharper Free-Play + Deposit-Bonus Churn into the *complete operational treatment of US legal-market promos*. Bundles guide + 4 calculators. Probably the highest-impact piece in the entire library right now. **FLAGSHIP-CANDIDATE**. **HIGH**.
- **The CLV Reconciliation** — How to use CLV correctly given that two of the smartest sharp-betting books (LOSB and Sharper) disagree about it. PPS's independent synthesis. Brand-builder. **HIGH**.
- **"Price is not Juice" + Sportsbook Hold Tier** — Pair the conceptual reframe with our tier-map. **HIGH**.

## Market gaps this book reveals

(In addition to the 31 already identified.)

32. **The Price-vs-Juice mental model** — almost universally misunderstood in public content. Every "best sportsbook" article ranks on hold/juice; Sharper's framework says that's nearly the wrong question. **Massive gap.**
33. **Push frequencies as the missing operational input** for buying points, alt-line shopping, teaser math, and edge estimation. Almost no public content explains how to back PFs out from sportsbook alt-lines.
34. **The risk-free promo math** (4× better on dogs than faves) — counter-intuitive; almost never explained correctly in promo-grind blogs.
35. **Free-play promo math** (~60¢ on the dollar; bet dogs) — same gap.
36. **The deposit-bonus churn vs go-for-broke decision** — when to grind, when to YOLO. LOSB covers go-for-broke; Sharper covers churn. PPS can combine.
37. **"The closing line is not always the most efficient line"** — directly contradicts almost all public CLV content. PPS's independent position here is distinctive.
38. **Trailing vs leading edge of line movement** — Sharper-original framework, never explained publicly.
39. **The CLV-deepity tension** — public CLV content is uniform on "track and beat the close"; the disagreement between LOSB and Sharper isn't surfaced anywhere outside specialist forums.
40. **Generic points vs spread points** — the push-frequency adjustment for power-rating edges. Conceptually clean, operationally absent in public content.
41. **The "bet more on faves, less on dogs at equal edge" Kelly adjustment** — Sharper-specific operating practice; combines naturally with MV's FLB framework.
42. **The sharp-books-vs-square-books roster** — concrete named list of who lets sharps bet. LOSB explains the structure; Sharper names the books; PPS Tier-Map can synthesize.

## Reading notes for future passes

**First pass complete at conceptual and tool-extraction level.** Player Impact Values methodology (Ch 28-30) was read at a conceptual level only — fuller revisit warranted if PPS builds player-rating tooling. The injury-impact micro-examples (Ch 27 Week 1 2015 notes) could be cribbed-by-example for a "How sharps think about injury impact" piece but require care given specific player references.

Cross-references most worth pulling forward:
- LOSB cross-citation in Ch 6 (Pokerjoe ↔ Davidow/Miller alignment)
- Ganchrow's Wong teaser response in Ch 8 (primary-source quote)
- Fishhead's pro-bettor advice in Ch 31 (primary-source quote)
- PlusEVAnalytics CLV thread reference (Ch 20)
- The full Colorado promo list (Addendum) — operational gold

## Pedagogical patterns (summary for cross-book template tracking)

Distinct PPS-borrowable moves:
- **"Don't talk or think like this" dialogues** — corrective fictional conversations
- **Inline spreadsheet formulas** for every concept
- **"X is a math question, never a sports question"** repetition
- **Named edge-collapse case studies** (NFL turnover, Wong teaser)
- **Explicit epistemic humility** ("estimated edge is not edge")
- **Third-party intellectual frame imports** (Dennett's "deepity")

Voice/tone to *not* replicate:
- Acerbic-dogmatic edges
- Square-vs-sharp binary (too sharp; LOSB's 1-5 is more humane)
- Inline tinyurls (use proper citations)
