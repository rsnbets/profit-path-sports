# Mathletics — Wayne L. Winston (Princeton University Press, 2009; paperback w/ epilogue 2012)

> **Reading status:** ✅ First-pass complete on the PPS-relevant chapters. Deep read on Part IV gambling chapters (Ch 38-44), plus Ch 11 (Streakiness), Ch 35-36 (Game fixing / Donaghy), Ch 37 (End-game basketball strategy). Skim of Part I-III sport-specific chapters captured at concept level only. The bulk of the baseball/football/basketball stat chapters are for sport-analytics readers; the four chapters that anchor PPS use are Sports Gambling 101 (Ch 38), Freakonomics Meets the Bookmaker (Ch 39), Rating Sports Teams (Ch 40), From Point Ratings to Probabilities (Ch 43), and Optimal Money Management — Kelly (Ch 44).
>
> **Length:** ~390 pages, 51 chapters + epilogue.

## Bibliography

- **Title:** Mathletics: How Gamblers, Managers, and Sports Enthusiasts Use Mathematics in Baseball, Basketball, and Football
- **Author:** Wayne L. Winston
- **Affiliation:** Indiana University Kelley School of Business (Distinguished Professor of Decision and Information Sciences); also worked with Mark Cuban's Dallas Mavericks on analytics
- **Publisher:** Princeton University Press
- **First published:** 2009 (paperback w/ new epilogue 2012)
- **ISBN:** 978-0-691-15458-9 (paperback)
- **Voice:** Textbook-academic. Question-and-answer + Excel-worksheet style. Heavy use of normal-distribution formulas, Solver, Monte Carlo simulation. Frequently cites primary academic sources (Wolfers, Levitt, Albright, Stern, Sagarin) and Stanford Wong.
- **Significance for PPS Library:** ⭐ **The quantitative-foundations source.** Where MV is the *behavioral-finance* academic source, Mathletics is the *applied-statistics* source. Provides the *operational math* underneath every probabilistic claim PPS will make: normal-distribution game-outcome modeling, power ratings via least-squares fitting, probability-to-margin conversions, parlay/teaser/middle math, Kelly derivation, simulation-based playoff probability, statistical detection of game-fixing. **The single best reference for the math behind sports-betting intuitions.** Will be cited heavily in any quantitative PPS guide.

## Thesis in one paragraph

Sports outcomes — and the betting markets attached to them — can be modeled with elementary applied statistics that yield surprisingly accurate predictions and decision rules. Winston walks through the operational toolkit: power ratings fitted to game scores via Solver-minimized squared errors; the normal distribution as the working model for game-outcome margins (NFL σ≈13.86, NBA σ≈12, NCAA basketball σ≈10, CFB σ≈16); the conversion from point spreads to win probabilities via NORMDIST; Monte Carlo simulation for series and tournaments; the Kelly Criterion derived cleanly; and statistical tests (z-scores, binomial tests) for everything from streakiness to referee bias to alleged game-fixing. **Three load-bearing PPS findings:** (1) the spread-to-probability translation is well-defined and quantifiable; (2) "streakiness" and "hot hand" effects largely disappear under proper statistical testing — most apparent streaks are random; (3) Levitt (2004) proved bookmakers exploit bettor bias toward favorites to earn *more than* the standard 4.5% theoretical hold — bettors lose closer to 5-6% per dollar wagered because the public's favorite-bias inflates favorite spreads.

## Key frameworks / named concepts

### 1. The Normal-Distribution Model of Game Outcomes (Ch 43) — CRITICAL
The single most useful Mathletics framework for PPS work:

| Sport | Sigma (σ) — standard deviation of game outcomes about prediction |
|---|---|
| NFL | **13.86 points** (Stern 1991, *American Statistician*) |
| NBA | **12 points** (Sagarin) |
| NCAA basketball | **10 points** (Sagarin) |
| College football | **16 points** (Sagarin) |

**For any of these sports, the final margin of victory is a normal random variable with mean = (home edge + home team rating − away team rating) and σ as above.**

Source citations: Hal Stern, "On the Probability of Winning a Football Game," *American Statistician* 45, no. 3 (Aug 1991): 179-83. Sagarin's ratings at usatoday.com. **These σ values are the empirical foundation for every spread-to-probability translation PPS will publish.**

### 2. Spread → Probability Translation (Ch 43)
Using the normal model above:
- **P(home team covers spread S)** ≈ `1 - NORMDIST(S + 0.5, predicted margin, σ, TRUE)`
- **P(home team wins outright)** ≈ `1 - NORMDIST(0.5, predicted margin, σ, TRUE) + 0.5 × P(regulation tie)`
- **P(push)** ≈ `NORMDIST(S + 0.5, μ, σ, TRUE) − NORMDIST(S − 0.5, μ, σ, TRUE)`

Worked example (2007 Super Bowl, Colts -7):
- Power-rating predicted margin = 7
- P(Colts cover) = 1 − NORMDIST(3.5, 7, 13.86, TRUE) = **60%**
- P(push) = 2.8%
- After removing pushes: **61.7%** chance of covering

