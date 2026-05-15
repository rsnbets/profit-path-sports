# PPS Library — Master Index

The living document that synthesizes everything PROFITPATH knows about modern sports betting. **Updated every time a book is read.** This file is the single entry point — start here.

> **Purpose:** Capture the state of the field across every credible source, identify gaps and conflicts in public knowledge, and surface PPS's unique positioning opportunities. Long-term, this index *is* the table of contents of the PPS book.

---

## Library status

| Metric | Current |
|---|---|
| Books processed (comprehensive first pass) | **5** *(LOSB + Funt + MV + Sharper + Mathletics)* |
| Books queued in `source-pdfs/` | **3** *(Wong, Konik, Appelbaum)* — plus a quick-skim 30pp dated book |
| Topic syntheses written | **0** *(deferred — user prefers more ingestion first)* |
| Content opportunities in pipeline | **100+** *(40+ lessons / 31+ guides / 28+ tools / 14 originals)* |
| Market gaps identified | **50** |
| Cross-source conflicts being tracked | **1** *(CLV: LOSB-as-skill-signal vs Sharper-as-deepity)* |
| Cross-source syntheses ready | **1** *(Favorite-bias × Longshot-bias coexistence: Levitt 2004 + MV 2022)* |

**Last update:** Mathletics (Wayne L. Winston, Princeton 2009/2012) — first pass complete on Part IV gambling chapters + Ch 11 (Streakiness) + Ch 35-36 (Game fixing / Donaghy) + Ch 37 (End-game). Note at `notes/mathletics-winston.md`. **Key findings:**
- **THE quantitative-foundations source.** Where MV is the *behavioral-finance* academic, Mathletics is the *applied-statistics* academic. Foundational operational math for every probabilistic claim PPS will make.
- **The σ values:** NFL margin σ=13.86 (Stern 1991), NBA σ=12, NCAAB σ=10, CFB σ=16 (Sagarin). **Foundational reference material for every spread-to-probability calculator PPS will build.**
- **Spread → Probability translation** is operational and quantifiable using the normal distribution + sport-specific σ. Direct calculator content.
- **The Levitt 2004 finding** (NFL favorites cover <50%; bookies earn 6%+ not the textbook 4.5%): peer-reviewed empirical evidence that bookmakers structurally exploit favorite-bias. Sample: 20,000 bettors, 2001 NFL season. **Direct quantitative support for Ban-or-Bankrupt + cross-validates Sharper's "books charge what their clientele will tolerate."**
- **Streakiness doesn't exist** under proper statistical testing. Most "hot streaks" are random; Albright's hot-hand analysis shows year-to-year streakiness doesn't persist. Mass-market betting content trades on momentum narratives that the math refutes. Massive content opportunity.
- **Kelly Criterion derivation + sensitivity table** — clean mathematical treatment. Pair with Sharper's operational humility for full operational picture (at 60% winners, betting 30%+ of bankroll *destroys* your bankroll despite the edge).
- **The Levitt × MV cross-source synthesis surfaced** — favorite-bias (Levitt, NFL spread market) and longshot-bias (MV, moneyline markets) **coexist in the same bettors at different decision points.** Two biases, two markets, same squares. No public source makes this connection. **PPS-original synthesis content ready.**
- **Statistical detection of game fixing** (Donaghy: p=0.005 z-test; Wolfers/HB college basketball debate). Foundation for the Ban-or-Bankrupt paper's integrity section.
- **Monte Carlo simulation methodology** — operational template for series-win probability and tournament bracket simulators.

**Earlier update:** Sharper (Pokerjoe / Richard Bennet, 2016 rev. 2021) — first pass complete. Note at `notes/sharper-pokerjoe.md`. **Key findings:**
- **The operational-tactical companion to LOSB.** Where LOSB is "how the business works," Sharper is "here's the spreadsheet formula." Two-source convergence on most LOSB themes + heavy operational depth.
- **Direct LOSB cross-citation** in Ch 6 — Pokerjoe recommends LOSB on linemaking; the books are in explicit dialogue.
- **First cross-source conflict surfaced:** ⚠️ **CLV.** LOSB positions CLV ≥ half the hold as the #1 long-run profitability predictor. Sharper calls CLV partly a *deepity* (Dennett) — tautological for line grinders, partial signal for handicappers, and the closing line is not always the most efficient line. **PPS reconciliation candidate ready** (CLV as necessary-not-sufficient; distinguish handicapper-CLV from grinder-CLV).
- **Price-vs-Juice reframe** — universally misunderstood concept. -1000/+800 is *less* juice than -110/-110. Juice is the bookie's business; sharps only care about price on the side they want.
- **Push frequencies as the missing operational input** for buying points, middling, alt-line decisions, edge estimation. Sharper provides the back-out-from-alt-lines spreadsheet formula. **First true operational push-frequency methodology in the library.**
- **The Risk-Free Promo Math** (Addendum) — counter-intuitive: 2-1 dog promo pays ~4× the EV of a 2-1 favorite promo. Worked-out results trees. Combines with LOSB's go-for-broke math to give PPS the full operational treatment of US legal-market promos.
- **Three-pronged handicapping framework:** player-based + performance-based + market-based ratings, weighted across the season. Clean taxonomy.
- **Trailing vs leading edge of line movement** — Sharper-original concept; specifies which side of a moved line is the sharper number depending on whether the move was square-driven or sharp-driven.
- **The "Wong teaser" public-edge-collapse case** — Heritage's Ganchrow primary-source response; concrete documentation of how published edges die.

