# Trading Bases — Joe Peta (Dutton/Penguin, 2013)

> **Reading status:** ✅ First-pass complete. Deep read on Part One (The Model — chapters 1-6 establishing cluster luck, Pythagorean theorem, player projection, SIERA, the betting primer) and the highest-value Part Two/Three chapters (Mental Discomfort of Being Behind, What Vegas Can Learn from the Trading Floor, Focusing on the Wrong Data, Weighting Is the Hardest Part, What Does Work in the Playoffs, Launching a Fund). Skim of the Part Two month-by-month progress chapters. Capped at concept level: the Sweet Sound of Familiar Voices, Pete's Tavern Revisited, A Financial Field of Dreams, A Winning End to the Season, Hey Dad Wanna Have a Catch, and the Vegas Epilogue.
>
> **Length:** ~310 pages, 25 chapters + intro + epilogue.

## Bibliography

- **Title:** Trading Bases: A Story About Wall Street, Gambling, and Baseball (Not Necessarily in That Order)
- **Author:** Joe Peta
- **Background:** 15-year Wall Street career: Lehman Brothers (1996-2008, NASDAQ market maker), UBS (2008-09 data analyst), Nomura Securities (2010, principal trading head). Wheelchair-bound after a 2010 hit-and-run accident in NYC, used recovery time to build the baseball betting model the book chronicles. Joined Point72 Asset Management (Steve Cohen's firm) post-publication.
- **Publisher:** Dutton (Penguin Group)
- **Year:** 2013 (chronicles the 2011 MLB season)
- **Voice:** Wall Street memoir crossed with sabermetric explainer. Trader-pragmatist with deep baseball fandom (Phillies). Citation-heavy but accessible. Reads like *Liar's Poker* meets *Moneyball* meets a poker bankroll diary.
- **Significance for PPS Library:** ⭐ **The Wall Street ↔ baseball ↔ sports-betting bridge source.** Explicitly cited in **MV's bibliography** (their footnote 7 in the academic paper). Brings a finance-trading-discipline framework to sports-betting that no other source in our library has. Practitioner's account of building a quantitative MLB betting model from sabermetric first principles. Operationally rich: the dime line, SIERA, cluster luck, Pythagorean win projections, Kelly-style bet sizing. **Bridge between MV/Mathletics (academic) and LOSB/Sharper (operational).** Brings MLB-specific depth our library has been thin on (most prior sources skew NFL/NBA).

## Thesis in one paragraph

Sports betting markets — especially MLB — can be beaten by a disciplined trader who applies the same quantitative + risk-management framework that drives a successful Wall Street trading desk. MLB is the sharpest sport for the math-minded bettor because (1) the dime line gives MLB a structurally lower house edge (~1.78% average juice vs football/basketball's 4.55%), (2) the moneyline structure means player and bettor incentives are aligned (no spread-driven endgame perversity), and (3) sabermetric tools — Pythagorean expected wins, cluster luck regression, SIERA pitcher projection, BABIP normalization, WAR-based lineup adjustments — give a disciplined modeler a sustained edge if applied with bet-sizing discipline. The author built a model on these principles, ran a small private fund on it during the 2011 season, and delivered +41% return. The book's broader theme is **managing to the wrong metric** — across baseball (saves, ERA, errors), Wall Street (loss ratios, gross margins, absolute returns), and sports betting (win rates, hit counts, parlay payouts). What matters is the *right* metric: in baseball, runs scored × runs allowed via Pythagorean; in betting, edge × bet size compounded over time. Everything else is noise.

## Key frameworks / named concepts

### 1. The Dime Line — MLB's structurally lower juice (Ch 6, "Betting on Baseball: a Primer") — CRITICAL
The single most operationally important insight in the book for PPS.

**Standard football/basketball:** -110 both sides → 4.76% juice → bettor must win 52.38%.

**MLB dime line:** -105/-105 on evenly matched teams → 2.44% juice. And as the favorite price rises, **juice actually DECREASES** because the gap between favorite and dog stays fixed at "10 cents":

| Price (fav / dog) | Implied odds | Juice |
|---|---|---|
| -105 / -105 (evenly matched) | 51.22% / 51.22% | **2.44%** |
| -110 / +110 | 52.38% / 50.00% | 2.38% |
| -120 / +110 | 54.55% / 47.62% | 2.17% |
| -150 / +140 | 60.00% / 41.67% | 1.67% |
| **2011 season-average -142 / +132** | 58.68% / 43.10% | **1.78%** |

**Bottom line:** The average MLB bet carries **37.4% of the juice of an average NFL/NBA bet.** With a smaller house edge, the bar to overcome for profitability is materially lower.

> 🔑 **PPS implication:** Cross-validates and extends our library's existing finding. **MV** showed MLB has no FLB (Woodland & Woodland 1994; absent from FLB literature). **Mathletics/Levitt** showed NFL favorites cover <50%. **Peta** now adds: MLB also has the lowest structural juice. **PPS-original synthesis ready: "Why MLB is the sharpest sport to bet" (Peta + MV + Mathletics).**

### 2. The Pythagorean Theorem (Bill James, applied by Peta to bet-sizing)
Team winning percentage ≈ RS^1.83 / (RS^1.83 + RA^1.83). Where actual wins deviate by 4+ from Pythagorean, *non-repeatable* (lucky) results are presumed.

**Peta's operational extension:** strip out cluster luck → restate the season → identify teams whose Vegas futures lines mispriced them based on the unadjusted record.

**Worked example (2010 → 2011 Astros):** 2010 record was 76 wins vs Pythagorean 68 wins (+7.97 win outlier). After stripping cluster luck (-21 runs on offense) + unlucky pitching (-7 runs allowed), the "true" 2010 Astros were ~66-win talent. 2011 Vegas win total: 72.5 → strong under bet. The 2011 Astros went 56-106.

### 3. Cluster Luck (Peta's original contribution)
**Definition:** Random clustering of hits with runners on base, beyond what player skill predicts. Driven by sample-size statistical noise, not "clutch hitting" or "team chemistry."

**The 2010 Tampa Bay Rays case:** Hit a league-mediocre 1.343 hits but scored 802 runs (3rd in MLB). Expected runs (regression on OBP/SLG/ISO): 701. Cluster luck contribution: **+78 runs.** Most lucky season of the decade. Peta predicted Rays would score ~100 fewer runs in 2011. They did (-95).

**Why it matters for betting:** Vegas futures and game lines often use the prior year's record as the baseline. Cluster luck creates predictable mispricings that take months to resolve.

**Cluster luck is league-wide zero-sum:** if Tampa is +78 on offense, some pitching staffs must be -X on offense — they're giving up the extra runs Tampa is "stealing." Identifying both sides of cluster luck doubles the actionable bets.

### 4. The Voros McCracken Finding (2001) — DABIP / BABIP
**Voros McCracken 2001 paper** (sabermetric inflection point): pitchers control only **K rate, BB rate, HR rate**. Everything else — including the famous "ability to induce weak contact" — is largely luck. **BABIP (batting average on balls in play) is essentially random around ~.295-.300** for pitchers regardless of skill level.

**Implication:** Cy Young pitchers and journeyman pitchers have similar BABIP. The traditional ERA is contaminated with BABIP luck.

**Bill James quote** on McCracken: "I feel stupid for not having realized this thirty years ago."

### 5. SIERA — Skill-Interactive Earned Run Average (Swartz & Seidman)
The most important sabermetric statistic for baseball bettors per Peta.

**Genealogy:**
- McCracken 2001 → identified K, BB, HR as the only pitcher-controlled outcomes
- **Tom Tango → FIP** (Fielding-Independent Pitching): K/BB/HR-based expected ERA
- **Dave Studeman → xFIP**: FIP with HR rate normalized to league average (since HR rate is itself partially noisy)
- **Swartz & Seidman → SIERA**: adds ground-ball rate as controlled outcome; models interactions between K, BB, HR, GB rates

**Why SIERA is the bettor's tool:** It assesses *repeatable skills*, not random outcomes. ERA includes BABIP luck; SIERA excludes it. A pitcher with a 5.07 ERA but a 4.56 SIERA is unlucky and will regress to ~4.56. Vegas often uses recent ERA → mispricing.

**Peta's 2011 Bronson Arroyo case:** SIERA predicted 4.56 ERA pre-season (Arroyo had 3.88 in 2010). Vegas underpriced his risk → Peta bet against the Reds in Arroyo starts → won 5 of 7 underdog bets. **+$450 per $100 bet** in that mini-sample.

> 🔑 **PPS operational implication:** Our Pitcher K EV and Batter Hit EV tools are already aligned with this framework (K rate is one of three pitcher-controlled outcomes). PPS can write a "Why Strikeouts and Walks Are the Only Pitcher Stats That Matter" piece citing McCracken 2001 → SIERA → Peta. Foundational content.

### 6. WAR / Replacement-Level Player (Bill James)
**Worth Above Replacement (WAR):** how many wins a player contributes vs. a freely-available "replacement-level" minor leaguer.

**Peta's Verlander thought experiment:** if the 2011 Tigers had FIVE Justin Verlanders in their rotation instead of one, they'd win ~115-116 games — not 120, 125, or "all 162" as casual fans guess. The Pythagorean math constrains the answer because the offense is fixed at 787 runs. Worth ~5 wins above replacement.

**Operational use for PPS:** quantify the effect of any roster change (injury, trade, free agent) on a team's expected season win total. Vegas futures lines can be exploited when they undervalue/overvalue these changes.

### 7. The "Trading Floor Sports Market" innovation (Ch 16, "What Vegas Can Learn from the Trading Floor")
A genuinely novel market structure Peta invented at Lehman in 1997 and which has spread across Wall Street trading desks:

- For each NFL team, market-maker quotes a **two-sided bid/ask** on regular-season + playoff wins (e.g., Bears 7-8: bid 7, ask 8).
- "Shares" trade like stocks. Final value = team's actual wins (regular season + playoffs).
- Markets refresh **every Tuesday during the season** — traders can switch sides, hedge, take profits.
- Bid-ask spread (typically 1 game) replaces sportsbook juice.
- Derivative principle: being short 3 teams in a 4-team division = synthetically long the 4th team. Hedge accordingly.

**Why this matters for PPS:** the betting industry doesn't offer this product. Vegas misses out on (a) year-round trading volume, (b) hedge-and-flip retention, (c) tape-watcher engagement. Peta argues sportsbooks should learn from Wall Street's market-making playbook — post a public bet ticker, share all line-move data, etc.

PPS angle: there's a potential **PPS-original tool** here — a "Team Wins Stock Market" calculator that prices futures the same way a market maker would, showing bid/ask, implied volatility, hedge positions across a division. Speculative but distinctive.

### 8. The Implied Odds Math Foundation (Ch 6)
Standard primer that aligns with what Sharper teaches but with Peta's trader voice:

- Implied odds = outlay / (outlay + payout)
- -110 → 52.38%
- Juice = sum of implied odds in excess of 100%
- The "house cannot be beaten ex ante in roulette" framing — vs sports where edges can exist a priori

### 9. Bet Sizing Discipline (Ch 7-22 throughout)
Peta's model uses a tiered bet-sizing schedule:

| Edge level | Bet size (% of bankroll) |
|---|---|
| Highest-conviction games | 2% |
| 1.5% |
| 1% |
| 0.5% (50 bp) |
| 0.4% (40 bp) |
| 0.2% (20 bp) |
| 0.1% (10 bp) (lowest-edge bets) |

**Operational rule:** ~85% of MLB games passed the model's edge threshold for *some* bet. Most were 10-20 bp small plays; the high-conviction 1-2% bets were rare.

**2011 results:**
- Total games picked: 2,095 (out of ~2,430 played) = 86% participation
- Win-loss: 1,087-1,008 (51.9%) — below the 52.38% naïve break-even but the dime-line math + variable sizing made it profitable
- Regular-season return: **+28.81% on portfolio** + **+2.65% on futures basket** = **+32.83%**
- Post-season: +6.17% additional
- **Full-year: +41.03%**

> 🔑 **Critical insight:** Peta's win rate was only 51.9% — *below* the 52.38% break-even for standard football/basketball. He profited because (a) MLB's average juice is 1.78% not 4.76% so break-even is lower, and (b) variable bet sizing put more money on higher-edge bets. **MLB profitability doesn't require crushing the spread; it requires modest edge × disciplined sizing × low juice.**

### 10. "Managing to the Wrong Metric" — recurring framework (Ch 19 and throughout)
Peta's master frame for organizational dysfunction, applied across baseball, Wall Street, and sports betting. Examples he lists:

1. **The Yankees bullpen misuse** (April 5, 2011) — Girardi saved Mariano Rivera for the 9th instead of the highest-leverage moment (bases loaded, 2 outs, 8th, 3-run lead) → blew the game. *Managing to "save" stat instead of leverage.*
2. **Poker player who has "never been knocked out on Day 1 of the Main Event"** → wrong metric. Goal is *most money*, not survival.
3. **NYT trumpets Eduardo Núñez's "errors" while ignoring his made plays** → errors are nearly meaningless; "plays made" matters.
4. **Lehman traders judged on "loss ratio"** in 1999 high-volume era → wrong metric in a high-margin environment; gross volume matters more.
5. **Hedge fund manager insisting on "absolute returns" not "marketable returns"** → wrong: path-dependence determines whether investors stay or flee.
6. **Ron Washington benches hot Napoli for Torrealba in 2011 WS Game 3** out of loyalty → costs Rangers a chance.
7. **Amazon mocked for not turning a profit** → wrong metric for that stage of business.
8. **The Nomura "loss ratio" panic that fired Pascal** → wrong metric.
9. **Pirates closer Hanrahan unused in 3 extra-inning losses then used in a blowout** → save metric again.

**For PPS:** this is the operational complement to Duke's "decision swear jar" and Sharper's "estimated edge is not edge." Specific bettor versions: tracking units (the right metric? PPS would argue maybe — see CLV conflict #1) vs win rate vs ROI vs decision quality. **Brand-aligned PPS lesson: "What metric are you actually managing your betting to?"**

### 11. The Mental Discomfort of Being Behind (Ch 14)
Mid-season the model went on a losing streak (June-July combined: -10%+ drawdown). Peta describes the psychological challenge of trusting a model that's underperforming. Direct overlap with Duke's "resulting" + Sharper's tilt + Mathletics's variance pages.

**Critical operational point:** he didn't change the model during the drawdown. He had to trust the math through the noise. The model recovered in August (+8.5%) and September (+11.6%) for a +41% full-year result.

**Cross-source synthesis:** This is the *practitioner's account* of what Duke calls "tilt-proofing through Ulysses contracts" and Sharper calls "estimated edge is not edge." Peta lives it.

### 12. "Markets Can Remain Irrational..." (Ch 20, Keynes reference)
Keynes: *"Markets can remain irrational longer than you can remain solvent."*

**Peta's application to baseball futures:** even when his model identified an edge pre-season, the line didn't move toward fair value for months. The model's daily-game bets compensated by capturing edges quickly; futures positions had to be sized with knowledge that "right but early" can mean broke.

**For PPS:** direct cross-reference to Sharper's "the sharp line cannot be reduced beyond the width of the juice." Two practitioners, same epistemic humility.

### 13. The Pre-Game Pitcher Lockup
Per Peta's primer: in baseball, the listed-pitcher clause means the bet is conditional on both listed starters actually pitching. If either is scratched, the bet is voided (or settles based on the alt pitcher with adjusted line). Football has no equivalent. Operational note for any MLB-prop or game-line PPS tool.

### 14. The Mom Test / Today Show Test
Peta's measure of when a sports moment has broken into general consciousness: when his wife mentions it at the breakfast table. Combined with Bill Simmons's "Mom Test." Useful framing concept; cross-references to PPS's potential audience-expansion strategy.

## Strongest claims (with evidence)

| Claim | Evidence | Confidence |
|---|---|---|
| MLB has structurally lower juice (~1.78% avg vs football/basketball 4.76%) | Dime-line math in Ch 6 | **Very high** — direct calculation |
| Pitchers control only K, BB, HR rates (BABIP is noise) | McCracken 2001 paper + decade of confirming research | **Very high** — peer-reviewed sabermetric consensus |
| SIERA outperforms ERA, FIP, xFIP as forward predictor | Swartz & Seidman + Peta's own RMSE calculations | **High** |
| Cluster luck is real and reverts | Peta's 2010 Rays case + 2011 reversion + multiple other cases | **High** — practitioner-confirmed |
| MLB betting is exploitable with a disciplined sabermetric model | Peta's 2011 +41% return on a private fund | **Medium-high** — single-season practitioner result; not peer-reviewed but operationally rigorous |
| Coaches/managers/traders systematically manage to the wrong metric | 9 worked examples across domains | **High** — pattern-rich evidence |
| Variable bet sizing × low juice can produce profit at 51.9% hit rate | Peta's own 2011 record | **High** |

## Examples / data points worth preserving for PPS content

### Operational MLB-specific
- **Dime line table** (above) — direct reference data
- **2011 average favorite price: -142** with juice 1.78%
- **Average MLB game has lower juice than even the cheapest football/basketball offer**
- **Listed-pitcher rule:** baseball bets are conditional on the listed starters actually starting
- **Pythagorean exponent 1.83** (refinement of original 2; most accurate empirically)

### Model performance benchmarks (2011 season)
- Games picked: 2,095 of ~2,430 (~86%)
- Win-loss: 1,087-1,008 (51.9%)
- Regular-season return: +28.81% (portfolio) + +2.65% (futures)
- Post-season return: +6.17%
- Full-year: +41.03%
- Largest monthly drawdown: ~6% (June-July combined ~10%)
- Recovery: August +8.5%, September +11.6%

### Sabermetric primary citations (PPS bibliography expansion)
- **Bill James** — Pythagorean theorem, Baseball Abstract series, hired by Red Sox 2003
- **Voros McCracken (2001)** — pitchers control only K/BB/HR (the "DIPS" or Defense Independent Pitching Statistics paper)
- **Tom Tango** — FIP creator, Leverage Index creator (already cited via Scorecasting!)
- **Dave Studeman** — xFIP creator
- **Matt Swartz & Eric Seidman** — SIERA creators
- **Nate Silver** — Baseball Prospectus alum → FiveThirtyEight founder (Peta tips this cross-pollination)

### Cross-domain examples (managing to the wrong metric)
- The April 5, 2011 Yankees-Twins game (Girardi withholds Rivera) — direct narrative
- Ron Washington benches Napoli in 2011 WS Game 3 — narrative
- Lehman's 1999 loss-ratio trader judging — narrative
- Pirates Hanrahan three-game unused stretch in 2011 — narrative

### Bet sizing schedule (operational reference)
Tiered 10bp / 20bp / 40bp / 50bp / 1% / 1.5% / 2% bets keyed to edge magnitude

### The "Trading Floor NFL Market" structure
Two-sided bid/ask on team wins, refreshed weekly, settlement = actual wins including playoffs

## What's unique vs. other sources

- **Practitioner's account of an actual money-making MLB model.** No other source we have describes building, running, and reporting results on a quantitative betting fund. LOSB/Sharper are conceptual; MV is academic; Mathletics is textbook. **Peta is the only one who shows the P&L.**
- **The dime line + structural juice analysis** for MLB — operational depth no other source provides. Sharper mentions baseball pricing in passing; Peta dedicates a chapter.
- **SIERA / xFIP / FIP genealogy** — full citation chain for the pitcher-evaluation toolkit. PPS's Pitcher K EV tool can cite this directly.
- **Cluster luck** as a named concept — Peta's original contribution. Cross-references with Scorecasting's mean-reversion findings and Mathletics's hot-hand debunking.
- **The Wall Street → sports betting bridge from a practitioner's voice** — MV's academic Wall-Street-to-betting bridge gets a flesh-and-blood version here. The two sources are stronger together than separately.
- **The "Trading Floor NFL Market" innovation** — a unique product concept absent from any other source.
- **The "Managing to the Wrong Metric" recurring framework** — applied across 9 domains. Peta operates as the cross-domain synthesizer the way Duke does for decision-making.
- **MLB-specific depth** — fills a real coverage gap in our library, which has been NFL/NBA-heavy.

## Weak claims / limitations / criticisms

- **Single-season result.** The +41% return is one year (2011). Peta's epilogue mentions another profitable summer, but the rigorous track record is short. Caveat his claim of "sustainable edge" appropriately.
- **Self-published fund-with-friends scale** — Peta wasn't running institutional money in 2011; the fund was small. The model's results may not scale (a $100k bet in MLB markets is different from $5k).
- **Mass-market book voice** — like Scorecasting, the math is softened. The actual model equations aren't fully disclosed (deliberately, since Peta later launched a fund). PPS readers wanting full rigor will need McCracken/Tango/Swartz/Seidman primary sources.
- **MLB-only.** The model and its principles don't directly transfer to NFL/NBA without significant adaptation. PPS readers focused on football/basketball will need to translate.
- **2011 data window.** MLB has changed since — increased K rates, the shift, pitch clock, expanded playoffs. Some of Peta's specific data points (the dime line is still standard, but the average favorite price may have shifted) need refreshing.
- **No engagement with sportsbook profiling/limiting.** Peta operated through a private offshore book; he doesn't deal with the LOSB/Funt/Sharper realities of being limited at retail. Implicit limitation.
- **No engagement with closing line value as a metric.** The book pre-dates the CLV-centrality wave of the late 2010s. Peta tracks model edge and P&L, not CLV. Doesn't help or hurt the LOSB/Sharper CLV conflict.
- **Some Wall Street autobiography drift** — chapters on his accident, the Lehman culture, Nomura politics are entertaining but not betting-relevant. PPS extracts the betting + cross-domain framework content.
- **Cluster luck as a *name* is Peta's contribution.** As a *concept*, it's adjacent to Tango's Leverage Index and the broader sabermetric noise/skill literature. Mild branding-vs-novelty caveat.

## Where we'd extend or disagree

- **The MLB-sharpest-sport synthesis (PPS-original synthesis #4 ready):** combine Peta (dime line, 1.78% avg juice) + MV (no FLB in MLB — Woodland & Woodland 1994) + Mathletics's Levitt (favorite-bias is in NFL; doesn't translate to MLB moneyline) + the listed-pitcher rule (bettor-friendly auto-void). **No public source has packaged this.** PPS-original content: "Why MLB Is the Sharpest Sport to Bet — and Nobody Tells You This."
- **SIERA × Pitcher K EV cross-pollination.** Our existing Pitcher K EV tool is already aligned with McCracken's K-as-controlled-outcome finding. We can extend with explicit SIERA-based opponent-quality adjustments. **PPS content angle: "Why Strikeouts Are the One Pitcher Stat You Can Trust" — cites McCracken 2001 → SIERA → Peta.**
- **Managing to the Wrong Metric × Decision Swear Jar × Resulting.** Three sources converging on the same idea. Bettor-specific list: tracking units alone vs ROI vs CLV vs decision quality. PPS can publish a "What metric are you actually managing your betting to?" piece.
- **Trading Floor Market × PPS futures product.** Speculative but distinctive: a "Team Wins Stock Market" PPS tool that runs all year, lets users buy/sell season-win futures with bid-ask, models implied volatility. **No public site has this.** Long-term roadmap candidate.
- **MV-Peta bibliographic bridge.** MV explicitly cites Trading Bases. PPS can use this in academic-credibility content: "Even the Yale academics cite this practitioner's account." Reinforces the Moskowitz-Wertheim ↔ MV ↔ Peta thread.
- **Mental Discomfort of Being Behind × Duke's Tilt × Sharper's BR-management × Mathletics's Kelly drawdown.** Four sources, one phenomenon. PPS can ship a "How to survive a drawdown without changing your model" guide — the most operationally important piece for a bettor's emotional discipline.

## Reader pain points exposed

### "I bet football because that's the popular sport — but I keep losing"
Football has the highest juice (4.76% on -110). MLB is structurally cheaper. If you're math-minded and willing to grind, baseball is the sharper market.
→ Use for: "Why MLB Is the Sharpest Sport to Bet" pillar lesson.

### "I bet on the team going for it in the playoffs but they're up against my model"
The playoffs are harder. Peta's edge dropped from ~86% participation (regular season) to ~76% (postseason). The market converges on consensus in high-attention games.
→ Use for: a "Why post-season betting is harder" lesson.

### "I had a losing month — should I scrap my model?"
No. Peta's June-July drawdown was -10%+; he held the model and recovered to +41% by year-end. The variance is the cost of the edge.
→ Use for: "How to survive a betting drawdown" guide.

### "I track my hit rate and I'm above 52% but I'm not making money"
Hit rate is the wrong metric. Variable bet sizing × CLV × edge size matters. A 51.9% hit rate with proper sizing in MLB outperforms a 53% hit rate with flat sizing in NFL.
→ Use for: "Why your win rate is lying to you" lesson (combine with Duke's "resulting").

### "I bet my favorite pitcher's team every time he starts and it doesn't work"
ERA is contaminated by BABIP luck. SIERA is the bettor's tool. A 5.07 ERA pitcher with a 4.56 SIERA is *underpriced by Vegas*. Bet against him at first; eventually the market catches up.
→ Use for: "Why ERA Is Lying To You (And SIERA Isn't)" — actionable MLB content.

### "I bet futures and got crushed when my pick struggled early"
"Markets can remain irrational longer than you can remain solvent." Even right futures bets take time to resolve. Size them small.
→ Use for: "Futures bet sizing" guide.

### "My friend's a fan and bets his team — he never wins"
Confirms LOSB's "are you the sucker" + Peta's "you can't be a fan and bet smartly" theme. Manage to the right metric.
→ Use for: "Why being a fan ruins you as a bettor" — brand-aligned content.

## Direct quotes (paraphrased, with chapter refs)

- **"Skill-based performance is repeatable; results based on luck are not."** — Ch 2 (Cluster Luck)
- **"Tell me how many runs a team scored and how many it allowed and I'll tell you how many games it won."** — Ch 3 (Pythagorean theorem)
- **"The amount of juice on an average baseball bet is just 37.4 percent of the standard football and basketball bets."** — Ch 6
- **"As the price of the favorite rises, the house advantage actually decreases."** — Ch 6 (the dime line)
- **"In baseball, as in all sports betting, the true odds of an event are only known with absolute certainty ex post facto."** — Ch 6
- **"It's an exercise in comparing an implied rate with an expected rate."** — Ch 24 (the trader's mental model)
- **"Markets can remain irrational longer than you can remain solvent."** — Keynes via Ch 20
- **"I'd rather make 15 percent lumpy than 12 percent smooth."** — Warren Buffett (1996 letter), quoted Ch 14
- **"It's the wrong metric."** (recurring throughout Ch 19)
- **"You're not trying to win the most hands. You're trying to win the most money."** — poker mentor, quoted Ch 19
- **"I feel stupid for not having realized this thirty years ago."** — Bill James on Voros McCracken's 2001 BABIP finding, Ch 21
- **"This is the equivalent of agreeing to be Adam Sandler's agent and getting paid by the Oscar nomination instead of a percentage of box-office gross."** — Ch 6 (on the misalignment of bettor and player incentives in football/basketball point-spread bets)

## What this source unlocks (cross-pollination)

- **Synthesis #4 (PPS-original):** **"Why MLB Is the Sharpest Sport to Bet."** Combines Peta's dime-line analysis + MV's no-FLB-in-MLB + Mathletics's Levitt-NFL-favorite-bias + the listed-pitcher rule. Four-source synthesis no public site has packaged.
- **SIERA → Pitcher K EV** product alignment. PPS's existing MLB tools sit on the McCracken/Tango/Studeman/Swartz/Seidman pitcher-evaluation foundation. We can publish this explicitly.
- **Managing to the Wrong Metric × Decision Swear Jar × Resulting** — three-source bettor cognitive frame. Triangulation lesson.
- **Mental Discomfort of Being Behind × Tilt × Kelly drawdown × Mental Time Travel** — four-source emotional-discipline frame for surviving variance.
- **MV-Peta bibliographic bridge** — academic ↔ practitioner pairing. PPS can cite both for credibility multiplier.
- **The "Trading Floor NFL Market"** unlocks a potential original PPS product concept (long-term roadmap).
- **Cluster luck × hot hand** — both are about distinguishing luck from skill in sports outcomes. Combine for content on "What sports statisticians have learned about randomness."

## Topic tags

For cross-referencing into `library/topics/`:

- `mlb-betting-foundations` — **new topic, primary** (Peta is THE source)
- `dime-line-and-juice` — **new topic, primary** (Peta is THE source)
- `pythagorean-expected-wins` — **new topic, primary** (James → Peta)
- `cluster-luck` — **new topic, primary** (Peta is THE source)
- `babip-and-pitcher-luck` — **new topic, primary** (McCracken 2001 via Peta)
- `siera-and-pitcher-projection` — **new topic, primary** (Swartz & Seidman via Peta)
- `war-and-replacement-level` — **new topic, primary**
- `managing-to-the-wrong-metric` — **new topic, primary** (Peta is the cross-domain synthesizer)
- `bet-sizing-discipline` — primary (extends Sharper + Mathletics's Kelly with practitioner tiering)
- `wall-street-and-sports-betting-bridge` — **new topic** (Peta + MV cross-pollination)
- `mlb-listed-pitcher-rule` — **new topic**
- `futures-betting-discipline` — **new topic** (Peta's chapter on launching the fund)
- `mental-discomfort-of-drawdown` — **new topic** (extends Duke's tilt + Sharper's BR-management)
- `kelly-criterion-and-sizing` — secondary (Peta's variable-tier alternative to pure Kelly)
- `behavioral-finance-and-sports-betting` — secondary
- `expected-value-foundations` — secondary
- `historical-academic-foundations` — secondary (McCracken 2001 as foundational citation)
- `decision-quality-vs-outcome-quality` — secondary
- `psychology-of-the-bettor` — secondary

## Pedagogical patterns

### Effective patterns to borrow
- **Open with a vivid name-bearing anecdote.** "Manny Sanguillén couldn't find his car keys." Then bridge to the theme. Hooks the reader before the math arrives. *Same pattern as Duke and Scorecasting.*
- **Track a single season as a narrative arc.** Peta uses the 2011 MLB season as the spine for the entire book. Each chapter is a month or a phase. **PPS can borrow:** for any long-form content, anchor to a specific time-frame and let the data unfold.
- **Worked numerical examples for every concept.** Pythagorean → Astros 2010 case. Cluster luck → Rays 2010 case. SIERA → Arroyo 2011 case. **PPS already does this; Peta confirms the approach.**
- **Tables that strip the math down to operational use.** The dime-line table, the bet-sizing schedule, the month-by-month return tables. Reader can lift and use directly. PPS should publish more of these.
- **The cross-domain analogy as a recurring device.** Wall Street trading desk ↔ baseball clubhouse ↔ poker table. Peta operates as the bridge between worlds. **PPS can borrow:** for any betting concept, ask "what's the parallel in investing, in life decisions, in business?"
- **Honest reporting of drawdowns.** Peta doesn't hide June and July. He reports the -10% drawdown and then the recovery. **PPS should borrow:** when we ship results or case studies, show the drawdown periods, not just the wins.
- **List-based teaching (Ch 19 "Focusing on the Wrong Data").** Numbered list of 9 examples, each gets a short subsection. Scannable, memorable. **PPS can use this for tools-with-examples content.**

### What we'd avoid
- **Wall Street autobiography drift** in places — chapters on the accident, the Lehman culture, Nomura politics are entertaining but slow the betting content. PPS extracts only the operational frame.
- **Pop-culture references** that age (Wii Fit, Antonio Banderas DVD jokes). Refresh.
- **Mass-market math softening** — Peta states SIERA's importance but doesn't disclose the equations. PPS will need to cite primary sources for the full math.

## Content opportunities this source seeds

### Lessons (curriculum)
- **"Why MLB Is the Sharpest Sport to Bet"** — flagship MLB-pillar lesson combining Peta + MV + Mathletics. **HIGH.**
- **"The Dime Line: Why Baseball Juice Is Different"** — operational Path-01 lesson with the dime-line table. **HIGH.**
- **"Why ERA Is Lying to You (And SIERA Isn't)"** — actionable MLB lesson tied to PPS's existing Pitcher K EV tool. **HIGH.**
- **"What is Cluster Luck (and how to spot it)"** — Peta's named concept; useful for season-long futures betting. **MEDIUM-HIGH.**
- **"The Pythagorean Theorem of Baseball"** — Bill James in plain English, with the Astros example. **HIGH.**
- **"Why Your Win Rate Doesn't Matter"** — variable bet sizing > flat hit-rate tracking. **HIGH** — brand-aligned.
- **"Managing to the Wrong Metric (in betting)"** — what's the right metric? Pulls from Peta + Duke + Sharper. **HIGH.**
- **"Why Strikeouts Are the One Pitcher Stat You Can Trust"** — McCracken 2001 in plain English. **HIGH.**
- **"How to Survive a Betting Drawdown"** — Peta's June-July story applied to bettor discipline. **MEDIUM-HIGH.**
- **"Baseball Bets Are Conditional on the Listed Pitcher (and Why That's Good for You)"** — operational MLB primer. **MEDIUM.**

### Guides (deep-dive pages)
- **"The MLB Bettor's Complete Toolkit"** — combines dime line + Pythagorean + cluster luck + SIERA + listed-pitcher rule + variable bet sizing. **FLAGSHIP MLB GUIDE.**
- **"SIERA: The Most Important Pitcher Stat You've Never Heard Of"** — pillar piece with McCracken → FIP → xFIP → SIERA genealogy. **HIGH.**
- **"What Wall Street Knows About Sports Betting"** — Peta + MV practitioner-meets-academic guide. **HIGH** — credibility multiplier.
- **"How to Build a Baseball Betting Model"** — long-form walkthrough of Peta's framework, with simplified math. **HIGH** — Path 04 (advanced) candidate.
- **"Cluster Luck: Why Last Year's Magic Doesn't Carry Over"** — futures-betting deep dive. **MEDIUM-HIGH.**

### Tools / calculators
- **Pythagorean Expected Wins Calculator** — input team RS + RA → output expected wins via 1.83 exponent + comparison to actual record (flags 4+ win deviations as luck). **HIGH** value, **LOW** build cost.
- **Cluster Luck Detector** — input team OBP, SLG, ISO, hits, runs → output expected vs actual runs (regression-based). **MEDIUM-HIGH** value, **MEDIUM** build.
- **SIERA-vs-ERA Mispricing Scanner** — for any starting pitcher, surface ERA-SIERA gap → identify Vegas mispricings (expensive to maintain since it needs FanGraphs data feed). **HIGH** value, **HIGH** build.
- **Dime Line Juice Calculator** — input moneyline price pair → output implied odds and juice. **LOW** build cost, useful for any MLB content.
- **MLB Bet-Sizing Tiered Recommender** — input bankroll and edge → output recommended bet size from 10bp to 2% tiers. **MEDIUM** build, **HIGH** value for MLB-focused bettors.
- **Team Wins Stock Market** (speculative) — long-term roadmap product where users "trade" team-win futures with bid-ask + intraday updates. **HIGH** value if executed, **HIGH** build.

### PPS Originals
- **"Why MLB Is the Sharpest Sport to Bet" (synthesis #4)** — flagship-quality PPS Original combining Peta + MV + Mathletics. Joins the priority shortlist alongside the Decision Discipline Framework, HFA Origin Story, and Promo Grind. **HIGH.**
- **"From McCracken to SIERA: 25 Years of Pitcher Math"** — citation-anchored deep dive; positions PPS as a research shop. **HIGH** for reputation.
- **"What Sports Betting Can Learn From Wall Street"** — combines Peta's Trading Floor concepts + MV academic + LOSB/Sharper operational. **HIGH** — distinctive brand piece.

## Market gaps this source reveals

(In addition to the 64 already identified.)

65. **MLB's structurally lower juice (dime line, ~1.78% avg) is invisible to retail bettors.** Most public content treats all sports as equivalent juice-wise. Peta is the only source explicitly quantifying it.
66. **The McCracken 2001 BABIP finding is invisible to retail MLB bettors.** Fans still talk about "induced weak contact." The academic consensus is opposite.
67. **SIERA as the bettor's predictive ERA isn't surfaced in any public sportsbook-adjacent content.** Even casual fantasy sites barely mention it.
68. **Cluster luck has no name in public content.** Fans see "lucky team" or "unlucky team" but no one names the regression-based concept.
69. **Pythagorean expected wins for season futures is barely discussed publicly** despite being the foundation of MLB sabermetrics for 40 years.
70. **Variable bet sizing tied to edge magnitude** is operational discipline most public bettors never adopt — they flat-bet or use simple unit sizing.
71. **The MLB listed-pitcher rule** is a bettor-friendly auto-protection nobody explains to newer bettors.
72. **The Wall Street ↔ sports betting cross-domain frame** (Peta + MV) is rare in public content. PPS can own this angle.

## Reading notes for future passes

Chapters skimmed but worth revisiting if PPS develops MLB-specific content:
- **Ch 9-13 (The Games Progress / First Quarter Results / etc.)** — month-by-month chronicle. Useful for "how a season unfolds for a betting model" narrative content.
- **Ch 17 (Pete's Tavern Revisited)** — social/cultural baseball + betting content. Light, brand-friendly.
- **Ch 25 (Hey, Dad, Wanna Have a Catch?)** — family/legacy framing. Useful for non-betting brand voice.
- **Ch 22 (A Winning End to the Season)** — full season results breakdown by category. Operational reference data.
- **Epilogue (A Summer in Vegas)** — Peta's later operational experience. Worth re-reading if PPS develops Vegas-specific content.

The Bill James / Voros McCracken / Tom Tango / Dave Studeman / Swartz & Seidman / Nate Silver citation chain is rich and worth direct primary-source acquisition for any future PPS research paper section on baseball analytics.

## Pedagogical patterns (summary for cross-book template tracking)

Distinct PPS-borrowable moves:
- **Open with a vivid name-bearing anecdote** ("Manny Sanguillén couldn't find his car keys")
- **Single-season narrative arc as book spine** (2011 MLB)
- **Worked numerical examples for every concept**
- **Operational reference tables that bettors can lift directly**
- **Cross-domain analogy as recurring device** (trading desk ↔ clubhouse ↔ poker)
- **Honest drawdown reporting**
- **List-based teaching for cross-cutting concepts** (Ch 19 "Focusing on the Wrong Data")

Voice/tone to *not* replicate:
- Wall Street autobiography drift
- Aging pop-culture references
- Math softening that obscures the underlying equations
- MLB-specific narrowness when PPS readers may not all bet baseball