This is exactly the operational tool PPS needs to write content like "if your power rating disagrees with the line by X points, here's the implied edge."

### 3. The Levitt 2004 Bookmaker-Exploits-Bias Finding (Ch 39) — CRITICAL
- **Reference:** Steven Levitt (Freakonomics co-author), "Why Are Gambling Markets Organised So Differently from Financial Markets?" *Economic Journal* (2004).
- **Empirical sample:** 20,000 bettors during the 2001 NFL season; >50% of money bet on favorites in every category.
  - Home favorite: 56.1% of bets on favorite, 43.9% on dog
  - Visiting favorite: 68.2% on favorite, 31.8% on dog
- **Favorite-cover rates:**
  - Home favorites cover 49.1% of the time
  - Home underdogs cover 57.7%
  - Visiting favorites cover 47.8%
  - Visiting underdogs cover 50.4%
- **Historical confirmation (1980-2001):** 48.8% of home favorites and 46.7% of visiting favorites cover the spread.
- **Conclusion:** Bookmakers do NOT set lines to balance action 50/50. They set lines to exploit the bettor bias toward favorites — the favorite line is inflated, the favorite covers less than 50%, and the bookmaker earns more than the textbook 4.5% theoretical hold.
- **Levitt's data show actual bookie profit was ~6.16% per $10 bet** (vs. 5% if action were balanced) — a **23% increase in expected profit** from biased-line setting.

> 🔑 **This is direct empirical support for the Ban-or-Bankrupt framework:** bookmakers structurally exploit bettor preferences (NOT just hold the vig); the 4.5% "fair" theoretical hold is the *floor*, not the actual outcome. Combine with Sharper's "Bookies can charge -145 instead of -137 when their clientele is favorite-biased" and MV's lottery-preference (FLB) finding for a triangulated case.

### 4. Levitt-MV Bridge: Same Underlying Phenomenon, Different Methodologies
- **Levitt (2004):** Bookmakers exploit favorite-bias to earn excess profit. Mechanism: inflated favorite lines + asymmetric public preferences.
- **MV (2022):** FLB is driven by lottery preferences, not beliefs. Mechanism: bettors overweight rare big-win events from underdog bets.
- **At first glance these point in opposite directions** — Levitt says bettors love favorites; MV says bettors love underdogs (FLB).
- **Reconciliation:** Different markets, different bias directions. Football point-spread betting in Levitt's sample shows favorite-bias (squares pile in on big-name teams); Moneyline betting in MV's sample shows lottery-preference for big underdogs. **Both biases coexist in the same bettors at different decision points.** Squares overpay for *spread* bets on favorites AND *moneyline* bets on big dogs. Bookmakers can exploit both directions.
- **This is a PPS-original synthesis** — neither author makes the cross-reference. PPS can ship it.

### 5. The Kelly Criterion — Derivation, Implementation, Sensitivity (Ch 44)
**Setup:**
- WINMULT = profit per $1 won
- LOSEMULT = loss per $1 lost
- p = probability of winning
- For standard -110: WINMULT = 1, LOSEMULT = 1.1

**Derivation:** Maximize E[ln(final wealth)] = p × ln(1 + WINMULT × f) + (1−p) × ln(1 − LOSEMULT × f).

Setting derivative to zero yields:

```
f* = [p × WINMULT − (1−p) × LOSEMULT] / [WINMULT × LOSEMULT]
```

Simplifying: `f* = p / LOSEMULT − q / WINMULT` where q = 1−p.

**Worked operational table (60% winner at -110):**
- Optimal f = (0.6 − 0.4 × 1.1) / 1.1 = 0.1455 (**14.55% of bankroll**)
- Long-term growth: **1.18% per bet** on average

**Critical operational table from Ch 44:**

| Win % | Optimal f | Long-term growth/bet |
|---|---|---|
| 54% | 3.1% | 0.05% |
| 55% | 5.0% | 0.14% |
| 56% | 6.9% | 0.26% |
| 57% | 8.8% | 0.43% |
| 58% | 10.7% | 0.64% |
| 59% | 12.6% | 0.89% |
| 60% | 14.55% | 1.18% |
| 65% | 24.1% | 3.31% |
| 70% | 33.6% | 6.65% |

**Key insight (Figure 44.4):** If you can win 60% but bet 30%+ of bankroll per game, **your bankroll declines** in the long run despite the edge. The Kelly fraction is the precise upper bound; over-betting destroys edge.

This is *the* canonical Kelly reference for PPS to cite. Sharper provided the operational rule + epistemic caveats; Mathletics provides the clean derivation + the sensitivity table. **Pair the two sources for PPS's Kelly content.**

### 6. Power Rating Construction (Ch 40)
Step-by-step methodology to fit power ratings from a single season's scores:

1. Enter trial ratings (one cell per team), trial home edge
2. For each game: prediction = (home edge) + (home rating) − (away rating)
3. Compute forecast error per game (actual − predicted) and squared error
4. Use Excel **Solver** to minimize sum of squared errors, constraining average rating = 0
5. **Least-squares output** = power rating, with home-edge embedded

