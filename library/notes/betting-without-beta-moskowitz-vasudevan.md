# Betting Without Beta — Tobias J. Moskowitz & Kaushik Vasudevan (Yale, May 2022)

> **Source type:** ACADEMIC PAPER (working paper / NBER Behavioral Finance meeting circulation). Not a book. Different synthesis shape.
>
> **Reading status:** ✅ First pass complete on abstract, introduction, conclusion, discussion, methodology overview, and key tables. The mathematical appendices (preference calibration, model implementation) are skipped for first pass; can be revisited if a specific paper section needs the formalism.

## Bibliography

- **Title:** Betting Without Beta
- **Authors:** Tobias J. Moskowitz, Kaushik Vasudevan
- **Affiliations:** Yale School of Management, Yale University. Moskowitz also NBER + AQR Capital Management.
- **Date:** May 2, 2022
- **Length:** 93 pages
- **Acknowledgments:** Nick Barberis, Thomas Bonczek, Ted O'Donoghue, Stefano Giglio, Jon Ingersoll, Ed Kaplan, Bryan Kelly, Ben Matthies, Rufus Peabody, Nils Rudi, Kevin Zhao; seminar participants at Yale and AQR; NBER Behavioral Finance meeting attendees.
- **Previous title:** *"What Can Betting Markets Tell Us About Investor Preferences and Beliefs? Implications for Low-Risk Anomalies."*
- **Significance for PPS Library:** ⭐ **THE academic primary source.** Where LOSB is industry-analytical and Funt is journalistic, Moskowitz/Vasudevan is peer-reviewable economic research. Yale + NBER + AQR institutional credentials, with citations to canonical behavioral-finance and sports-betting literature. **Single most important source for the Ban-or-Bankrupt research paper's credibility tier.**

## Thesis in one paragraph

The **Favorite-Longshot Bias (FLB)** — the empirical regularity that betting on underdogs (high-payoff/low-probability) earns systematically lower returns than betting on favorites (low-payoff/high-probability) — is **driven by bettor preferences for lottery-like payoffs**, NOT by erroneous beliefs about game outcomes. The authors prove this with a novel test: compare returns of **Moneyline contracts** (which vary risk by team strength) vs **Spread contracts** (which hold risk constant at ~50/50) on the *exact same games*. If FLB came from belief errors (bettors over-optimistic about underdogs), both contract types would show it. **The Moneyline shows strong FLB; the Spread shows none.** Risk preferences (lottery preferences) are the only attribute that differs across the two contract types. The same preference framework — **diminishing sensitivity + probability weighting** from Cumulative Prospect Theory (Tversky & Kahneman 1992) — explains both the FLB in sports betting *and* the well-known low-risk anomalies in stocks, options, and bonds. The paper offers a unifying behavioral explanation for both markets and a quantitative bridge between betting and finance.

## Key frameworks / named concepts

### 1. The Favorite-Longshot Bias (FLB) — CRITICAL
- **Definition:** Underdog bets earn systematically lower returns than favorite bets, on a risk-adjusted basis. First documented by **Griffith (1949)** in horse racing.
- **Why it matters:** Universal in many betting markets (basketball, football, horses). Conspicuously absent in MLB and NHL (Woodland & Woodland 1994, 2001; Gil & Levitt 2007) because outcomes there are closer to 50/50 — no extreme skewness to elicit the bias.
- **Pre-MV debate:** Was FLB caused by (a) bettors' incorrect beliefs (overoptimism about underdogs) or (b) bettors' preferences (love of lottery-like payoffs)?
- **MV's contribution:** Definitively resolves it. **Preferences, not beliefs.**

### 2. The Moneyline vs Spread Test — THE KEY INNOVATION
Two contract types on the *same game*:

| Contract | What it bets | Risk varies? | Use |
|---|---|---|---|
| **Moneyline (ML)** | Who wins outright | YES — risk scales with team-strength gap | Tests preference-based explanations |
| **Spread** | Whether favorite covers a specific point margin | NO — set to ~50/50 on both sides | Tests belief-based explanations |
| **Over/Under** | Total points | NO — set to ~50/50 | Auxiliary test |

