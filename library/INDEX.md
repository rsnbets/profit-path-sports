# PPS Library — Master Index

The living document that synthesizes everything PROFITPATH knows about modern sports betting. **Updated every time a book is read.** This file is the single entry point — start here.

> **Purpose:** Capture the state of the field across every credible source, identify gaps and conflicts in public knowledge, and surface PPS's unique positioning opportunities. Long-term, this index *is* the table of contents of the PPS book.

---

## Library status

| Metric | Current |
|---|---|
| Books processed (priority chapters complete) | **2** *(LOSB + Funt partial)* |
| Books queued in `source-pdfs/` | **3** *(Wong, Konik, Appelbaum)* |
| Topic syntheses written | **0** *(spinning up after Funt Ch 10 + 11)* |
| Content opportunities in pipeline | **35+** *(14 lessons / 12 guides / 10 tools / 5 originals)* |
| Market gaps identified | **18** |

**Last update:** Everybody Loses (Danny Funt) — Intro + Ch 1 (Original Sin, partial) + Ch 5 (Winners Not Welcome, deep). Note at `notes/everybody-loses-danny-funt.md`. **Key finding: Funt explicitly names "ban or bankrupt" as the industry's operating model via Nevada bookmaker Robert Walker — direct validation of the PROFITPATH research paper's framework.** Funt's PointsBet trader interviews + DraftKings CEO/employee quotes + the author's own beard experiment confirm LOSB's analytical claims from the outside. Remaining Funt chapters (Ch 10 We Have a Problem + Ch 11 The House Doesn't Always Win + Ch 1 finish) pending next session.

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
| The Logic of Sports Betting | Miller & Davidow | 2019 | **priority chapters + pedagogy complete** | Strong on industry structure, profiling, market making, props, marketing, hold-chopping, weak markets, CLV. Secondary chapters (Public Money, Angles, Multiway, etc.) pending later pass. |
| Everybody Loses | Danny Funt | recent | **highest-priority chapters complete** (Intro + Ch 1 partial + Ch 5 deep) | Strong on industry critique, ban-or-bankrupt naming, PASPA history, profiling/limiting first-person accounts, league hypocrisy, beard economy. Remaining 8 chapters pending. |

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

*(Each new book will surface more. Migration to `content-opportunities.md` happens as items mature.)*

### Frameworks PPS is synthesizing or extending

Original or extended frameworks that emerge from cross-source synthesis (not just lifted from any one book):

1. **The Ban-or-Bankrupt Equilibrium** — Phrase derives from journalism (ESPN reporting); we formalize it as a model of how retail books balance profit against winning bettors. PPS contribution: naming the equilibrium, mapping its components, defining its instability conditions. *(In progress — will firm up as Funt + Interception material is added.)*

*(Will grow as we synthesize across more books.)*

---

## Library structure (file map)

```
library/
├── INDEX.md                       ← this file, the entry point
├── README.md                      ← documentation: template, workflow, copyright posture
├── content-opportunities.md       ← shippable content pipeline (with status tags)
├── source-pdfs/                   ← raw PDFs (gitignored)
├── notes/                         ← per-book synthesis files
│   └── logic-of-sports-betting-miller-davidow.md
├── topics/                        ← cross-book topic syntheses (empty for now)
└── our-book/                      ← eventual public manuscript (long-term)
```

---

## Active topic queue

Topics that will get their own `topics/{topic}.md` synthesis once we have 2-3+ books touching them:

| Topic slug | Books contributing | Status |
|---|---|---|
| `industry-structure-and-regulation` | LOSB ✓ · Funt (queued) | 🔵 needs 2nd source |
| `account-profiling` | LOSB ✓ · Funt (queued) · Wong (queued) | 🔵 needs 2nd source |
| `pricing-inefficiencies` | LOSB ✓ · Wong (queued) · *Interception* (future) | 🔵 needs 2nd source |
| `market-making-and-price-discovery` | LOSB ✓ | 🔵 needs 2nd source (Wong should help) |
| `closing-line-value` | LOSB ✓ | 🔵 needs 2nd source (Wong, Appelbaum) |
| `chopping-the-hold` | LOSB ✓ | 🔵 unique to LOSB so far |
| `weak-vs-strong-markets` | LOSB ✓ | 🔵 needs Wong corroboration |
| `props-and-derivatives` | LOSB ✓ | 🔵 needs 2nd source |
| `bonus-conversion` | LOSB ✓ (go-for-broke math) | 🔵 PPS in-house knowledge fills out the practical side |
| `in-play-betting-and-delay` | LOSB ✓ | 🔵 needs Funt corroboration |
| `dark-patterns-behavioral-design` | LOSB ✓ (in-play delay only) | 🔵 main material expected from Funt + Scientific American |
| `parlays-and-sgps` | LOSB ✓ · Wong (queued) | 🔵 needs 2nd source |
| `psychology-of-the-bettor` | LOSB (light) | 🔵 needs Funt + academic papers |
| `industry-fragility` | LOSB ✓ | ⚪ unique to LOSB so far |
| `expected-value-foundations` | LOSB ✓ · Wong/Appelbaum (queued) | 🔵 needs 2nd source |
| `devig-methods` | LOSB (light) | 🔵 needs deeper source |
| `kelly-criterion-and-sizing` | (not yet covered in depth) | 🔵 needs Wong + dedicated source |

---

## Next moves (set by current state)

1. ✅ ~~Finish Logic of Sports Betting priority chapters.~~ (Complete — all 7 priority chapters synthesized.)
2. **Process Everybody Loses (Funt)** — opens the industry-critique angle. Will unlock topic syntheses for `account-profiling`, `dark-patterns-behavioral-design`, `industry-structure-and-regulation`.
3. **Then Sharp Sports Betting (Wong)** — older-era foundational math. Will corroborate / contrast LOSB on market making, parlays, devig, Kelly.
4. After 2-3 books done, spin up first `topics/` syntheses on the most cross-referenced subjects.
5. After 3-5 books done, re-rank `content-opportunities.md`. The current shortlist (Hold Chopper, Go-For-Broke Bonus Method, Market-Makers-vs-Retail guide, Tier-Map) is already strong enough to potentially ship something from the LOSB material alone.
6. After ~10 books processed: the index is mature enough to draft the Ban-or-Bankrupt paper from the synthesis (not from any one source).

---

*This index is a living document. Every session that touches the library updates it. As the library grows, the field-state sections grow with it — and eventually become the spine of PPS's own book.*
