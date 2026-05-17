# PROFITPATH Project Brief

> **Purpose:** Self-contained project state document. Read this if you're (a) returning to the project after a break, (b) starting a new Claude conversation and need to refresh context, or (c) onboarding a collaborator. As of last update, this brief reflects **11 books processed** into the library and the brand positioning that has emerged from that work.
>
> **Last updated:** 2026-05-17 (after Nate Silver — *On the Edge*)

---

## 1. What this project is

**Profit Path Sports (PROFITPATH)** is a sports-betting education + tools site at `profitpathsports.com`. The brand sells **decision clarity for sports bettors** — not picks, not tout subscriptions, not "lock of the week" content. It's the "think probabilistically about uncertainty" brand applied to sports betting, with calculators, lessons, and (eventually) a research-grade paper + book.

Brand positioning (locked in after processing Annie Duke's *Thinking in Bets*):
> PROFITPATH is a decision-clarity brand that happens to apply to sports betting. Our content trains readers to think like sharps — about betting, but also about investing, business, and life.

This positioning lets us address sports bettors *and* a broader audience of people who care about probabilistic decision-making — investors, poker players, entrepreneurs, etc.

---

## 2. Where everything lives

- **Repo:** `rsnbets/profit-path-sports` (GitHub)
- **Local path:** `/Users/macbook/Desktop/profit-path-sports/`
- **Deployment:** Vercel, auto-deploys from `main` branch
- **Stack:** Static HTML / CSS / JS. No framework. Vanilla, fast, cheap to host.
- **Sister projects** (in `/Users/macbook/.claude/projects/-Users-macbook/memory/MEMORY.md`):
  - **Batter-Hit-EV** (~/Batter-Hit-EV) — Next.js MLB batter prop tool, Supabase auth
  - **Pitcher-K-EV** (~/Desktop/PITCHER.K.EV) — pitcher-K-prop fork of Batter-Hit-EV
  - **NBA picks project** — capper-channel transcript ingestion
  - **K-Prop Tool** (~/kprop-tool) — MLB strikeout prop projector

These are all separate codebases. PROFITPATH is the brand umbrella that may eventually link to / package them.

---

## 3. Current build state (homepage / site)

### ✅ Completed (Phases A-C of the rebrand)
- Homepage foundation: hero, originals section, toolbox section
- 4-lane homepage architecture
- 5-lesson curriculum scaffolding
- Originals visible: Hold Chopper concept, Bet X-Ray, Sportsbook Tier-Map
- Toolbox visible: Parlay Calculator, EV calculators

### 🛑 Hidden pending vetting (user's call)
- **Triple Stack** — hidden until user finishes vetting the methodology
- **Parlay Smart Way** — hidden, same reason
- These need to be re-featured once user gives green light

### ⏳ Pending
- **Phase D-E homepage rebrand** — Book Room section + lower homepage sections
- **Sweep of remaining tool pages + lesson pages** — apply new brand voice consistently across all existing pages
- **MailerLite integration** — waiting on user to set up the MailerLite account
- **`/research/` landing page** — pending the research paper draft

---

## 4. The Library project — the main in-flight work

The PPS Library is the **single most important in-flight initiative.** It's a running info-vault that synthesizes everything credible we can find about sports betting and probabilistic decision-making. Every piece of content PPS publishes from here forward — lessons, guides, tools, the research paper, the eventual book — draws from this library.

### Library location
`/Users/macbook/Desktop/profit-path-sports/library/`

### Library structure
```
library/
├── INDEX.md                       ← master living document; the single entry point
├── README.md                      ← workflow documentation
├── content-opportunities.md       ← rolling pipeline of shippable content
├── source-pdfs/                   ← raw PDFs (gitignored)
├── notes/                         ← per-source synthesis files
└── topics/                        ← cross-source topic syntheses (not yet started)
```

### Library status (as of this brief)

| Metric | Current |
|---|---|
| Books processed | **11** *(LOSB, Funt, MV, Sharper, Mathletics, Duke, Scorecasting, Trading Bases, Miech, Konik, Silver)* |
| Books queued | **8** *(Moya thesis, GENI 20-F, Buchdahl, Vaughan Williams, Munchkin, Appelbaum, Wong, Complete Book)* |
| Topic syntheses | **0** *(deferred — user wants more ingestion first)* |
| Content opportunities | **200+** |
| Market gaps identified | **95** |
| Cross-source conflicts | **1** *(CLV — resolved-with-reservations in LOSB's favor after Silver public confirmation)* |
| Cross-source syntheses ready to ship | **8** *(FLB coexistence + Levitt-Duke + HFA origin + MLB sharpest + Bottom-up/Top-down + 13 Habits adapted + U of event popularity + Conscientious Contrarian)* |

### Books processed and their roles in the library

| Source | Author | Year | Tier filled |
|---|---|---|---|
| The Logic of Sports Betting | Miller & Davidow | 2019 | Industry-analytical (how the business works) |
| Everybody Loses | Danny Funt | 2024-25 | Journalistic / industry critique / human cost |
| Betting Without Beta | Moskowitz & Vasudevan | 2022 | Peer-reviewed academic (Yale + NBER + AQR) — Favorite-Longshot Bias |
| Sharper | True Pokerjoe (Bennet) | 2016 | Operational-tactical (spreadsheet formulas) |
| Mathletics | Wayne Winston | 2009 | Applied-statistics academic (Princeton) — σ values, Kelly, Levitt |
| Thinking in Bets | Annie Duke | 2018 | Decision-science / brand positioning |
| Scorecasting | Moskowitz & Wertheim | 2011 | Popular-press companion to MV — HFA mechanism, hot hand debunking, coaching loss aversion |
| Trading Bases | Joe Peta | 2013 | Wall Street ↔ baseball ↔ sports-betting bridge — MV-cited; dime line; cluster luck; Pythagorean; SIERA; +41% 2011 model |
| Sports Betting for Winners | Rob Miech | 2019 | Modern Vegas pro-bettor culture source — character-per-chapter profiles; multi-pro cross-confirmation; 70-30 home-dog rule; 8-tier customer profiling; tout-industry critique |
| The Smart Money | Michael Konik | 2006 | Syndicate-operation narrative — Billy Walters insider memoir (names changed); mule economics; casino booting lifecycle; 0.0001% sustainable rate; burnout arc |
| On the Edge | Nate Silver | 2024 | ⭐⭐⭐ **Brand-positioning capstone.** The River concept; 13 Habits framework; bottom-up/top-down bettor taxonomy (Spanky Kyrollos); originator archetype (Rufus Peabody); public confirmation of LOSB market-maker/retail framework; carnival-game framing; amenity framing ($7.5B legal online vs $20B frozen pizza); DraftKings $1.2B-on-$2.2B marketing math; conscientious contrarianism; "A bet is a tax on bullshit"; concrete $1,100 BOSS-bet EV walkthrough |

### Active queue (in recommended order)

1. **Moya thesis** (~80pp) — academic, Tim Swartz supervisor (SIERA co-creator). Quick academic addition.
2. **GENI 20-F SEC filing** — data-supplier industry perspective; quick skim for industry-state callouts.
3. **Buchdahl / Fixed Odds Sports Betting** — quant tier extension; UK perspective. Likely high value.
4. **Vaughan Williams / Betting to Win** — UK academic.
5. **Appelbaum / Everything Guide** — beginner intro; useful for Path 01 mapping.
6. **Wong / Sharp Sports Betting** — likely highly redundant.
7. **Munchkin / Gambling Wizards** — interview-format; lower priority.
8. **Complete Book of Sports Betting** — 30pp quick-skim, likely dated.

### Per-source synthesis template

Every book/source gets a synthesis note in `library/notes/{slug}.md` with these sections:

1. Bibliography
2. Reading status
3. Thesis in one paragraph
4. Key frameworks / named concepts
5. Strongest claims (with evidence)
6. Examples / data points worth preserving
7. What's unique vs. other sources
8. Weak claims / limitations / criticisms
9. Where we'd extend or disagree
10. Reader pain points exposed
11. Direct quotes (paraphrased, with attribution + chapter/section refs)
12. What this source unlocks (cross-pollination)
13. Topic tags (for cross-referencing into `topics/`)
14. Pedagogical patterns (effective + what to avoid)
15. Content opportunities this source seeds
16. Market gaps this source reveals
17. Reading notes for future passes

### Workflow rhythm

For every new source:
1. Drop PDF (or paste text) into `library/source-pdfs/`
2. Extract text via `pdftotext -layout`
3. Read priority chapters / structural skim
4. Write synthesis note from the template
5. Update `INDEX.md` (status counters, key findings, conflicts, syntheses)
6. Update `content-opportunities.md` (new lessons/guides/tools/originals)
7. Git commit with a clean message summarizing the new source + cross-pollination

---

## 5. The eight cross-source syntheses ready to ship (PPS-originals)

These are PPS-original positions that **no public source has made**. All are flagship-quality content candidates.

### Synthesis #1: Favorite-bias × Longshot-bias coexist

- **Levitt 2004** (NFL spreads): squares are biased toward favorites. Books exploit this; favorites cover <50% historically.
- **Moskowitz & Vasudevan 2022** (moneylines): squares are biased toward underdogs (FLB / lottery preference).
- **Apparent contradiction:** Levitt says squares love favorites; MV says squares love underdogs.
- **PPS synthesis:** They're not contradictory. The biases coexist at *different decision points*. A square overpays for a favorite ATS *and* overpays for an underdog moneyline — same person, two biases, two markets. Books exploit both directions.
- **Content angle:** "The Two Biases You Carry to the Sportsbook"

### Synthesis #2: Decision-Quality vs Outcome-Quality / Levitt-Duke contrast

- **Annie Duke 2018:** repeats the conventional myth that "bookmakers balance action."
- **Levitt 2004 via Mathletics:** empirically refutes this — bookies earn ~6.16% per $10 by exploiting favorite-bias, ~23% above the textbook 4.55%.
- **The point:** A smart, thoughtful, decision-science author repeats a myth that peer-reviewed academic research had already debunked 14 years earlier. **The misconception is durable.**
- **Content angle:** "The Bookmaker Myth Even Smart Authors Repeat" — provocative, cite-anchored, brand-aligned.

### Synthesis #3: The Home-Field Advantage Origin Story

- **Mathletics (2009):** Empirical HFA magnitudes — NFL 3 pts, NBA 3 pts, NCAAB 4 pts. Foundational reference data.
- **Sharper (2021):** NFL HFA has compressed to ~2 pts over the decade.
- **Scorecasting (2011):** The mechanism. Crowd, travel, roster, weather all isolate to zero. The real driver is **referee bias** — ~2/3 of MLB HFA, ~75% of NBA HFA, ~83% of NHL HFA, dramatic NFL change after instant-replay introduction. The QuesTec natural experiment is the smoking gun. Driven by conformity-to-crowd (Sherif 1935), not corruption.
- **Levitt (2004) via Mathletics:** Books exploit favorite-bias for ~6% per $10. The line already prices HFA but also prices favorite-bias on top.
- **Content angle:** "The Real Reason Home Teams Win" — flagship PPS Original combining four sources into an explanation no public site has published.

### Synthesis #4: Why MLB Is the Sharpest Sport to Bet

- **Peta (2013):** MLB dime line gives ~1.78% average juice vs the 4.76% standard for NFL/NBA. As favorite price rises, juice actually decreases. The listed-pitcher rule auto-voids bets if either starter is scratched.
- **MV (2022):** FLB is **absent in MLB** (Woodland & Woodland 1994). The lottery-preference mechanism that distorts NCAAF/NCAAB/NBA/NFL moneylines doesn't trigger because MLB outcomes are closer to 50/50.
- **Mathletics via Levitt 2004:** Bookmaker favorite-bias exploitation is documented in NFL spreads, not MLB moneylines.
- **PPS synthesis:** MLB has the lowest structural house edge + no FLB + no NFL-style favorite-bias + bettor-friendly listed-pitcher rule + bettor-player incentive alignment (no spread perversity). The public bets football/basketball at 3× MLB volume — the wrong allocation for a math-minded bettor.
- **Content angle:** "Why MLB Is the Sharpest Sport to Bet — and Nobody Tells You This" — flagship PPS Original. Ties directly to PPS's existing MLB tools (Pitcher K EV / Batter Hit EV).

### Synthesis #5: Bottom-Up vs Top-Down Bettor Curriculum (NEW — Silver-enabled)

- **Spanky Kyrollos (via Silver Ch 4):** Bottom-up bettors model from data; top-down bettors assume the line is correct and find edge in arbitrage, execution, and information-not-in-the-line. The most successful pros mix both.
- **PPS synthesis:** Our library has been almost entirely bottom-up in orientation; Konik + Funt + Miech + LOSB execution chapters cover top-down but don't theorize it. Spanky's framing names the second tier explicitly. Most retail bettors should start *top-down* because the entry-level edge is more accessible than building a beat-the-line model.
- **Content angle:** "Are You a Bottom-Up or Top-Down Bettor?" diagnostic + parallel-track PPS curriculum.

### Synthesis #6: 13 Habits of the Sharp Bettor (NEW — Silver-enabled)

- **Silver Ch 13:** 13 habits distilled from interviews with astronauts, NFL players, generals, Nobel laureates, hedge funders, poker pros.
- **PPS synthesis:** Each habit maps to a sports-betting-specific worked example with cross-library citation (Duke → Habit 4; Sharper → Habit 8; Peta → Habit 1; LOSB → Habit 12; Konik → Habit 11; etc.).
- **Content angle:** "The 13 Habits of the Sharp Bettor" — flagship 13-part series OR combined piece. **Highest-leverage curriculum spine available.**

### Synthesis #7: The "U" of Edge — Event-Popularity Geography (NEW — Silver-enabled)

- **Silver Ch 4 (implicit):** Bettors find +EV at the two extremes of event popularity — obscure events (props, niche sports, Peabody's Super Bowl props) AND the most public events (Super Bowl, March Madness via public-money fading). The middle (regular TV games) is hardest.
- **PPS synthesis:** This is *event-level* geography (compatible with Synthesis #4's *sport-level* sharpness — both true, different grain).
- **Content angle:** "The Two Places You Find Edge — The Obscure and the Overhyped."

### Synthesis #8: The Conscientious Contrarian — Fading the Public with a Thesis (NEW — Silver-enabled)

- **Silver Habit 12 (Galen Hall / DFT):** Contrarianism requires a thesis about *misaligned incentives*, not just opposite-side-of-the-crowd reflex.
- **Wong / Levitt / Peta / MV:** Public bets favorites on the spread (Levitt) and underdogs on the moneyline (MV) with documented profitable fade thresholds (Peta 65%).
- **PPS synthesis:** Public money's incentives (entertainment, identity, tribalism) ≠ alpha-seeking. The thesis layer is what separates *Conscientious Contrarianism* from random contrarianism.
- **Content angle:** "The Conscientious Contrarian's Guide to Fading the Public" — most distinctive contrarian content in the betting-strategy space.

---

## 6. The one cross-source conflict actively tracked

### Conflict #1: How central is CLV to long-run profitability?

- **LOSB:** CLV ≥ half the hold over hundreds of bets is *the* predictive signal of long-run profitability. Track CLV.
- **Sharper:** CLV is partly a *deepity* (Dennett). For line grinders it's tautological (you bet because the line was off; the market converges to consensus = your CLV by construction). The closing line is NOT always the most efficient line.
- **PPS reconciliation (drafted in INDEX.md):**
  1. CLV is necessary-but-not-sufficient.
  2. Distinguish CLV-for-handicappers (legitimate skill signal) vs CLV-for-line-grinders (tautology).
  3. The closing line is not the universal efficient-frontier oracle — pre-close lines can be sharper on square-driven markets.
- **Content angle:** "What CLV actually measures (and what it doesn't)" — independent PPS position, brand-builder.

---

## 7. Current priority shortlist (content to ship)

If we shipped one thing tomorrow, ranked by (impact × differentiation × ease). **Silver re-ranks the list — the 13 Habits adaptation and the Promo-Arbitrage Playbook jump to the top.**

1. **The 13 Habits of the Sharp Bettor** (PPS Original, Synthesis #6) — Silver Ch 13 + Duke + Sharper + Peta + LOSB + Konik. **NEW #1 — highest-leverage curriculum spine available.**
2. **The Promo-Arbitrage Playbook** (PPS Original) — Silver DraftKings math + LOSB Go-For-Broke + Sharper Risk-Free + Free-Play + Deposit-Bonus Churn. **NEW #2 — most actionable retail-bettor course in the library.**
3. **The Two Sportsbooks: Market Maker vs. Retail** (Pillar guide) — LOSB + Sharper + Konik + Miech + Silver. **5-source convergence; highest-validated frame in library.**
4. **The Conscientious Contrarian's Guide to Fading the Public** (PPS Original, Synthesis #8) — Silver + Wong + Levitt + Peta + MV.
5. **PROFITPATH Decision Discipline Framework** (PPS Original) — Duke's 5-tool mental kit with LOSB/Sharper/MV/Silver citations. The signature methodology.
6. **Why MLB Is the Sharpest Sport to Bet** (PPS Original, Synthesis #4) — Peta + MV + Mathletics/Levitt. Ties to existing Pitcher K EV / Batter Hit EV tools.
7. **The Real Reason Home Teams Win** (PPS Original, Synthesis #3).
8. **River Bettor vs Village Bettor** (PPS Original) — top-of-funnel brand-positioning piece.
9. **Bottom-Up or Top-Down? Two Paths to Profit** (PPS Original, Synthesis #5) — curriculum-routing piece.
10. **The Two Places You Find Edge** (PPS Original, Synthesis #7).
11. **"Resulting: the cognitive trap every sports bettor falls into"** — pillar Path 03 lesson.
12. **The MLB Bettor's Complete Toolkit** — Peta-derived flagship MLB guide.
13. **The Hot Hand Triple-Source Debunking**.
14. **The Hold Chopper** calc + guide.
15. **The CLV Reconciliation** — Conflict #1 (now resolved-with-reservations in LOSB's favor post-Silver).
16. **The Two Biases You Carry to the Sportsbook** — Synthesis #1.
17. **The Bookmaker Myth Even Smart Authors Repeat** — Synthesis #2.
18. **Foundational tools cluster** — Vig-Free Line + Push Frequency + Bet Review Worksheet + HFA-by-League Reference + Pythagorean Wins Calc + Dime Line Juice Calc + Cluster Luck Detector.

User has explicitly deferred shipping any of this until more library ingestion is complete. **Don't ship without checking in with the user first.**

---

## 8. Hard constraints / preferences

### Sports we cover
- **In:** NFL, NBA, NCAAF, NCAAB, MLB, NHL, golf, MMA, boxing
- **Out:** **Soccer.** User doesn't bet it and doesn't understand it. Don't waste content slots, tools, or examples on soccer. If a library source is soccer-heavy (e.g., Buchdahl's *Monte Carlo or Bust*), deprioritize or skim only for the universal math.

### Copyright posture
- **Paraphrase + cite, never reproduce verbatim text** from any source.
- Direct quotes only sparingly, always with attribution + chapter/section ref.
- This is non-negotiable.

### Voice / tone
- Calibrated uncertainty as brand signal. PPS embraces "I'm not sure" as a strength.
- Brutal honesty about edges, limits, what we don't know.
- Pop-culture-fluent hooks (Annie Duke style) — open with a story, name the concept, deliver the math.
- **Never** tout-style language: no "lock of the week," "can't lose," "I see this clearly," "sharp money is hammering this."
- The CUDOS norms (communism / universalism / disinterestedness / organized skepticism) are PPS's published intellectual standard.

### Brand-aligned pedagogical patterns (from across the library)
- **Open with a pop-culture or anecdote hook** (Duke style)
- **Name every concept** (Resulting, Chopping the Hold, Ban-or-Bankrupt, The Two Biases)
- **Show your work** — pasteable Excel/sheet formulas where applicable (Sharper, Mathletics style)
- **Cite primary sources by name + paper title + year** (Mathletics style)
- **Sensitivity tables as reference content** (Mathletics's Kelly table)
- **"Don't talk or think like this" corrective dialogues** (Sharper style)
- **Statistical-significance discipline** — attach confidence intervals or sample-size caveats to claims
- **Worked numerical examples** with intermediate steps

### Pedagogical patterns to *avoid*
- Acerbic-dogmatic gatekeeping (some of Sharper's voice)
- Inline raw academic formulas in narrative (Mathletics's worst habit)
- Heavy academic phrasing ("we conclude," "we therefore")
- Square/sharp binary as the *only* axis (use LOSB's 1-5 sharpness scale instead)
- Aging pop-culture references
- Self-help patter
- Inline tinyurls or rotted-link citations

---

## 9. Key brand assets the library has unlocked

These are the named concepts / frameworks PPS can use as content pillars:

1. **Resulting** (Duke) — confusing decision quality with outcome quality
2. **Chopping the Hold** (LOSB) — start with the book's hold, subtract via shopping/angles/cross-derivative comparison
3. **The Ban-or-Bankrupt Equilibrium** (LOSB + Funt — Walker quote — + MV) — the bookmaker business model
4. **The Two Biases** (Levitt + MV synthesis) — favorite-bias on the spread + longshot-bias on the moneyline
5. **Go-For-Broke Bonus Method** (LOSB) — counter-intuitive math-proven deposit-bonus strategy
6. **The Hold Chopper** (LOSB) — tool name + concept pairing
7. **Sportsbook Tier-Map** (LOSB + Sharper) — market-maker vs retail-book taxonomy
8. **Price is not Juice** (Sharper) — operational reframe
9. **The 5-Tool Mental Discipline Kit** (Duke) — 10-10-10, Ulysses contracts, decision swear jar, scenario planning, backcasting, premortem
10. **Calibrated Uncertainty** (Duke + Sharper) — brand-aligned counter to lock-of-the-week culture
11. **Fielding outcomes** (Duke) — skill bucket vs luck bucket
12. **The CUDOS Norms** (Duke via Merton) — PPS's published intellectual standard
13. **The River** (Silver) — community of probabilistic risk-takers; PPS-readable identity vocabulary
14. **The 13 Habits of Highly Successful Risk-Takers** (Silver) — packaged framework PPS can adapt as a 13-part curriculum spine
15. **Bottom-Up vs Top-Down Bettor** (Silver via Spanky) — cleanest field-level typology
16. **Conscientious Contrarianism** (Silver via Galen Hall/DFT) — fade-the-public-with-a-thesis framing
17. **The "U" of Edge** (Silver implicit) — event-popularity geography of profitable bets
18. **The Carnival Game / Amenity / Market-Maker-vs-Retail** (LOSB via Silver public confirmation) — sportsbook business-model vocabulary
19. **"A Bet Is a Tax on Bullshit"** (Silver) — PPS brand-voice accountability statement
20. **The Honest Pro ROI Ceiling** (Silver/Spanky 2-3% on dollars bet; multi-source calibration synthesis)

---

## 10. Key empirical facts in the vault (foundational reference data)

### Sport σ values (margin standard deviation about prediction)
- NFL: **13.86** (Stern 1991, *American Statistician*)
- NBA: **12** (Sagarin)
- NCAA basketball: **10** (Sagarin)
- College football: **16** (Sagarin)
- All from Mathletics Ch 43.

### Home edges (2009-era; compression noted)
- NFL: 3 pts (Mathletics) → 2 pts (Sharper, 2021) — compressed over 12 years
- NBA: 3 pts
- College football: 3 pts
- NCAA basketball: 4 pts

### Bookmaker actual hold (Levitt 2004 NFL data)
- Textbook 4.55% theoretical (balanced action)
- Actual ~6.16% per $10 (~23% above textbook) by exploiting favorite-bias

### Break-even win rate at -110
- 52.4%

### Teaser data (Wong via Mathletics)
- 7-pt teaser: covered 70.6% / pushed 1.5% / lost 27.9% over 2000-2005

---

## 11. The "where to pick up" decision tree

When you return to this project, the next move depends on user input. Three paths are live:

### Path A: Continue library ingestion (current default)
**Next book: Scorecasting (Moskowitz & Wertheim, 2011).** Reasoning: same Moskowitz as our peer-reviewed pillar; popular-press companion to his academic work; easiest lateral add. After that: Trading Bases, then Miech, then Konik.

### Path B: Spin up topic syntheses
User has explicitly deferred this ("I really not interested in 2 or 3 until we have way more info"). Don't start topic syntheses without checking in. When the time comes, the most-ready topics are:
- `closing-line-value` (Conflict #1 reconciliation)
- `bonus-conversion` (combined LOSB + Sharper Promo Grind)
- `account-profiling` (LOSB + Funt + Sharper triangulation)
- `psychology-of-the-bettor` (Funt + MV + Sharper + Duke)
- `favorite-longshot-bias` (MV primary)
- `resulting` + `decision-quality-vs-outcome-quality` (Duke primary)

### Path C: Ship flagship content
User has explicitly deferred shipping. Don't ship without checking in. When the time comes, the priority shortlist (Section 7 above) is the menu.

### Other in-flight tasks (also deferred until user calls them up)
- Phase D-E homepage rebrand
- Sweep of remaining tool/lesson pages
- MailerLite integration (waiting on user setup)
- `/research/` landing page + PDF export
- Triple Stack + Parlay Smart Way re-feature (after vetting)

---

## 12. How to use this brief

**If you're returning to the project:**
1. Read this whole document.
2. Read `library/INDEX.md` for current library state.
3. Read `library/content-opportunities.md` for the pipeline.
4. Check git log: `git log --oneline -10` to see what's happened recently.
5. Ask the user which path (A/B/C above) they want to pursue.

**If you're starting a fresh Claude conversation:**
1. Paste this brief as your opening context.
2. Tell Claude: "Read this brief, then read `library/INDEX.md` and `library/content-opportunities.md`, then check git log for recent activity. Ask me which path I want to pursue."

**If you're handing off to a collaborator:**
1. Have them read this brief first.
2. Then `library/INDEX.md`.
3. Then 1-2 sample synthesis notes (recommended: `mathletics-winston.md` and `thinking-in-bets-annie-duke.md` — they illustrate the range from rigorous-quantitative to mass-market-conceptual).
4. Then `content-opportunities.md`.

---

## 13. Project commitments (things we've said we'll do)

- Maintain the library as a living document — every new source updates INDEX + opportunities + commits
- Paraphrase + cite, never reproduce
- Track cross-source conflicts explicitly with PPS reconciliation positions
- Surface cross-source syntheses (where two sources combine to produce a position neither makes alone)
- Build the brand around decision clarity, not picks
- Stay out of soccer
- Don't ship without user sign-off
- Don't start topic syntheses without user sign-off

---

*This brief is itself a living document. Update it after meaningful project milestones — every 2-3 new books processed, after major decisions, after shipping flagship content.*