**Earlier update:** Betting Without Beta (Moskowitz & Vasudevan, Yale 2022) — first pass complete on the academic paper. Note at `notes/betting-without-beta-moskowitz-vasudevan.md`. **Key findings:**
- **THE academic primary source.** Yale + NBER + AQR institutional credentials; resolves PPS's "where's the peer-reviewed credibility?" gap for the Ban-or-Bankrupt paper
- **Favorite-Longshot Bias (FLB) is driven by preferences, not beliefs** — proven via novel Moneyline-vs-Spread differencing on 36,609 college and pro basketball + football games
- **Implied volatility smile parallel to options markets** — sports betting contracts on extreme favorites/underdogs show higher implied volatility, qualitatively AND quantitatively similar to options
- **One unified preference model** (Cumulative Prospect Theory with α ≈ γ ≈ 0.65, λ = 1) explains both FLB in sports betting AND low-risk anomalies in equities, options, bonds, commodities
- **40+ peer-reviewed citations cataloged** — the bibliographic foundation the Ban-or-Bankrupt paper needs
- **Methodological move worth borrowing:** differencing two contract types that vary in only one attribute isolates the causal variable

**Earlier update:** Everybody Loses (Funt) — comprehensive first pass complete. Deep read on Ch 1, 5, 10, 11; skim w/ thesis capture on Ch 2-4, 6-9, 12. Note at `notes/everybody-loses-danny-funt.md`. **Key findings:**
- **Ban-or-Bankrupt model is named within the industry** ("the European model") — Robert Walker (former MGM Mirage), Ch 5
- **Population-level cost data:** NJ Rutgers 2023: 21% of sports bettors wished they were dead, 10% attempted suicide
- **The bookmaker bloodbath:** 24+ operators failed since 2018; DraftKings cumulative EBITDA −$4.3B 2018-2023; FanDuel + DraftKings = ~75% market share
- **FanDuel CEO Amy Howe announced (Oct 2024)** plan to push hold from 12% → 16% by 2030 — direct hold-inflation roadmap
- **The historical foundations:** vig (1907), point spread (1930s), props (1986), bookmaking software (mid-1980s) — bookmaking innovations are 40-115 years old
- **The UK precedent ignored** (Joshua Grubbs: "I have not spoken to a single state legislature that was reading the research out of the UK")
- **Matt Davidow (LOSB co-author) features in Funt Ch 11** — direct cross-pollination between our two primary sources

Now have enough material from three sources (industry-analytical + journalistic + academic) to spin up topic syntheses + draft significant sections of the research paper, including its behavioral-finance section grounded in peer-reviewed citations.

---

## How to use this library

**For our own content work (PPS team):**
- Need to write a guide on topic X? → Check `topics/{topic}.md` first; if it's not there yet, check related book notes in `notes/`.
- Need a fact / quote / framework to cite? → Find the source book's note for the page reference.
- Wondering "what should we ship next?" → Check `content-opportunities.md` for ready (🟢) items.
- Want the meta view of where the field stands? → Read the **Field state assessment** section below.

**For Claude in future sessions:**
- New book to process? Use the template in `library/README.md`. Output goes to `notes/`.
- After every 3-5 books processed: update `topics/` syntheses, refresh `content-opportunities.md`, and update this index.
- When you spot a conflict between books, flag it in the **Cross-source conflicts** section below.

---

## Books in the library

### Processed (synthesis notes in `notes/`)

| Book | Authors | Year | Status | Synthesis quality |
|---|---|---|---|---|
| The Logic of Sports Betting | Miller & Davidow | 2019 | **priority chapters + pedagogy + pain points complete** | Strong on industry structure, profiling, market making, props, marketing, hold-chopping, weak markets, CLV. Secondary chapters pending later pass. |
| Everybody Loses | Danny Funt | 2024-2025 | **comprehensive first pass complete** | All 12 chapters mapped at appropriate depth. Deep: Intro, Ch 1, 5, 10, 11. Skim: 2-4, 6-9, 12. Strong on industry critique, ban-or-bankrupt naming, PASPA history, profiling/limiting, league hypocrisy, beard economy, addiction-and-public-health, bookmaker bloodbath, state tax history, historical foundations, integrity/corruption, UK precedent. |
| Betting Without Beta | Moskowitz & Vasudevan | 2022 | **first pass complete (academic paper)** | THE academic primary source. Resolves FLB causality (preferences, not beliefs) via Moneyline-vs-Spread differencing on 36,609 games. Implied volatility smile parallel to options markets. Unifying behavioral framework across betting + finance. 40+ peer-reviewed citations cataloged. Yale + NBER + AQR credentials. |
| Sharper | True Pokerjoe (Richard Bennet) | 2016 (rev. 2021) | **first pass complete** | Operational-tactical companion to LOSB. Spreadsheet formulas for vig-free line, push frequencies, buying points, Kelly, alt-line decisions. Risk-free + free-play promo math. CLV-as-deepity critique. Trailing-vs-leading-edge concept. Three-pronged handicapping taxonomy. Wong teaser case study. Direct LOSB cross-citation. |
| Mathletics | Wayne L. Winston | 2009 (rev. 2012) | **first pass complete on Part IV + scattered relevant chapters** | THE quantitative-foundations academic source. Sport σ values (NFL 13.86, NBA 12, NCAAB 10, CFB 16) for spread→probability translation. Levitt 2004 finding on bookmaker favorite-bias exploitation. Kelly derivation + sensitivity table. Streakiness debunking. Donaghy detection methodology. Monte Carlo for series/tournaments. Princeton University Press credentials. |