The setup brilliantly isolates the variable. **Same game, same outcome, same teams, same fans, same sentiment, same media coverage. Only risk differs between contract types.** Any pricing pattern that shows in ML but NOT in Spread must be driven by risk-preference, because all other variables are identical.

### 3. The Core Empirical Finding
- **Sample:** 36,609 college and pro basketball + football games
- **Result on Moneyline:** Strong FLB. Underdogs earn far lower returns than favorites.
- **Result on Spread:** **No FLB.** Bettor beliefs about game outcomes are well-calibrated.
- **Implication:** Beliefs are NOT the source of FLB. **Lottery preferences are.**
- Robustness: Same pattern at opening and closing prices.

### 4. The Implied Volatility Smile (sports betting ↔ options)
Most striking parallel: MV constructs an **implied volatility surface for sports betting contracts** analogous to the famous **volatility smile in options markets**.
- Deep in/out-of-the-money options have higher implied volatility (the "smile")
- Sports betting contracts on extreme favorites and extreme underdogs also have higher implied volatility
- **Qualitatively AND quantitatively similar** to options
- Strong support that the same lottery-preference mechanism drives both

### 5. The Calibration Result
MV calibrate a model with **reference-dependent preferences** (Cumulative Prospect Theory) featuring:
- **Rank-dependent probability weighting** (Quiggin 1982; Tversky & Kahneman 1992)
- **Diminishing sensitivity** (gains/losses near reference point feel sharper than gains/losses far away)
- **Loss-aversion parameter λ** (set to 1 — no extra loss aversion)

**Key parameter finding:** Best fit at α ≈ γ ≈ 0.65, λ = 1. These parameter values are the same as those used to match low-risk anomalies in equities and options. **One preference model fits both markets.**

### 6. Probability Weighting Explained Plainly
The probability weighting function (Tversky & Kahneman 1992) means: **bettors overweight tail events** (rare wins on long-shot underdogs feel "more probable than they actually are"; near-certain favorite wins feel "less certain than they actually are"). This is what drives the lottery preference. **Underdog bets are mathematically irrational on EV terms but psychologically attractive because the rare-but-big-win possibility is overweighted in bettor utility.**

### 7. Diminishing Sensitivity Explained Plainly
Marginal utility of gains/losses decreases as you move further from your reference point (initial wealth). Translation: **the second $100 of winnings feels less special than the first $100**, but symmetrically **a second-$100 loss hurts less than the first-$100 loss**. This is why bettors will accept negative-EV bets on favorites: the small but high-probability gain feels disproportionately valuable, while the (rare) full loss isn't experienced as catastrophic. **A new insight to FLB research** — diminishing sensitivity hadn't been emphasized before MV.

### 8. Endogenous Betting Volume
A novel methodological move: MV's model **endogenizes the bettor's decision to bet AT ALL**, plus the amount wagered. Previous FLB literature took bet placement as given. Using unique data on betting volume per contract, MV show the calibrated model also explains observed volume variation. **Stronger test of the preferences hypothesis than prior work.**

### 9. The Sports Betting ↔ Finance Bridge — Unifying Behavioral Explanation
The paper's broader claim: **lottery preferences provide a unifying explanation** for low-risk anomalies in:
- Sports betting markets (this paper) — Favorite-Longshot Bias
- Equity markets — Black et al. 1972, Ang et al. 2006/2009, Frazzini & Pedersen 2014, Asness et al. 2020
- Options markets — Bondarenko 2014, Ni 2008, Boyer & Vorkink 2014, Frazzini & Pedersen 2022, Baele et al. 2016
- US Treasuries, corporate bonds, equity indices, commodities — Frazzini & Pedersen 2014

The cross-market connection makes betting research economically interesting beyond entertainment. **Sports betting becomes a clean experimental laboratory for testing behavioral-finance theories** — because outcomes are observable, idiosyncratic, and finite (per Thaler & Ziemba 1988).

