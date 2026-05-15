# PPS Library — Master Index

The living document that synthesizes everything PROFITPATH knows about modern sports betting. **Updated every time a book is read.** This file is the single entry point — start here.

> **Purpose:** Capture the state of the field across every credible source, identify gaps and conflicts in public knowledge, and surface PPS's unique positioning opportunities. Long-term, this index *is* the table of contents of the PPS book.

---

## Library status

| Metric | Current |
|---|---|
| Books processed (comprehensive first pass) | **3** *(LOSB priority + Funt comprehensive + Moskowitz/Vasudevan academic)* |
| Books queued in `source-pdfs/` | **3** *(Wong, Konik, Appelbaum)* |
| Topic syntheses written | **0** *(ready to spin up — most topics now have 2-3 sources)* |
| Content opportunities in pipeline | **60+** *(24+ lessons / 18+ guides / 13+ tools / 8 originals)* |
| Market gaps identified | **31** |

**Last update:** Betting Without Beta (Moskowitz & Vasudevan, Yale 2022) — first pass complete on the academic paper. Note at `notes/betting-without-beta-moskowitz-vasudevan.md`. **Key findings:**
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

### Where sources conflict (cross-source reconciliations)

*(Empty for now — populated as more books are read and disagreements surface.)*

**Tracking template (used when we find one):**
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
│   └── betting-without-beta-moskowitz-vasudevan.md
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
| `closing-line-value` | LOSB ✓ | 🔵 needs 2nd source (Wong, Appelbaum) |
| `chopping-the-hold` | LOSB ✓ | 🔵 unique to LOSB so far |
| `weak-vs-strong-markets` | LOSB ✓ | 🔵 needs Wong corroboration |
| `props-and-derivatives` | LOSB ✓ | 🔵 needs 2nd source |
| `bonus-conversion` | LOSB ✓ (go-for-broke math) | 🔵 PPS in-house knowledge fills out the practical side |
| `in-play-betting-and-delay` | LOSB ✓ | 🔵 needs Funt corroboration |
| `dark-patterns-behavioral-design` | LOSB ✓ · Funt ✓ | 🟢 ready to draft |
| `parlays-and-sgps` | LOSB ✓ · Funt ✓ · Wong (queued) | 🟢 ready to draft |
| `psychology-of-the-bettor` | LOSB (light) · Funt ✓ · MV ✓ | 🟢 ready to draft — now with academic backbone |
| `industry-fragility` | LOSB ✓ · Funt ✓ (bookmaker bloodbath) | 🟢 ready to draft |
| `expected-value-foundations` | LOSB ✓ · MV ✓ · Wong/Appelbaum (queued) | 🟢 ready to draft |
| `devig-methods` | LOSB (light) | 🔵 needs deeper source |
| `kelly-criterion-and-sizing` | (not yet covered in depth) | 🔵 needs Wong + dedicated source |
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
4. **Next book decision point.** Top candidates: **Sharper (PokerJoe, 129pp)** — short, modern strategy. Or **Wong (Sharp Sports Betting, 355pp)** — older-era foundational math, would corroborate LOSB market making + parlays + devig. Or **Mathletics (Winston)** — math/probability foundations to firm up the EV foundations and reach Kelly. Recommendation: **Sharper next** — short, modern, complements LOSB tactically before stepping into the older Wong.
5. **Spin up first `topics/` syntheses.** Most cross-referenced + ready-to-draft now: `account-profiling`, `industry-structure-and-regulation`, `psychology-of-the-bettor`, `favorite-longshot-bias`, `pricing-inefficiencies`. With three sources we have triangulation on several.
6. **Ship a first piece.** Top candidates: Hold Chopper (LOSB-only, ready), Go-For-Broke Bonus Method (LOSB-only, ready), Market-Makers-vs-Retail guide (LOSB-only, ready). MV unlocks a new flagship-quality option: **"The Favorite-Longshot Bias paper, in plain English"** (PPS Original — reputation-builder).
7. After ~10 books processed: the index is mature enough to draft the Ban-or-Bankrupt paper from the synthesis, with MV providing the peer-reviewed citation spine.

---

*This index is a living document. Every session that touches the library updates it. As the library grows, the field-state sections grow with it — and eventually become the spine of PPS's own book.*