### Queued (in `source-pdfs/`, not yet processed)

| Book | Authors | Year | Pages | Why we have it |
|---|---|---|---|---|
| Sharp Sports Betting | Stanford Wong | 2009ish | 355 | Classic foundational math, older-era cross-reference |
| The Smart Money | Michael Konik | 2006 | 355 | Syndicate narrative, Billy Walters era authority |
| The Everything Guide to Sports Betting | Josh Appelbaum | recent | 335 | Beginner intro — curriculum source for Path 01 |

---

## Field state assessment

Updated after every book read. This is the "where does sports betting knowledge stand publicly" snapshot.

### What's well-established (multi-source consensus, when we have multiple sources)

*Bold = now corroborated by 2+ sources.*

- **Sportsbook line-making relies heavily on copying from market makers, not independent pricing at every book.** *(LOSB + Funt trader interviews)*
- **Market makers and retail books operate as fundamentally different business models.** *(LOSB analytically + Funt's South Point vs PointsBet contrast)*
- **Customer profiling for sharpness is standard practice; at market makers it informs line movement, at retail books it informs limiting.** *(LOSB framework + Funt trader interviews + Funt beard experiment)*
- **The closing-line-value signal is the #1 trigger for limiting at retail books.** *(LOSB + Funt — multiple trader sources)*
- **US sportsbooks operate under a "ban or bankrupt" model: limit the few who could win, push high-margin parlays at the rest.** *(LOSB analytical structure + Funt's explicit naming via Walker)*
- **Sports betting is a multiplayer adversarial game, structurally unlike casino games.** *(LOSB)*
- **CLV ≥ half the hold over hundreds of bets is a strong predictor of long-term profitability.** *(LOSB)*
- **Weak markets (single market maker, low limits, derivatives, props) are where exploitable edges live.** *(LOSB)*
- **Props create a "massive attack surface" of mispriced or stale markets that books can't keep current.** *(LOSB)*
- **Most retail sportsbooks add 4-8 second delays to in-play bets, which (combined with TV delay) makes hold-bearing in-play betting structurally unwinnable for casual bettors.** *(LOSB)*
- **The "chopping-the-hold" mental model — start with the book's hold, subtract via cross-book shopping, angles, and cross-derivative comparison — is the operating strategy of winning bettors.** *(LOSB)*
- **Sportsbook marketing budgets (deposit bonuses, free play, odds boosts, rebates) are a temporary but real profit pool for skilled bettors during industry expansion phases.** *(LOSB)*
- **The math of deposit bonuses *favors "go for broke" strategies* over grinding the rollover, when the rollover requirement is meaningfully high.** *(LOSB — counter-conventional but mathematically proven)*
- **The major US sports leagues testified under oath in 1991-92 that sports betting was structurally corrupting; post-2018 they reversed course and signed partnership deals with sportsbooks.** *(Funt PASPA reconstruction)*
- **"Gaming" is a deliberate corporate-linguistic strategy invented by the AGA in 1994 to launder "gambling."** *(Funt + Derevensky source)*
- **The fan-team relationship is transformed by betting: cheering for the spread instead of the team, fans booing meaningless points that cost them bets.** *(Funt + Bradley + Stern testimony)*
- **Athlete harassment from gamblers exploded after 2018 legalization (NCAA's word: "wildfire").** *(Funt + NCAA's Hangebrauck)*
- **Sportsbooks limit accounts they *anticipate* will win, not just those that *have* won.** *(Funt's beard experiment + Crab Sports pre-bet rejection)*
- **The Favorite-Longshot Bias (FLB) — underdog bets earn systematically lower risk-adjusted returns than favorite bets — is driven by bettor *preferences* (lottery love), not by mistaken *beliefs* about outcomes.** *(Moskowitz & Vasudevan 2022 — definitive empirical resolution via 36,609-game Moneyline-vs-Spread test)*
- **Sports betting markets are a clean research laboratory for behavioral finance: contingent claims, idiosyncratic outcomes, no systematic risk, observable termination.** *(Thaler & Ziemba 1988 → Moskowitz & Vasudevan 2022 — methodological consensus)*
- **The same preference framework (Cumulative Prospect Theory with probability weighting + diminishing sensitivity) explains both sports-betting FLB and equity/options low-risk anomalies — one model, two markets.** *(Moskowitz & Vasudevan 2022)*
- **Sports betting is a market, not a casino game** — adversarial multiplayer with line-makers, line-grinders, handicappers, and squares. Lines are initially set by linemakers but thereafter moved by bettors. *(LOSB + Funt + Sharper direct cross-citation)*
- **Juice (theoretical hold) is the bookie's business; for sharps the operative variable is *price* on the side they want.** A -1000/+800 line carries ~2% juice — less than -110/-110 (4.55%). *(Sharper Ch 5, mathematically demonstrated)*
- **Published edges decay as the market absorbs them.** NFL turnover system (57.7% → ~49%), Wong teasers (Ganchrow's Heritage fix), the public-system survivorship problem. *(Sharper Ch 8 + Ganchrow primary source)*
- **Three legitimate handicapping skill tests:** ATS results (large sample needed), CLV (with caveats — see Conflict #1 below), forward-linemaking (single weekend possible). *(Sharper Ch 18 + Ch 22; partial overlap with LOSB)*
- **The final margin of a sports game ≈ Normal(predicted margin, σ)** where σ ≈ 13.86 for NFL, 12 for NBA, 10 for NCAAB, 16 for CFB. Foundation for every spread→probability translation. *(Mathletics Ch 43; Stern 1991, *American Statistician* + Sagarin)*
- **Bookmakers exploit bettor favorite-bias to earn actual hold above the textbook 4.5%** — Levitt's 2001 NFL sample showed actual bookie profit was ~6.16% per $10 bet (~23% above the balanced-action theoretical hold). NFL home favorites cover 48.8%; visiting favorites 46.7% (1980-2001). *(Mathletics Ch 39, citing Levitt 2004 *Economic Journal*; cross-validates Sharper's "books charge what their clientele tolerates" and Funt's hold-inflation narrative)*
- **Streakiness and "hot hand" largely don't exist under proper statistical testing.** Year-to-year streakiness doesn't persist among MLB hitters (Albright); NBA team streakiness explained by random variation (Mathletics' 2002-3 z-test analysis). Mass-market betting content trades on momentum narratives the math refutes. *(Mathletics Ch 11)*
- **Kelly's edge-protection math is rigorous: betting above optimal-f destroys bankroll despite positive edge.** At 60% winners, betting >30% of bankroll guarantees long-run decline. *(Mathletics Ch 44; complements Sharper's fractional-Kelly humility)*

### Where sources conflict (cross-source reconciliations)

#### Conflict #1: How central is CLV to long-run profitability?

- **Claim (LOSB):** CLV ≥ half the hold over hundreds of bets is *the* predictive signal of long-run profitability. The closing line is the most efficient line. Track CLV to know if you have edge.
- **Source A:** Miller & Davidow, *The Logic of Sports Betting* (2019) — Strong vs Weak Markets chapter, CLV framework throughout.
- **Counter-claim (Sharper):** CLV is partly a *deepity* (Dennett). For line grinders it's tautological — they bet because the available line was off-market, and the market then converges to consensus, which *is* CLV by construction. The closing line is *not always* the most efficient line — square money near close can de-anchor it (Seattle-StL Week 8 2013 example: line moved from -11 to -13.5 on square money for big favorites). "Beating the close" correlates with winning the same way that "winning the bet" correlates with winning.
- **Source B:** Pokerjoe, *Sharper* (2016 rev. 2021) — Ch 20-21.
- **PPS reconciliation:**
  1. **CLV is necessary-but-not-sufficient.** Useful directional signal, but not the gospel LOSB makes it.
  2. **Distinguish CLV-for-handicappers vs CLV-for-line-grinders.** For grinders, CLV is partly built into the methodology; the more interesting metric is "is my CLV better than the average line grinder's?" For handicappers, CLV is a partial skill signal but is partly contaminated by book-deference-to-winners (your bets move lines because the market trusts winners).
  3. **The closing line is not the universal efficient-frontier oracle.** An hour pregame can be sharper than close on square-driven markets.
  4. **The three skill tests from Sharper (ATS results, CLV with caveats, forward-linemaking) are a better composite signal** than CLV alone.

This reconciliation can become its own PPS content piece: "What CLV actually measures (and what it doesn't)." Genuine cross-source synthesis content; unique in market.

#### Cross-Source Synthesis #1 (not a conflict — a *both/and* combination): Favorite-Bias and Longshot-Bias Coexist

- **Claim (Levitt 2004, via Mathletics Ch 39):** NFL point-spread bettors are biased toward favorites. Books exploit this by inflating favorite spreads. NFL home favorites cover 48.8% of the time; visiting favorites 46.7% (1980-2001). Bettors lose ~6.16% per $10 bet vs the 4.55% theoretical hold.
- **Claim (Moskowitz & Vasudevan 2022):** Sports bettors exhibit Favorite-Longshot Bias (FLB) on the moneyline — underdog returns are systematically lower than favorite returns. Driven by lottery preferences (overweighting rare big-win events).
- **Apparent contradiction:** Levitt says squares love favorites; MV says squares love underdogs.
- **PPS synthesis (no public source has this):** **The biases are not contradictory; they live in different markets and decision points.**
  1. On the *spread*, squares are biased toward the favorite (Levitt — overconfidence in named-brand teams covering big margins). Books exploit this with inflated favorite spreads.
  2. On the *moneyline*, squares are biased toward the underdog (MV — lottery-preference for rare-but-big underdog wins). Books exploit this with FLB-inflated underdog moneyline prices.
  3. **The same square can simultaneously be (a) overpaying for a favorite ATS and (b) overpaying for an underdog moneyline.** It's the same bettor with different biases at different decision points.
  4. **Bookmakers structurally exploit both directions.** This is the empirical core of the Ban-or-Bankrupt economics.

This synthesis is ready to ship as a PPS Original: **"The Two Biases You Carry to the Sportsbook" (Levitt + MV)** — distinctive, brand-aligned, math-anchored, peer-reviewed citations on both sides.

**Tracking template (used when we find more):**
- **Claim:** [what one source says]
- **Source A:** [book, page]
- **Source B:** [book, page, contradictory framing]
- **PPS reconciliation:** [our position + reasoning]

### Gaps in public content (PPS opportunities to be the first/best)

1. **The market-maker vs retail-book dichotomy** — completely absent from public sportsbook comparison content. Every comparison rates on features/promos, never business model. **Massive gap.** *(LOSB)*
2. **Lines are mostly copied, not independently set** — public betting media frames every line move as unique market intelligence. *(LOSB)*
3. **The 1-5 sharpness profiling system** — sharps know they get tagged; recreationals have no idea. *(LOSB)*
4. **Parlay-volume math** — common advice is wrong-in-mechanism (volume amplifier, not bad bets). *(LOSB)*
5. **CLV specific benchmark (>50% of hold over hundreds of bets)** — everyone says "track CLV"; nobody states the threshold that actually predicts profitability. *(LOSB)*
6. **"Attack weak markets" as the operating thesis** — every winning bettor does this; almost never spelled out for newer ones. Most public guides teach NFL/NBA, the *strongest* markets. *(LOSB)*
7. **The in-play 4-8s sportsbook delay** — widely experienced, almost never named or explained. *(LOSB)*
8. **Go-For-Broke deposit-bonus math** — provably correct, runs against universal "grind it out" advice. **Brand-aligned, contrarian, high-clickability.** *(LOSB)*
9. **Chopping-the-Hold as a unified mental model** — sharp bettors apply intuitively; novices never learn the framework. *(LOSB)*
10. **Free play longshot rule** — trivial math, almost never explained publicly. *(LOSB)*
11. **Academic FLB research is invisible to bettors.** Most "betting strategy" content cites zero peer-reviewed work; bettors don't know economists have been studying the Favorite-Longshot Bias since 1949 (Griffith). *(Moskowitz & Vasudevan)*
12. **Implied volatility for sports betting contracts** — Moskowitz & Vasudevan constructed an IV surface as a research artifact; no consumer tool exposes it. **First-of-kind product opportunity.** *(MV)*
13. **The behavioral-finance ↔ sports-betting bridge** is rare in public content. Plenty of stock-bias content; plenty of betting-strategy content; almost nothing connecting them despite Moskowitz's explicit framework. *(MV)*
14. **The "lottery preference" diagnosis** — bettors don't know that preferring underdogs is a well-documented bias (Cumulative Prospect Theory's probability weighting), traceable to their stock-market behavior too. *(MV)*
15. **The MLB/NHL no-FLB anomaly** — niche but counter-intuitive content. Why does FLB show up in NCAAF / NCAAB / NBA / NFL but not in baseball or hockey? *(MV via Woodland & Woodland 1994/2001, Gil & Levitt 2007)*
16. **Price-vs-Juice mental model** — almost universally misunderstood publicly. Every "best sportsbook" article ranks on hold/juice, when it's *price on the side you want* that matters. Massive gap. *(Sharper Ch 5)*
17. **Push frequencies as the missing operational input** for buying points, alt-line shopping, teasers. No public content explains how to back PFs out of sportsbook alt-lines. *(Sharper Ch 12)*
18. **Risk-free promo math** (4× more EV on dogs than faves) — counter-intuitive; almost never explained correctly in promo-grind blogs. *(Sharper Addendum)*
19. **Free-play promo math** (~60¢ on the dollar; bet dogs) — same gap. *(Sharper Addendum)*
20. **Deposit-bonus churn vs go-for-broke decision** — when to grind, when to YOLO. LOSB covers go-for-broke; Sharper covers churn. Public content covers neither well. *(LOSB + Sharper)*
21. **"The closing line is not always the most efficient line"** — directly contradicts almost all public CLV content. *(Sharper Ch 21)*
22. **Trailing vs leading edge of line movement** — Sharper-original framework; never explained publicly. *(Sharper Ch 11)*
23. **The CLV-deepity tension** — public CLV content is uniform on "track and beat the close"; the disagreement between LOSB and Sharper isn't surfaced anywhere outside specialist forums. *(LOSB ↔ Sharper synthesis)*
24. **Generic points vs spread points** (push-frequency-adjusted) — power-rating edges don't translate 1:1 to betting edges. *(Sharper Ch 26)*
25. **The "bet more on faves, less on dogs at equal edge" Kelly adjustment** — Sharper operating practice; combines naturally with MV's FLB framework. *(Sharper Ch 17 + MV cross-pollination)*
26. **The sharp-books roster + structural explanation** — Pinnacle, Circa, Heritage, Bookmaker, Westgate. PPS Tier-Map gets named candidates. *(Sharper Ch 10 + LOSB)*
27. **The Levitt 2004 finding** — peer-reviewed empirical evidence that NFL favorites cover <50% and bookies earn ~6% not 4.5%. Largely invisible to retail bettors. *(Mathletics Ch 39, citing Levitt 2004)*
28. **Spread → probability translation is rarely explained operationally.** Public content quotes "the line implies X%" without showing the normal-distribution math. *(Mathletics Ch 43)*
29. **The σ values for each sport** (NFL 13.86, NBA 12, NCAAB 10, CFB 16) are foundational reference material that's nowhere in mass-market content. *(Mathletics Ch 43)*
30. **Peer-reviewed evidence against streakiness / "hot hand"** is invisible to mass-market bettors who consume momentum-narrative content daily. *(Mathletics Ch 11; Albright; Gilovich)*
31. **No good public Kelly sensitivity lookup tool** — Mathletics provides the table, no public site has built the interactive version. *(Mathletics Ch 44)*
32. **The favorite-bias × longshot-bias coexistence** — neither Levitt nor MV makes the cross-reference; PPS-original synthesis. *(Cross-source #1)*
33. **"Statistical signal ≠ tradable signal"** — sophistication concept rarely surfaced (e.g., ref-bias is real but the Total Line incorporates it; you can't profit from it). *(Mathletics Ch 39)*
34. **The Wolfers/Heston-Bernhardt point-shaving debate** is academic-only; bettors deserve an accessible summary. *(Mathletics Ch 35)*

*(Each new book will surface more. Migration to `content-opportunities.md` happens as items mature.)*

### Frameworks PPS is synthesizing or extending

Original or extended frameworks that emerge from cross-source synthesis (not just lifted from any one book):

1. **The Ban-or-Bankrupt Equilibrium** — Now explicitly named in industry by Robert Walker (former MGM Mirage, via Funt ch 5) as "the European model." PPS contribution: formalize the equilibrium model — when limiting works, when it fails, how it scales with market maturity, when it's stable vs unstable, social cost vs revenue trade-offs. **Now also grounded in peer-reviewed behavioral-finance work via Moskowitz & Vasudevan 2022** — if sharps (who would correct underdog mispricing) get limited, lottery-preference sets the marginal price unopposed, *worsening* FLB at retail books. Source-validated and ready for paper-grade development with academic citations.
2. **Preference-distortion at retail vs sharp books** — extending MV's framework: their data is cross-sportsbook closing-line. PPS extension: do FLB magnitudes differ at FanDuel/DraftKings (recreational-skewed) vs Circa/South Point (sharp action allowed)? This is a *new* empirical question MV doesn't address but the framework supports.
3. **The implied volatility surface for sports betting** — MV built it as a research artifact. PPS extension: operationalize it as a public tool. Input ML + Spread on a game → output the lottery-preference distortion factor.

*(Will grow as we synthesize across more books.)*

### Reader pain points (the emotional/positioning lens)

A separate lens tracked across each note's "Reader pain points exposed" section. Goal: identify specific emotional moments where readers feel the pain of being on the wrong end of the modern sportsbook industry. PPS uses these as **opening hooks** in content ("lead with the pain, deliver the math"), **trust signals** (we acknowledge the dark side), and **lead-gen angles** (people search pain-point queries).

Standout pain points already surfaced from LOSB + Funt:

- **"I won big and they punished me for it"** (Beau Wagner / FanDuel beard experiment) — the betrayal of being limited after winning
- **"I'm shopping for prices like any normal consumer and being punished"** (Markus Ericsen) — same behavior smart in any other market is flagged at books
- **"I love sports less now"** (Josh Reid) — losing the joy of fandom to betting
- **"I'm ashamed of this and don't want to tell anyone"** (Eddie Walls) — stigma even when you're winning
- **"They sent me a promo right after I lost $5k"** (Funt's experiment) — predatory promo timing
- **"My team won but I lost and now I hate them"** (Stern's "cheering in the wrong places")
- **"I think I know this stuff but I keep losing"** (LOSB's are-you-the-sucker)
- **"I keep getting limited and I don't know why"** (the blindfolded-account experience)
- **"The whole thing feels rigged"** (validated structurally without endorsing conspiracy)

PPS content can lead with these emotional moments and resolve them with math/tools. A guide on "Why DraftKings doesn't want you to win" should open with Beau Wagner's story, not with a definition of profiling.

---

## Library structure (file map)

```
library/
├── INDEX.md                       ← this file, the entry point
├── README.md                      ← documentation: template, workflow, copyright posture
├── content-opportunities.md       ← shippable content pipeline (with status tags)
├── source-pdfs/                   ← raw PDFs (gitignored)
├── notes/                         ← per-book synthesis files
│   ├── logic-of-sports-betting-miller-davidow.md
│   ├── everybody-loses-danny-funt.md
│   ├── betting-without-beta-moskowitz-vasudevan.md
│   ├── sharper-pokerjoe.md
│   └── mathletics-winston.md
├── topics/                        ← cross-book topic syntheses (empty for now)
└── our-book/                      ← eventual public manuscript (long-term)
```

---

## Active topic queue

Topics that will get their own `topics/{topic}.md` synthesis once we have 2-3+ books touching them:

| Topic slug | Books contributing | Status |
|---|---|---|
| `industry-structure-and-regulation` | LOSB ✓ · Funt ✓ | 🟢 ready to draft |
| `account-profiling` | LOSB ✓ · Funt ✓ · Wong (queued) | 🟢 ready to draft |
| `pricing-inefficiencies` | LOSB ✓ · MV ✓ · Wong (queued) | 🟢 ready to draft |
| `market-making-and-price-discovery` | LOSB ✓ · MV ✓ (sharp-book closing-line analysis) | 🟢 ready to draft |
| `closing-line-value` | LOSB ✓ · Sharper ✓ | 🟢 ready to draft — *includes Conflict #1* |
| `chopping-the-hold` | LOSB ✓ | 🔵 unique to LOSB so far |
| `weak-vs-strong-markets` | LOSB ✓ | 🔵 needs Wong corroboration |
| `props-and-derivatives` | LOSB ✓ | 🔵 needs 2nd source |
| `bonus-conversion` | LOSB ✓ (go-for-broke) · Sharper ✓ (risk-free + free-play + churn) | 🟢 ready to draft — **flagship-quality combined treatment** |
| `in-play-betting-and-delay` | LOSB ✓ | 🔵 needs Funt corroboration |
| `dark-patterns-behavioral-design` | LOSB ✓ · Funt ✓ | 🟢 ready to draft |
| `parlays-and-sgps` | LOSB ✓ · Funt ✓ · Sharper ✓ · Wong (queued) | 🟢 ready to draft |
| `teasers` | Sharper ✓ (Wong-teaser case study) | 🟢 ready to draft |
| `middling-scalping-arbing` | Sharper ✓ | 🟢 ready to draft |
| `psychology-of-the-bettor` | LOSB (light) · Funt ✓ · MV ✓ · Sharper ✓ | 🟢 ready to draft — multi-source backbone |
| `industry-fragility` | LOSB ✓ · Funt ✓ (bookmaker bloodbath) | 🟢 ready to draft |
| `expected-value-foundations` | LOSB ✓ · MV ✓ · Sharper ✓ · Wong/Appelbaum (queued) | 🟢 ready to draft |
| `vig-free-line-calculation` | MV ✓ · Sharper ✓ (with formula) | 🟢 ready to draft |
| `push-frequencies` | Sharper ✓ (primary) | 🟢 ready to draft — Sharper is THE source |
| `buying-and-selling-points` | Sharper ✓ (primary) | 🟢 ready to draft |
| `kelly-criterion-and-sizing` | Sharper ✓ + Mathletics ✓ (derivation + sensitivity) | 🟢 ready to draft — full operational + mathematical treatment |
| `spread-to-probability` | Mathletics ✓ (primary) | 🟢 ready to draft — Mathletics is THE source |
| `normal-distribution-game-outcomes` | Mathletics ✓ (primary) | 🟢 ready to draft |
| `monte-carlo-simulation-betting` | Mathletics ✓ (primary) | 🟢 ready to draft |
| `streakiness-and-hot-hand` | Mathletics ✓ (primary) | 🟢 ready to draft — Mathletics is THE source |
| `levitt-2004-bookmaker-exploits-bias` | Mathletics ✓ (primary) | 🟢 ready to draft |
| `favorite-bias-vs-longshot-bias` | Mathletics + MV cross-synthesis | 🟢 ready to draft — **PPS-original** |
| `game-fixing-detection` | Mathletics ✓ (Donaghy + Wolfers/HB) | 🟢 ready to draft |
| `referee-bias` | Mathletics ✓ | 🟢 ready to draft |
| `home-field-advantage` | Mathletics ✓ + Sharper ✓ (compressed values) | 🟢 ready to draft |
| `sharp-line-construction` | LOSB ✓ · Sharper ✓ (names the books) | 🟢 ready to draft |
| `square-vs-sharp-thinking` | Sharper ✓ (primary) · LOSB ✓ (1-5 scale variant) | 🟢 ready to draft |
| `price-vs-juice` | Sharper ✓ (primary) | 🟢 ready to draft — Sharper is THE source |
| `line-movement-interpretation` | Sharper ✓ (trailing vs leading) | 🟢 ready to draft |
| `handicapping-methodology` | Sharper ✓ (3-pronged) | 🟢 ready to draft |
| `power-ratings` | Sharper ✓ | 🟢 ready to draft |
| `injury-impact-modeling` | Sharper ✓ | 🔵 needs Mathletics/Winston corroboration |
| `system-survivorship-bias` | Sharper ✓ (NFL turnover + Wong teaser cases) | 🟢 ready to draft |
| `gambling-life-realism` | Sharper Ch 31 + Funt | 🟢 ready to draft |
| `devig-methods` | LOSB (light) · Sharper ✓ (with formula) | 🟢 ready to draft |
| `favorite-longshot-bias` | MV ✓ (primary) | 🟢 ready to draft — MV is THE source |
| `behavioral-finance-and-sports-betting` | MV ✓ (primary) | 🟢 ready to draft |
| `cumulative-prospect-theory-applications` | MV ✓ (primary) | 🟢 ready to draft |
| `probability-weighting` | MV ✓ | 🟢 ready to draft |
| `diminishing-sensitivity` | MV ✓ | 🟢 ready to draft |
| `low-risk-anomalies-cross-market` | MV ✓ | 🟢 ready to draft (cross-market angle) |
| `implied-volatility-and-betting` | MV ✓ | 🟢 ready to draft — novel concept |
| `historical-academic-foundations` | MV ✓ (Griffith → Thaler & Ziemba → present) | 🟢 ready to draft — bibliographic spine |
| `market-efficiency-sports-betting` | MV ✓ (secondary) | 🔵 needs Wong corroboration |

---

## Next moves (set by current state)

1. ✅ ~~Finish Logic of Sports Betting priority chapters.~~ (Complete.)
2. ✅ ~~Process Everybody Loses (Funt).~~ (Complete — all 12 chapters mapped.)
3. ✅ ~~Process Moskowitz & Vasudevan academic paper.~~ (Complete — academic-credibility tier secured.)
4. ✅ ~~Process Sharper (Pokerjoe).~~ (Complete — operational tier + first cross-source conflict surfaced: CLV.)
5. ✅ ~~Process Mathletics (Winston).~~ (Complete — quantitative-foundations tier + Levitt 2004 finding + first PPS-original cross-source synthesis.)
6. **Next book decision point.** Top candidates:
   - **Konik (Smart Money, 355pp)** — Billy Walters narrative; cross-pollinates with Funt journalistic angle. Adds sharp-pro biography to library. **Recommendation if continuing ingestion** — adds a narrative-source we don't have yet.
   - **Wong (Sharp Sports Betting, 355pp)** — older-era foundational. Likely high redundancy with LOSB+Sharper+Mathletics for operations.
   - **Appelbaum (Everything Guide, 335pp)** — curriculum-level intro; useful for Path 01 mapping.
   - **Complete Book of Sports Betting (30pp)** — quick-skim only, likely dated.
6. **Spin up first `topics/` syntheses.** With 4 sources, the topics most ready to draft (multi-source or single-strong-source + PPS-original-content):
   - `closing-line-value` — **flagship synthesis (Conflict #1 reconciliation)**
   - `bonus-conversion` — **flagship (combined LOSB + Sharper full promo treatment)**
   - `account-profiling` — LOSB + Funt + Sharper (beard-farming)
   - `psychology-of-the-bettor` — Funt + MV + Sharper triangulation
   - `favorite-longshot-bias` — MV primary
   - `vig-free-line-calculation` — MV + Sharper (with formula)
   - `push-frequencies` — Sharper primary
   - `price-vs-juice` — Sharper primary
   - `sharp-line-construction` — LOSB + Sharper named books
7. **Ship a first piece.** Top candidates after Sharper:
   - **The Promo Grind** (master guide + 4 calculators: deposit-bonus rollover, go-for-broke, risk-free, free-play). Combined LOSB + Sharper — **strongest flagship candidate now in the library**. Operational, brand-aligned, math-anchored.
   - **The CLV Reconciliation** — independent PPS synthesis. Brand-builder.
   - **Price-is-not-Juice** + Sportsbook Hold Tier — concept + tool pair.
   - **Vig-Free Line Calculator** and **Push Frequency Estimator** — pasteable formulas, low build cost.
   - Older shortlist remains viable: Hold Chopper, Go-For-Broke Method, Market-Makers-vs-Retail, "FLB in plain English."
8. After ~10 books processed: the index is mature enough to draft the Ban-or-Bankrupt paper from the synthesis, with MV providing the peer-reviewed citation spine and LOSB+Funt+Sharper as the industry/journalism/operational layers.

---

*This index is a living document. Every session that touches the library updates it. As the library grows, the field-state sections grow with it — and eventually become the spine of PPS's own book.*