**Variants:**
- **Mean absolute errors** (less weight on outlier games) — different ranking, less reactive to blowouts
- **Offense/defense decomposition** for totals predictions: instead of one rating per team, fit one for offense and one for defense

**Empirical sport-by-sport home edges** (per Mathletics, ~last 10 years pre-2009):
- NFL: 3 points
- NBA: 3 points (sometimes 3.21 per fit)
- College football: 3 points
- NCAA men's basketball: 4 points

**Cross-reference:** Pokerjoe's Sharper Ch 25 uses HFA = 2.0 for NFL in 2021. *The empirical NFL home edge has compressed from ~3 (2009) to ~2 (2021).* Worth noting as a market-evolution data point.

### 7. Streakiness Doesn't Exist (Ch 11) — CRITICAL PPS CONTENT
This is a deeply PPS-relevant chapter that almost no consumer betting content covers correctly.

**Setup:** Generate three random 162-game sequences with p(win)=0.6. They look "streaky" to the human eye — long winning streaks of 10, 9, 7, 6 games occur in the random data. *Apparent streakiness in observed team performance is mostly random.*

**Hot-hand test (basketball shooting):** S. C. Albright applied a z-score test to MLB hit/out sequences. Initial pass: average z-score = 0.256, z = 5.68 → significant evidence of streakiness. But: **after controlling for pitcher handedness, ERA, home/away, surface, the streakiness signal disappears.** Players who exhibited streakiness one year were NOT more likely than random to be streaky the next year.

**Hot-team test (2002-3 NBA):** Built point-spread-adjusted W/L sequences for each team (W = beat the predicted margin; L = lost to it). Applied Wald-Wolfowitz Runs Test. Only Portland's z-score exceeded 2 (and with 29 teams, you'd expect 1.45 such teams by chance). **Average z across all 29 teams: 0.197, not statistically significant.**

**Punchline:** "We conclude that the variation in team performance during the 2002-3 NBA season is well explained by random variation. This small study gives no support to the view that teams have momentum or encounter more hot streaks than would be indicated in a random sequence."

> 🔑 **Mass-market bettors widely believe in momentum and "hot teams."** Mathletics provides peer-reviewed quantitative debunking that PPS can cite. Massive content opportunity.

### 8. The Donaghy NBA Fixing Detection (Ch 36)
A textbook applied-statistics case study. PPS angle: this is how rigorous statistical thinking *should* be applied to integrity claims (vs. the loose anecdotal handling Funt notes).

**Method:**
1. For each NBA game, compute expected free throw attempts using team offensive/defensive tendencies + referee effects
2. Define "delta free throws" = actual − expected
3. In Donaghy's games where the Total Line moved 2+ points (potential fix signal), did the delta free throws differ?
4. Result: 16.39 mean delta FTs/game in suspected fix games vs. 7.32 in his other games
5. Discrepancy z-score = 9.07 / 3.72 = 2.44, p = 0.005 → **1 in 200 probability under null hypothesis**

**The conclusion:** "This analysis conclusively indicates that in games Donaghy officiated and the Total Line increased by at least two points, significantly more free throws were attempted than were attempted in other games in which Donaghy officiated." This is the math an integrity-monitoring system *should* run.

**Also key (Ch 35):** Justin Wolfers's "5% of college basketball games are fixed" claim (point shaving) was rebutted by Heston & Bernhardt (HB), who showed the same asymmetry exists in non-betting games. **Apparent statistical evidence of fixing can come from structural game dynamics (favorite holds the ball, key players foul out) rather than corruption.** A useful note for the PPS research paper when discussing integrity narratives — be careful about anomaly-attribution.

### 9. Parlay & Teaser Math (Ch 38) — Cross-validates LOSB + Sharper
**Parlays** (independent bets):

| # Bets | Actual Odds | Typical Payout | House Edge |
|---|---|---|---|
| 2 | 3-1 | 2.6-1 | 10% |
| 3 | 7-1 | 6-1 | 12.5% |
| 4 | 15-1 | 12-1 | 18.75% |
| 5 | 31-1 | 25-1 | 18.75% |
| 6 | 63-1 | 35-1 | 43.75% |

**Correlated parlays:** Winston explicitly references the side+total correlation example. Confirms LOSB+Sharper: most bookies don't book obvious correlated parlays now.