### 10. Why Sports Betting is a Clean Research Setting
Thaler & Ziemba (1988) framing, embraced by MV:
- **Contingent claims** with well-defined termination points (game ends → bet resolved)
- **Idiosyncratic outcomes** (game results don't depend on bettor beliefs/preferences)
- **No systematic risk** (unlike stocks, where market beta confounds analysis)
- **High volume + market making + arbitrage + professional analysts** (institutional parallel to financial markets)

This is the methodological argument for *why* economists study sports betting — and *why* PPS's analysis can credibly draw from behavioral-finance literature.

## Strongest claims (with evidence)

| Claim | Evidence | Confidence |
|---|---|---|
| FLB is driven by preferences, not beliefs | 36,609-game ML vs Spread comparison shows FLB in ML, none in Spread | **Very high** — definitive empirical design |
| ML contracts exhibit implied volatility smile quantitatively similar to options markets | Section 4 IVF construction + Figure 5 | **Very high** — formal comparison |
| Risk-adjusted Moneyline returns match equity/options low-risk anomaly magnitudes | Figure 6, calibrated model results | **High** |
| Bettors are accurately calibrated about *expected* outcomes (Spread bets are unbiased) | Figure 2 binned scatterplot of O/U lines vs realized totals | **Very high** |
| Probability weighting (γ ≈ 0.65) + diminishing sensitivity (α ≈ 0.65) explains the data | Calibration MSE results, Table 5 | **High** — parametrically validated |
| Loss aversion (λ > 1) makes the model *worse*, not better | Figure C.1 comparison λ=1 vs λ=1.25 | **High** |
| Belief heterogeneity is a secondary factor (13-55% of point-spread SD) | Discussion section + appendix B | **Medium** — supplementary, not primary |
| Roughly 50% of US adults have made a sports bet (per Statista 2017 data) | Section 2 citing Statista | **Medium** — pre-PASPA reversal data, likely higher now |

## Examples / data points worth preserving for our paper

### Market-Size Numbers (Section 2)
- **Global sports betting GGR (2017): ~$200 billion**
- **US adult sports-betting participation > stock market participation** (Vissing-Jørgensen 2002)
- Pre-PASPA-reversal US legal: $4-5B annually (Nevada only); illegal ~30× that = $120-150B/year
- 1999 Gambling Impact Study estimated illegal range $80B-$380B/year vs $2.5B legal Nevada
- UK post-2005 legalization: annual betting growth ~7% (Hudson 2014)

### The 36,609-game dataset (Section 2)
Sample composition:
- NCAA Football
- NCAA Basketball
- NBA
- NFL

This is the dataset PPS can build derivative analysis on (or use as a benchmark for our own future quantitative work).

### Moneyline payoff formula (Section 2.1, equation 1)
For a $100 bet on team A over team B at Moneyline −M:
- Win: payoff = max(M, 100) + 100
- Tie: payoff = 100
- Lose: payoff = 0

Spread is structured as $110-to-win-$100 throughout (so a 50/50 contract pays out at -110 each side, exactly the standard sportsbook structure LOSB describes).

### The MLB/NHL exception (footnote 1)
**FLB is conspicuously absent in MLB and NHL betting**, because outcome probabilities are closer to 50/50 — no extreme skewness to trigger the lottery-preference effect. *Useful for the paper: explains why the same preference framework can produce different observable patterns across sports.*

## What's unique vs. other sources

- **The Moneyline vs Spread differencing methodology** is a novel empirical design that didn't exist in the FLB literature before MV.
- **The connection of sports betting to options-market implied volatility smile** is original — no prior paper had constructed an analogous surface for sports betting.
- **The endogenized bet-placement decision** with volume data — most prior FLB work took bet existence as given.
- **The diminishing-sensitivity emphasis** — most reference-dependent-preference applications focused on probability weighting alone; MV demonstrate diminishing sensitivity is necessary to explain both betting and finance.
- **The unifying behavioral explanation across betting + finance** — most prior work treated them separately.

## Weak claims / limitations / criticisms

- **The bridge to financial markets is "speculative"** (MV's own language). They acknowledge institutional differences between markets and rely on assumption that economic agents approach uncertainty similarly across contexts. Worth flagging in our citations.
- **Belief heterogeneity is dismissed as secondary but not zero.** Their estimates (13-55% SD of point-spread distribution) suggest some role for belief differences. The paper's case is that *preferences dominate*, not that beliefs are irrelevant.
- **Sample is NCAA Football, NCAA Basketball, NBA, NFL — no MLB, NHL, soccer, tennis, MMA.** Generalizability beyond these four sports is implied but not directly tested.
- **The bettors in the sample aren't profiled by sophistication.** No way to separate "average bettor preferences" from "sharp bettor preferences" within the data. MV implicitly model the *representative bettor*.
- **Pre-PASPA-reversal data.** Sample largely predates 2018's online-mobile-app revolution. Patterns may have shifted with app-driven dark patterns.
- **No accounting for sportsbook profiling/limiting.** MV treat contracts as freely tradeable at close prices; reality (per LOSB and Funt) is that profitable bettors face limits that distort their actual price exposure.

## Where we'd extend or disagree

- **Combine with Funt's data on the "ban or bankrupt" model.** MV's analysis assumes bettors can transact freely; in reality books limit. PPS can extend MV's preference framework to ask: *do limits accelerate the FLB?* If sharps (who would otherwise correct the underdog mispricing) get limited, then lottery preferences set the marginal price unopposed.
- **Combine with LOSB's market-maker/retail dichotomy.** MV's contracts come from sharp markets; retail-book contracts likely show even *more* extreme FLB because their customer pool skews more recreational.
- **Test the preference framework AT SPECIFIC OPERATORS.** MV use a cross-sportsbook closing-line dataset. PPS could examine whether FLB magnitudes differ at FanDuel/DraftKings vs Circa/South Point (which take sharper action). This is a *new* extension MV doesn't address.
- **Operationalize the implied volatility surface.** MV construct it as a research output. PPS could turn it into a tool: input a sportsbook's ML and Spread on a game → output the implied volatility / lottery-preference distortion. Bettors could use this to spot games where the lottery-bias inflates underdog prices most.
- **Disagree (gently) with the "preferences are dominant" framing.** MV are careful in the paper but the headline message might over-attribute. Belief heterogeneity, sportsbook profiling, and structural market microstructure all play roles. PPS's synthesis can stay rigorous about the preference finding while acknowledging the full picture.

## Reader pain points exposed

Academic papers don't have many direct "pain point" moments (they're impersonal). But the *implications* of MV's findings carry pain points for our audience:

### "I thought my underdog bet was just brave — it turns out it's a lottery ticket I'm mispricing"
The FLB literature shows betting on underdogs is *systematically* a worse deal than betting on favorites. Bettors who instinctively prefer the underdog feel "smart" or "contrarian" — they're actually paying a lottery premium. The pain point: discovering that the romantic underdog play is mathematically bad.

→ Use for: a lesson explaining why "I'll take the dog at +400" feels good but is structurally −EV beyond just the vig.

### "I love the long shot — it turns out economists have studied my exact bias"
Many bettors believe their long-odds preference is unique to them. MV name the bias (Favorite-Longshot Bias) and trace it to 1949. The pain point: discovering that your "personality" as a bettor is actually a well-studied cognitive pattern.

→ Use for: a lesson connecting reader behavior to behavioral economics research — gives the reader self-knowledge without judgment.

### "The same thing is happening to me in my stock portfolio"
MV's bridge means that bettors who over-prefer underdogs are likely also picking the wrong stocks (over-weighting growth-y / low-quality names with high lottery payoffs). One bias, two markets, both affecting your wealth. Powerful for a Path-03-aligned reader.

→ Use for: a "behavioral finance for sports bettors" piece. Distinctive content — connects two reader interests.

## Direct quotes (with section refs)

> "Sports betting markets offer a novel test distinguishing the roles of preferences and beliefs in asset prices." — Abstract

> "When cross-sectional differences in risk are removed, we find no difference in returns, highlighting that risk, and not any other characteristic of the game or teams, is the chief attribute driving the FLB." — Conclusion

> "Our finding that people demonstrate non-traditional preferences for bets with lottery-like features may therefore suggest that such preferences possibly relate to low-risk anomalies found in financial markets." — Introduction

> "Sports betting markets provide an attractive research laboratory because they are particularly well suited for studying decision-making under uncertainty." — Section 1 (paraphrasing Thaler & Ziemba 1988)

> "We observe an implied volatility smile that is qualitatively and quantitatively similar to the famous volatility smile in options markets." — Introduction

> "The potential importance of diminishing sensitivity to explain bettor behavior is a new insight for the FLB, and a novel economic setting where diminishing sensitivity (a relatively less studied component of reference-dependent preferences) may be applicable." — Introduction

## Citation goldmine (foundational sources the paper draws on)

This is the **citation list** PPS's Ban-or-Bankrupt paper can draw from. Each entry has a brief description of why we'd cite it:

### Sports betting / FLB foundational
- **Griffith (1949)** — Original empirical documentation of FLB in horse racing. *The* canonical first citation.
- **Thaler & Ziemba (1988)** — Sports betting as research lab for behavioral economics. Sets up the methodological argument.
- **Woodland & Woodland (1994, 2001)** — MLB no-FLB finding.
- **Gil & Levitt (2007)** — NHL no-FLB finding.
- **Snowberg & Wolfers (2010)** — Recent FLB work (informational efficiency interpretation; MV disagree with this).
- **Newall & Cortis (2021)** — Empirical review of FLB literature.

### Sports betting market microstructure
- **Zuber, Gandar, Bowers (1985)** — Foundational sports betting microstructure.
- **Sauer et al. (1988)**, Gandar et al. (1988, 1998), Camerer (1989), Brown & Sauer (1993), Golec & Tamarkin (1991), Gray & Gray (1997) — Informational efficiency of betting markets.
- **Levitt (2004)** — Bookmaker pricing strategy (often cited in line-setting discussions).
- **Pankoff (1968)** — Historical betting/finance connection.
- **Durham, Hertzel, Martin (2005)** — Modern betting/finance connection.
- **Moskowitz (2021)** — Earlier related work by the senior author on betting markets.
- **Peta (2014)** — *Trading Bases* (referred to in footnote 7). **A book on our potential acquisition list — Peta is a former Wall St analyst turned pro sports bettor.**

### Behavioral finance / low-risk anomalies
- **Black et al. (1972)** — Foundational paper on CAPM anomalies; the "Black 1972" of betting-against-beta literature.
- **Ang et al. (2006, 2009)** — Low-risk anomaly in equities.
- **Frazzini & Pedersen (2014)** — "Betting against beta" paper, name of the AQR strategy.
- **Frazzini & Pedersen (2022)** — Same authors on options low-risk anomaly.
- **Asness et al. (2020)** — Quality and low-risk.
- **Bondarenko (2014)**, Ni (2008), Boyer & Vorkink (2014), Baele et al. (2016) — Options low-risk anomaly.

### Behavioral / preference theory
- **Tversky & Kahneman (1992)** — Cumulative Prospect Theory. Foundational behavioral-economics reference.
- **Quiggin (1982)** — Rank-dependent probability weighting.
- **Prelec (1998)** — Alternative probability weighting function.
- **Kőszegi & Rabin (2007)** — Reference-dependent preferences.
- **O'Donoghue & Sprenger (2018)** — Review chapter on reference-dependent preferences.
- **Barberis & Huang (2008)**, Barberis, Huang & Santos (2001), Barberis, Mukherjee & Wang (2016), Barberis, Jin & Wang (2021) — Prospect theory and stock prices.
- **Brunnermeier, Gollier, Parker (2007)** — Skewed asset preferences.
- **Bernheim & Sprenger (2020)** — Experimental rank-dependence (with caveats).
- **Barseghyan et al. (2013)** — Non-identification of loss aversion and probability weighting.
- **Chiappori et al. (2019)** — Heterogeneous preferences.
- **Chapman et al. (2018)** — Loss tolerance in US population.
- **Conlisk (1993)** — Gambling preferences as domain-specific.

### Stock market participation
- **Vissing-Jørgensen (2002)** — Stock market participation rates (used as comparison to sports betting participation).
- **Dorn & Sengmueller (2009)**, Grinblatt & Keloharju (2009) — Entertainment motives in financial markets.
- **Giglio et al. (2021)** — Investor expectations surveys.

### UK betting context
- **Hudson (2014)** — UK online/mobile betting growth post-legalization.

### Older finance
- **Kliger & Levy (2009)** — Probability weighting in finance.
- **Jullien & Salanié (2000)** — Probability weighting in FLB.

**Net:** **40+ peer-reviewed citations** the Ban-or-Bankrupt paper can draw from. This is the bibliographic foundation we needed.

## Topic tags

For cross-referencing into `library/topics/`:

- `favorite-longshot-bias` — **new topic, primary** (MV is THE source)
- `behavioral-finance-and-sports-betting` — **new topic, primary**
- `cumulative-prospect-theory-applications` — **new topic, primary**
- `probability-weighting` — new topic
- `diminishing-sensitivity` — new topic
- `low-risk-anomalies-cross-market` — **new topic**
- `implied-volatility-and-betting` — **new topic** — novel concept worth its own page
- `pricing-inefficiencies` — secondary (MV is well-calibrated on Spread but not ML)
- `psychology-of-the-bettor` — secondary
- `expected-value-foundations` — light corroboration
- `market-efficiency-sports-betting` — secondary
- `historical-academic-foundations` — new topic for cataloging the Griffith / Thaler & Ziemba lineage

## Reading notes for future passes

**First-pass complete at the conceptual level.** Mathematical depth (calibration equations, model identification, optimality conditions) is in appendices B and C. Revisit when:
- Drafting the paper's behavioral-finance section (cite specific calibration values)
- Building an "Implied Volatility Calculator" tool (need the equation 5 setup)
- Writing a "How economists study sports betting" educational piece

The references list at the end of the paper is the primary remaining value extract — once we want to deepen the paper, we trace MV's citations to their primary sources.

## Pedagogical patterns

Academic-paper style, not trade-book — but several PPS-useful moves:

### Effective patterns
- **Question-driven introduction.** *"Are preferences or beliefs driving the FLB?"* — concrete, falsifiable, unresolved-in-the-literature framing. Reader knows what they're going to learn by the end. PPS can borrow: open content with a specific question that has a non-obvious answer.
- **Differencing as method.** The Moneyline-vs-Spread comparison is methodologically elegant. PPS can use the same logic in content: "compare two situations that differ in only one variable, and the variable that differs explains the outcome."
- **Cite-the-canonical-source-and-then-disagree.** MV explicitly take on Snowberg & Wolfers (2010) — modern leading FLB paper — and use evidence to overturn its conclusion. **Honest engagement with competing views**, including specifically calling out where they disagree and why. PPS can do this with industry consensus claims.
- **The "research laboratory" framing** (Thaler & Ziemba 1988, embraced by MV). Sports betting is a clean test setting for general economic theories. **Tells the reader why this matters beyond sports.** PPS can borrow: "the lesson here isn't just about betting — it's about how you think."
- **Quantitative bridge to a parallel domain.** MV connect FLB to options-market low-risk anomalies *quantitatively*. Reader gets the "your sports betting bias is the same bias that's losing you money in your 401k" insight with mathematical rigor. PPS can borrow: explicitly bridge from a familiar betting concept to an unfamiliar finance concept, showing the math is the same.

### What we'd avoid
- **Notational density.** MV's equations (1)-(C.1) are necessary for academic publication but would alienate PPS readers. We translate the substance; we don't reproduce the math.
- **Inline footnotes for everything.** Necessary in academic format; not necessary in PPS content. Use callouts or end-of-piece citation lists instead.

## Content opportunities this paper seeds

### Lessons (curriculum)
- **"Why your gut wants the underdog — and why your gut is wrong"** — Explains FLB in plain English using MV's findings. Could be a Path 01 lesson. **HIGH**.
- **"The bias you have in betting is the bias you have in stocks"** — Bridges MV's sports-betting-to-finance argument for a PPS audience. Distinctive content; very brand-aligned (taking math seriously). **HIGH**.
- **"What's a 'lottery preference'? (And why it costs you money)"** — Plain-English explanation of probability weighting. **HIGH**.
- **"Why the same bias doesn't show up in MLB or NHL betting"** — Quirky/distinctive lesson. Explains why FLB is sport-specific. **MEDIUM**.

### Guides (deep-dive pages)
- **"The Favorite-Longshot Bias: 75 years of research, in plain English"** — A long-form piece tracing Griffith 1949 → Thaler & Ziemba 1988 → Snowberg & Wolfers 2010 → MV 2022. Single best citation-anchored deep-dive PPS could ship. **HIGH**.
- **"Implied volatility in sports betting"** — Adapt MV's IVF surface to a public-facing explainer. Novel content — no other sportsbook content site explains this. **HIGH** — distinctive.
- **"Behavioral finance for sports bettors"** — Why bettors and equity investors make the same mistakes. **HIGH**.

### Tools / calculators
- **Implied Volatility Calculator** — Input game's ML and Spread → output the implied volatility / lottery-distortion factor. Original PPS tool. Would be the *only* such tool publicly available. **HIGH** value, **MEDIUM** to build.
- **"Are you a lottery-preference bettor?" Diagnostic** — Profile your last 20 bets, show your FLB tilt. Brand-aligned: self-knowledge tool. **MEDIUM**.
- **FLB Magnitude by Sport** — Visualization tool showing how the bias varies across NCAAF / NCAAB / NBA / NFL (and is absent in MLB/NHL). **SPECULATIVE** but distinctive.

### PPS Originals
- **"The Favorite-Longshot Bias paper, in plain English"** — A *Library*-style piece showing how PPS reads academic research to inform its content. Builds the brand as analytics shop. **HIGH** — reputation-building.
- **The Ban-or-Bankrupt Equilibrium paper** — Now properly grounded with MV as a peer-reviewed citation source. Bedrock for the paper's behavioral-finance section. **HIGH**.

## Market gaps this paper reveals

(In addition to the 25 gaps already identified across LOSB + Funt.)

26. **Academic research on sports betting is virtually unknown to bettors.** Most "betting strategy" content doesn't cite peer-reviewed research. Public bettors have no idea that economists have studied the FLB since 1949. **PPS can be the bridge.** Massive gap.

27. **The Moskowitz/Vasudevan paper itself is publicly visible but never explained for bettors.** The paper is on SSRN and circulating; a public-friendly explainer of its findings doesn't exist. **First-mover content opportunity.**

28. **No tool exists to compute implied volatility for sports betting contracts.** MV constructed the analysis as a research artifact; no consumer tool exposes it. **First-of-kind product opportunity.**

29. **The behavioral-finance ↔ sports-betting bridge is rare in public content.** Plenty of stock-market behavioral-bias content; plenty of sports-betting strategy content; almost nothing connecting them despite Moskowitz's explicit argument. PPS can own this angle.

30. **The "Why MLB and NHL don't show FLB" anomaly** is interesting and counter-intuitive. No public content explains it. Niche but distinctive.

31. **The Cumulative Prospect Theory framework applied to sports betting decisions** is academic but actionable. If we explain probability weighting (γ) and diminishing sensitivity (α) in plain English, bettors get a self-diagnosis tool for their own biases. Genuinely useful content.