**Teasers** (from Stanford Wong's *Sharp Sports Betting* — Mathletics cites Wong directly as source for the teaser payout table):
- 7-point teaser pushed 1.5%, won 70.6%, lost 27.9% over 2000-2005
- Two-team 7-point teaser at -130: 49.8% win × 100 + 4.4% push + 45.8% loss × −130 = **−$9.70 expected per $100 bet**
- **Cross-reference:** Mathletics, Sharper, and LOSB all converge on the same conclusion: teasers are EV-negative for the bettor *except* in narrow Wong-teaser conditions (crossing both the 3 and the 7 in NFL).

### 10. Sports as Statistical Test Bench (Ch 39, 36, 35, 11)
**Cross-citation with MV:** Both Mathletics and MV embrace Thaler & Ziemba's "sports betting is a research laboratory" framing. Mathletics demonstrates it in practice across:
- Streakiness (Ch 11) — debunking
- Referee bias (Ch 34, 39) — quantifying
- Game fixing detection (Ch 35, 36) — testing
- Pricing inefficiencies (Ch 39) — Levitt's bookmaker analysis
- Power-rating accuracy (Ch 40, 43) — predictive validation

PPS can borrow this framing: "Sports betting is one of the cleanest natural experiments in applied statistics. The data is observable, outcomes are unambiguous, and the markets have well-defined endpoints. Most behavioral biases and statistical patterns generalize." Already partially deployed (MV note); Mathletics gives PPS the operational examples.

### 11. Monte Carlo Simulation for Playoff Series & Tournaments (Ch 43)
**Method:** Use Excel's NORMINV(RAND(), mean, σ) to simulate each game; play out series 1,000-50,000 times; count winner frequencies. Apply to:
- NBA 7-game series (Spurs vs Cavs example: 82% Spurs)
- NCAA tournament bracket (Sagarin ratings → tournament simulation; sample 2007 estimated North Carolina at 18%, Ohio State 15%, Florida 11%)

**PPS extension:** Both useful as in-house tools. Build a "Series Win Probability" calculator (input: ratings + home edges + format) and a "Tournament Bracket Probability" tool. Bracket simulator alone could be a March Madness traffic driver.

### 12. Sports Collapses Probability Analysis (Ch 45)
**Method:** Compute the probability of named "great collapses" under reasonable assumptions:
- 2007 Mets blowing 7-game lead: 1.2%
- 1964 Phillies: 1.8%
- 1951 Dodgers (Giants comeback): 0.25%
- Lakers down 15 with 10:28 left vs Trail Blazers (2000): ~0.4%
- Maryland blowing 10-point lead to Duke (2001): the lowest probability ("greatest" collapse statistically)

PPS angle: this *type* of analysis — assigning probabilities to seemingly impossible comebacks — is content gold. It demystifies "miracle" outcomes and reinforces that variance produces extreme events at predictable rates.

## Strongest claims (with evidence)

| Claim | Evidence | Confidence |
|---|---|---|
| NFL final margin ~ Normal(predicted, σ=13.86) | Stern 1991, *American Statistician* peer-reviewed | **Very high** |
| NBA σ ≈ 12, NCAAB σ ≈ 10, CFB σ ≈ 16 | Sagarin historical fitting | **High** |
| Home edges: NFL/NBA/CFB ≈ 3, NCAAB ≈ 4 (2009-era) | Decade-level empirical | **High** — but compressed by 2021 |
| Bookmakers exploit favorite-bias for excess profit | Levitt 2004 with 20,000-bettor sample | **Very high** — peer-reviewed |
| Favorites cover < 50% (1980-2001 NFL) | Levitt's historical sample | **Very high** |
| Streakiness mostly doesn't exist; "hot streaks" are random | Albright + Winston's own NBA z-score analysis | **High** |
| Donaghy called significantly more fouls in games where total line moved | p = 0.005 z-test | **High** |
| Kelly criterion derivation + sensitivity table | First-principles math | **Very high** — mathematical certainty |
| Heston-Bernhardt rebut Wolfers point-shaving claim | Same asymmetry in non-betting games | **Medium-high** — academic dispute, both peer-reviewed |
| 7-point teaser covered 70.6% of legs (2000-2005) | Citing Stanford Wong's *Sharp Sports Betting* | **High** |

## Examples / data points worth preserving

### Operational parameters (foundational for any PPS calculator)
- **NFL margin σ = 13.86** (Stern 1991, *American Statistician*)
- **NBA margin σ = 12** (Sagarin)
- **NCAAB margin σ = 10** (Sagarin)
- **CFB margin σ = 16** (Sagarin)
- **NFL home edge (2009-era)** = 3.0 points
- **NBA home edge (2009-era)** = 3.0 points (sometimes 3.21 in fits)
- **NCAAB home edge** = 4.0 points
- **MLB starting-pitcher dominance** = makes baseball line valid only conditional on listed pitchers; otherwise line voided

### NFL betting historical
- 1980-2001: **home favorites cover 48.8%; visiting favorites cover 46.7%** — bet on home dogs, you would have made money.
- 1980-2001 segment by spread size: favorites covered 48.5% (>6pts), 48.1% (3.5-6), 47.8% (<3) — bias is roughly constant across spread sizes.
- Bettor allocation (2001 sample, n=20,000): 56.1% on home favorites, 68.2% on road favorites.

### NBA referee performance (2003-2008) — Total Line over/under
- Jim Clark: 221 over / 155 under (58.8% over, z = +3.40)
- Pat Fraher: 177/131 (57.5% over, z = +2.62)
- Ron Olesiak: 136/203 (40.1% over, z = **−3.64**)
- Kevin Fehr: 127/181 (41.2% over, z = **−3.08**)
- These signals are real but **don't translate into profit** when used as a betting system (52.4% hit rate, below the 52.4% break-even).

### Teaser payoff data (from Wong via Mathletics)
| # Teams | 6-pt teaser | 6.5-pt teaser | 7-pt teaser |
|---|---|---|---|
| 2 | +110 | +120 | +130 |
| 3 | +180 | +160 | +150 |
| 4 | +300 | +250 | +200 |
| 5 | +450 | +400 | +350 |
| 6 | +700 | +600 | +500 |

### Levitt-era NFL bookie profit
- 50/50 balanced action: 4.5% theoretical hold (the textbook number)
- 2001 actual: 6.16% per $10 bet (~23% higher) — **the actual hold is meaningfully above 4.5% when bookies exploit favorite-bias.**

## What's unique vs. other sources

- **Operational σ values** for every major US sport — no other source in our library provides these.
- **The Levitt 2004 dataset** — pre-PASPA-reversal NFL bettor records. Used by MV indirectly (Levitt is cited in MV's bibliography); Mathletics walks through the analysis chapter-length.
- **Power-rating Solver methodology** — clean, replicable, season-by-season. Sharper describes ratings conceptually; Mathletics gives the Excel walkthrough.
- **Normal-distribution spread-to-probability translation formulas** — direct operational use; not present anywhere else in the library at this level of operational detail.
- **Empirical evidence against streakiness** — directly debunks the "hot team" narrative that mass-market betting content trades on.
- **Statistical-detection-of-fixing methodology** — Donaghy + Wolfers/HB cases. PPS can cite these for the Ban-or-Bankrupt paper's integrity section.
- **Sports collapses probability analysis** — quirky but viral-friendly content seed.
- **Monte Carlo simulation walkthrough** — operational for series/tournament probability calculation.
- **Kelly derivation + sensitivity table** — the most rigorous Kelly treatment in our library; pair with Sharper's epistemic caveats for full operational picture.

## Weak claims / limitations / criticisms

- **Pre-mobile-app, pre-PASPA-reversal data.** Levitt's 2001 sample is structurally different from 2024+ markets (DraftKings/FanDuel mass-mobile). The favorite-bias finding may have shifted (in either direction — more recreational bettors arguably amplifies the effect; sharper apps may dampen it). **Worth flagging as a "ripe for replication" candidate.**
- **σ values are 2009-era empirical fits.** Worth re-validating periodically. Sharper notes HFA has compressed to ~2.0 by 2021 in NFL — the σ values may have similarly drifted.
- **Voice is academic-textbook.** Heavy on Excel formula listings. Some of the operational content is buried in figure-references that require the source spreadsheets to fully reproduce. Less digestible than Sharper's voice.
- **The basketball/baseball/football-specific chapters** are mostly outside PPS scope; the book's gambling content is concentrated in Part IV (Ch 38-47) + a few scattered chapters (11, 35, 36).
- **No explicit engagement with addiction / harm content** — straight applied statistics, no Funt-style social commentary. Different lens, complementary.
- **No engagement with limiting/profiling** — Mathletics treats the bettor as a free-agent operator; the LOSB/Funt/Sharper reality (you can't actually bet your Kelly stake at most retail books) is implicit but never named.
- **The Wolfers/HB college basketball point-shaving exchange** is fairly cited but the resolution feels under-developed. The "is fixing happening?" question is left somewhat open.
- **Bibliography is rich** but pre-2009. Newer behavioral-finance work (MV 2022, post-PASPA literature) is necessarily absent.

## Where we'd extend or disagree

- **Cross-validate σ values for the modern era.** The NFL σ=13.86 is from 1991. NBA σ=12 is Sagarin's decade-aggregate ~2009. **PPS extension: re-fit these on 2020-2024 data** as part of a "How accurate are point spreads, really?" piece. Probably blog-grade research with real value to bettors.
- **Levitt + MV synthesis (the favorite/dog bias bridge).** Levitt found favorite-bias in 2001 NFL point-spread betting. MV found longshot-preference (FLB) in NCAAB / NCAAF / NBA / NFL moneyline betting. **These are not contradictory — they're complementary biases at different decision points.** Squares overpay favorites *and* underdogs at different moments. This is **PPS-original synthesis content**; no source we have makes the bridge.
- **Mathletics + Sharper Kelly synthesis.** Mathletics gives the clean math + sensitivity table; Sharper provides operational humility (fractional Kelly, big-favorite penalty, BR-as-emotion). Pair them in PPS Kelly content for full picture.
- **Power-rating Solver methodology + Sharper's three-pronged approach.** Mathletics's player + performance + market rating taxonomy (Sharper) maps onto Mathletics's regression/Solver method (Mathletics) — Sharper's "type 2" is a Mathletics-style regression. PPS can show readers the bridge.
- **The Levitt finding implies retail-book hold is structurally higher than the headline 4.5%.** Combine with LOSB's hold-chopping content + Funt's Amy Howe quote (FanDuel pushing hold from 12% → 16%): the *theoretical* hold and the *actual* hold can diverge by significant amounts when books exploit bettor preferences. **Direct implication for the Hold Chopper and Sportsbook Tier-Map tools.**
- **Streakiness debunking → content for the "Don't chase hot teams" lesson.** Pair with Sharper's "System unattached to ratings collapses" critique (NFL turnover system case) for a powerful "Why your hot-streak system isn't real" piece.

## Reader pain points exposed

Mathletics is voice-neutral / non-emotional, so pain points are inferred from the *implications* of its findings:

### "I keep betting favorites because they 'should' win — and I keep losing"
Levitt's data: favorites cover <50%. The math says the favorite line is inflated to extract your bias. You've been paying a "favorite premium" you didn't know existed.
→ Use for: a lesson on favorite-bias with the Levitt + MV combined framing. Path 01 staple candidate.

### "I follow hot teams and they keep losing the next game"
Streakiness research: most streaks are random. "Hot" is a backwards-looking label, not a forward-looking predictor.
→ Use for: a lesson on "Why your gut tells you to bet the hot team — and why it's wrong."

### "I want to use Kelly but the math intimidates me"
Mathletics provides the clean derivation + a sensitivity table. PPS can publish a one-page Kelly explainer using only the table (no derivation needed for the reader).
→ Use for: a beginner Kelly guide with operational table.

### "I bet 25% of my bankroll on a 'lock' and went broke — but I had an edge!"
Figure 44.4: at 60% winners, betting 30%+ of bankroll *destroys* your bankroll despite the edge. Over-betting kills.
→ Use for: a Kelly-overcommitment cautionary lesson.

### "Refs seem to call lots of fouls when [team] plays — is it real or am I imagining it?"
Yes, real (z = 3+ for some officials over multi-year samples). But: it doesn't translate to profitable betting because the Total Line incorporates the signal.
→ Use for: a more advanced "What's signal vs. tradable signal" piece — a nuanced point bettors rarely encounter.

### "I'm using a power rating from ESPN/FPI to bet — is that enough?"
Mathletics shows how to construct power ratings + their predictive validity. Pair with Sharper's three-pronged approach (player + performance + market) and the insight that public ratings are quickly absorbed by the market.
→ Use for: a content piece on "How to use public power ratings without losing the edge they encode."

## Direct quotes (paraphrase + cite, never reproduce verbatim)

Mathletics is heavily academic in its prose, so direct-quoting is less impactful than for trade books. Notable phrasings to paraphrase:

- The Levitt result framed: "Bookmakers do not set lines to balance action — they set lines to exploit bettor biases toward favorites, earning more than the standard 4.5% theoretical hold." (Ch 39, paraphrased)
- On streakiness: "We conclude that the variation in team performance during the 2002-3 NBA season is well explained by random variation. This small study gives no support to the view that teams have momentum." (Ch 11)
- On hot-hand: Albright found that after controlling for pitcher handedness, ERA, surface, and venue, streakiness evidence disappears; players streaky one year are no more likely to be streaky the next. (Ch 11)
- On betting break-even: "To win money on average we must beat the point spread at least 52.4% of the time." (Ch 38) — multi-source consensus.
- On Kelly: "If we bet 30% or more of our money on each game, in the long run our capital will decline even though we win 60% of our bets." (Ch 44, Figure 44.4)
- On game-fixing detection: "This analysis conclusively indicates that in games Donaghy officiated and the Total Line increased by at least two points, significantly more free throws were attempted." (Ch 36)
- On point-shaving claims: "The pervasive asymmetry in forecast errors must be a feature inherent in the way basketball is played." — Heston & Bernhardt's rebuttal of Wolfers (Ch 35)

## What this source unlocks (cross-pollination)

- **The σ values** unlock every spread-to-probability calculator PPS will ever build. Foundational.
- **The Levitt 2004 finding** — direct quantitative support for Ban-or-Bankrupt + Funt's industry-critique narrative.
- **Kelly derivation + sensitivity** — paired with Sharper, gives PPS a complete Kelly content package.
- **Streakiness debunking** — content for "Don't chase hot teams"; Path-01 staple.
- **Power-rating Solver methodology** — foundational for any PPS handicapping content.
- **Monte Carlo template** — basis for series-win calculator + bracket simulator.
- **Donaghy / Wolfers detection methodology** — foundation for the Ban-or-Bankrupt paper's integrity section.
- **Citations to Stanford Wong's *Sharp Sports Betting*** — confirms Wong is in our library queue and gives advance preview of his teaser data.

## Topic tags

For cross-referencing into `library/topics/`:

- `spread-to-probability` — **new topic, primary** (Mathletics is THE source)
- `normal-distribution-game-outcomes` — **new topic, primary**
- `power-ratings` — primary (LOSB/Sharper conceptual, Mathletics operational)
- `kelly-criterion-and-sizing` — primary (Mathletics derivation; Sharper operational humility)
- `monte-carlo-simulation-betting` — **new topic, primary**
- `streakiness-and-hot-hand` — **new topic, primary** (Mathletics is THE source)
- `levitt-2004-bookmaker-exploits-bias` — **new topic, primary**
- `favorite-bias-vs-longshot-bias` — **new topic** (Mathletics+MV synthesis)
- `game-fixing-detection` — **new topic** (Donaghy + Wolfers/HB)
- `referee-bias` — **new topic** (Mathletics empirical)
- `parlays-and-sgps` — secondary (cross-validates LOSB+Sharper)
- `teasers` — secondary (Wong data via Mathletics)
- `home-field-advantage` — **new topic** (empirical decade-level values)
- `historical-academic-foundations` — secondary (Stern 1991, Levitt 2004, Albright, Wolfers)
- `expected-value-foundations` — secondary
- `psychology-of-the-bettor` — secondary (favorite-bias as the Levitt empirical finding)
- `industry-fragility` — secondary (Levitt's actual-vs-theoretical hold)
- `pricing-inefficiencies` — secondary (Levitt; ref bias)
- `closing-line-value` — secondary (no new material vs LOSB+Sharper)

## Pedagogical patterns

Distinct PPS-borrowable moves from Mathletics:

### Effective patterns
- **Question-and-answer chapter structure** (Ch 38, Ch 43). Each section is "What is X?" → answer. Reduces cognitive load; reader knows what they're about to learn. **PPS can borrow:** structure lesson pages as Q&A blocks rather than narrative paragraphs.
- **Worked numerical examples with intermediate steps.** Every formula has a concrete walkthrough. No opaque math. **PPS already does this in tool copy; Mathletics validates the approach.**
- **Sensitivity tables.** The Kelly table (Figure 44.1) showing win-% → optimal-f → growth-rate is a perfect "look up your situation" reference. **PPS should ship more of these.** Calculator outputs are interactive sensitivity tables — extend by showing the full table for the literate reader.
- **Citing primary academic sources by name + paper title.** Stern 1991, Levitt 2004, Albright, Wolfers, Heston-Bernhardt. **PPS can borrow:** when citing research, name the author + paper + year clearly. Adds credibility and lets motivated readers verify.
- **Statistical-significance discipline.** Every interesting empirical claim gets a z-score / p-value. **PPS can borrow:** when we ship a counter-intuitive claim, attach a confidence interval or significance test (or honest "small sample" caveat) rather than rhetorical assertion.
- **Excel-friendly formulas.** All Mathletics math is implementable in Excel. **PPS can borrow:** keep our calculators' underlying math implementable by a motivated reader. Show your work.
- **"Greatest collapses" framing** (Ch 45). Take a list of cultural touchstones (famous comebacks), quantify them, rank them. **PPS can borrow:** turn cultural sports narratives into quantitative content. Ranking famous comebacks by probability is a viral-quality piece on its own.

### What we'd avoid
- **Heavy academic phrasing** ("we conclude," "we therefore" — works in textbooks, feels stilted on a betting site).
- **Inline Excel formula references** without context. Mathletics frequently writes `=NORMDIST(0.5,7,13.86,TRUE)` in body text. PPS uses inline formulas only when the reader is expected to copy them; otherwise we describe what the formula does.
- **Sport-specific deep dives** that aren't betting-relevant. The platoon effect, the Pythagorean theorem of baseball, the runs-created approach — interesting but outside scope for most PPS readers. We may pull them later for niche pieces.
- **Pre-2009 cultural / data references** that have aged. The 2007 Mets, 2007 Spurs, 2001 NFL — all useful as case studies, but presented as "current" in 2009-2012 voice. PPS should use modern equivalents when reproducing the analyses.

## Content opportunities this book seeds

### Lessons (curriculum)
- **"Why your favorite is statistically worse than you think"** — Levitt 2004 data + plain-English. **HIGH** — Path 01 staple.
- **"The math of point spreads → probabilities"** — how an NFL line of -7 turns into ~70% implied probability via Normal(13.86). Operational, Path-02 candidate. **HIGH**.
- **"Why hot teams aren't really hot"** — Mathletics streakiness chapter in plain English. Counter-conventional. **HIGH**.
- **"How much should you bet? Kelly without the math"** — sensitivity table only; reader looks up their situation. **HIGH**.
- **"Power ratings 101: what they are and how to use them"** — pair Mathletics methodology with Sharper's three-pronged approach. **MEDIUM-HIGH**.
- **"Sharps don't always cover: the favorite-bias trap"** — counter-intuitive case for fading favorites at certain spread sizes. **MEDIUM**.
- **"Statistical anomaly vs. profitable edge"** — refs call more fouls but you can't bet it profitably. Sophistication signal. **MEDIUM**.

### Guides (deep-dive pages)
- **"The math behind the spread: a complete guide to probability translation"** — flagship math reference page. Includes σ values for every sport, normal-distribution formulas, worked examples, calculator embed. **HIGH** — pillar content.
- **"Kelly Criterion: derivation, sensitivity table, and the big-favorite penalty"** — full Kelly guide combining Mathletics rigor + Sharper humility. **HIGH**.
- **"How sports betting markets exploit your biases — the Levitt finding"** — the 2004 paper in plain English, with implications. **HIGH** — research-grade.
- **"Streakiness, hot hands, and momentum: what the math actually says"** — Mathletics chapter 11 expanded for bettors. **HIGH**.
- **"How NBA refs affect totals (and why you can't profit from it)"** — combines Ch 39 ref data + a careful "signal vs profit" treatment. **MEDIUM**.
- **"Did Tim Donaghy actually fix games? The statistics."** — case study in applied integrity statistics. **MEDIUM** — research-grade adjacent.
- **"Are college basketball games fixed? The Wolfers vs Heston-Bernhardt debate"** — academic-style integrity piece. **MEDIUM**.

### Tools / calculators
- **Spread-to-Probability Calculator** — Input spread + sport, output P(cover) and P(win). Foundational operational tool. **HIGH** value, **LOW** build cost (σ values + NORMDIST).
- **Power-Rating Difference → Implied Spread tool** — input two team ratings + home/away, output implied spread + line edge if user provides actual line. **HIGH** value, **LOW** build.
- **Kelly Sensitivity Lookup tool** — interactive version of Figure 44.1; user inputs win%, sees recommended Kelly fraction + long-term growth rate. **HIGH** value, **LOW** build.
- **Monte Carlo Series Win Probability** — input series format (Best of 3/5/7), home/away schedule, ratings → output series win probability. **MEDIUM-HIGH** value, **MEDIUM** build.
- **NCAA Bracket Simulator** — Sagarin ratings + bracket → tournament win probabilities per team. **HIGH** value (March Madness traffic), **HIGH** build cost.
- **Streakiness Detector** — input a sequence of W/L outcomes, output z-score + interpretation. Educational / brand-builder. **MEDIUM** value, **LOW** build.
- **Power-Rating Builder** — paste in season scores, output team ratings via least-squares fit. **MEDIUM** value, **MEDIUM** build cost.

### PPS Originals
- **The Favorite-Bias vs Longshot-Bias Bridge** (Levitt + MV) — PPS-original synthesis showing both biases coexist in the same bettors at different decision points. **HIGH** — reputation-builder, no public source makes this connection.
- **The Hold Chopper Mark II: theoretical hold vs. actual hold** — Mathletics's Levitt result implies actual hold is meaningfully higher than the headline 4.5%. Pair with the existing Hold Chopper concept for a sharper tool. **MEDIUM-HIGH**.
- **"Sports Collapses, Ranked by Probability"** — viral-friendly piece. Mathletics gives the method; PPS can extend with modern examples. **MEDIUM** — entertaining and shareable.

## Market gaps this book reveals

(In addition to the 42 already identified.)

43. **The Levitt 2004 finding (favorites cover <50%, bookies earn 6%+ not 4.5%) is virtually unknown to retail bettors.** Sharper material that should be public, isn't. PPS can be the bridge.
44. **Spread-to-probability translation is rarely explained operationally.** Public content quotes "the line implies X%" without the math. Mathletics provides the math; PPS can publish it.
45. **The σ values for each sport are foundational reference material that's invisible.** Sportsbooks know them; bettors typically don't.
46. **The peer-reviewed evidence against streakiness / "hot hand" is invisible to mass-market bettors.** Most content trades on momentum narratives.
47. **No good public Kelly sensitivity lookup tool.** Mathletics gives the table; PPS can build the interactive version.
48. **The Levitt finding × MV finding bridge (favorite-bias vs longshot-bias coexist)** is novel synthesis — no public source makes the connection.
49. **"Statistical signal ≠ tradable signal"** is a sophistication concept rarely surfaced in public content. Ref-bias data is real; bettors can't profit from it.
50. **The Wolfers/HB college-basketball point-shaving exchange** is academic-only; bettors deserve an accessible summary.

## Reading notes for future passes

**First pass focused on Part IV (betting) + scattered relevant chapters.** The sport-specific deep dives (sabermetrics, NBA player rating, NFL fourth-down analysis) are skippable for PPS purposes but contain individual gems if we later build sport-specific content:
- **Ch 21-22 (Football decision-making)** — Romer's fourth-down analysis (NFL teams should rarely punt) — useful for in-play / late-game lesson content.
- **Ch 23 (Run vs Pass mix)** — football game theory; useful for prop / in-play content.
- **Ch 26 (NFL OT system)** — fairness in overtime structures; useful for prop content.
- **Ch 27 (Draft pick valuation)** — Jimmy Johnson Draft Value Chart; potential niche content.
- **Ch 30 (Adjusted +/- player ratings)** — APM, used heavily in NBA analytics; potential niche.
- **Ch 31-32 (NBA lineup analysis, matchup analysis)** — useful for NBA prop / matchup content later.
- **Ch 49 (BCS)** — dated but the methodology generalizes to playoff selection critiques.

**The 2012 paperback epilogue** (Ch ~50-end) extends the analysis and may have updated σ values; worth a quick read-through later.

## Pedagogical patterns (summary for cross-book template tracking)

Distinct PPS-borrowable moves:
- **Question-and-answer chapter structure** — Q-first, A-second
- **Worked numerical examples** for every framework
- **Sensitivity tables** as reference content
- **Primary-source academic citations** (author + paper + year)
- **Statistical-significance discipline** (z-scores, p-values, sample sizes)
- **Excel-implementable math** (transparency over opacity)
- **Cultural-touchstone-as-quantitative-content** (e.g., great-collapses analysis)

Voice/tone to *not* replicate:
- Heavy academic phrasing
- Inline raw formulas in narrative
- Sport-specific deep dives without betting tie-in
- Pre-2010 cultural references presented as current
