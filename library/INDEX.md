# PPS Library — Master Index

The living document that synthesizes everything PROFITPATH knows about modern sports betting. **Updated every time a book is read.** This file is the single entry point — start here.

> **Purpose:** Capture the state of the field across every credible source, identify gaps and conflicts in public knowledge, and surface PPS's unique positioning opportunities. Long-term, this index *is* the table of contents of the PPS book.

---

## Library status

| Metric | Current |
|---|---|
| Books processed (full synthesis) | **0** |
| Books processed (partial — priority chapters) | **1** *(Logic of Sports Betting)* |
| Books queued in `source-pdfs/` | **5** |
| Topic syntheses written | **0** *(starts after 3-5 books processed)* |
| Content opportunities in pipeline | **9** |
| Market gaps identified | **4** |

**Last update:** First synthesis pass on Logic of Sports Betting (Miller & Davidow, 2019). See `notes/logic-of-sports-betting-miller-davidow.md`.

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
| The Logic of Sports Betting | Miller & Davidow | 2019 | **partial — priority chapters complete** | Strong on industry structure, profiling, market making; pending: marketing, props, angles, chopping the hold |

### Queued (in `source-pdfs/`, not yet processed)

| Book | Authors | Year | Pages | Why we have it |
|---|---|---|---|---|
| Everybody Loses | Danny Funt | recent | 298 | Journalism / industry critique — dark-side angle, real cases |
| Sharp Sports Betting | Stanford Wong | 2009ish | 355 | Classic foundational math, older-era cross-reference |
| The Smart Money | Michael Konik | 2006 | 355 | Syndicate narrative, Billy Walters era authority |
| The Everything Guide to Sports Betting | Josh Appelbaum | recent | 335 | Beginner intro — curriculum source for Path 01 |

---

## Field state assessment

Updated after every book read. This is the "where does sports betting knowledge stand publicly" snapshot.

### What's well-established (multi-source consensus, when we have multiple sources)

*(Will populate as multiple books confirm overlapping findings. After Logic of Sports Betting alone, this section reads as single-source claims.)*

- Sportsbook line-making relies heavily on copying from market makers, not independent pricing at every book. *(Source: LOSB; expected confirmation from Wong, Interception.)*
- Market makers and retail books operate as fundamentally different business models. *(LOSB)*
- Customer profiling for sharpness is standard practice at both market makers (to set prices) and retail books (to limit winners). *(LOSB)*
- Sports betting is a multiplayer adversarial game, structurally unlike casino games. *(LOSB)*

### Where sources conflict (cross-source reconciliations)

*(Empty for now — populated as more books are read and disagreements surface.)*

**Tracking template (used when we find one):**
- **Claim:** [what one source says]
- **Source A:** [book, page]
- **Source B:** [book, page, contradictory framing]
- **PPS reconciliation:** [our position + reasoning]

### Gaps in public content (PPS opportunities to be the first/best)

1. **The market-maker vs. retail-book dichotomy** — completely absent from public sportsbook comparison content. Every comparison site rates on features/promos, never on business model. **Massive gap.** *(Surfaced from LOSB.)*

2. **Lines are mostly copied, not independently set** — public betting media frames every line move as unique market intelligence; reality is one market-maker's price propagating through the system. *(LOSB.)*

3. **The 1-5 sharpness profiling system** — sharps know they get tagged; recreationals have no idea. Nobody publicly explains the spectrum, what moves you on it, or what to do about it. *(LOSB.)*

4. **Parlay-volume math** — the common "don't play parlays they hold 12.5%" advice is wrong-in-mechanism. The right framing (parlays multiply effective betting volume, not edge) is missing from public discourse. *(LOSB.)*

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
| `industry-structure-and-regulation` | LOSB ✓ · Funt (queued) | 🔵 needs 2nd source before synthesis |
| `account-profiling` | LOSB ✓ · Funt (queued) · Wong (queued) | 🔵 needs 2nd source |
| `pricing-inefficiencies` | LOSB ✓ · Wong (queued) · *Interception* (future) | 🔵 needs 2nd source |
| `expected-value-foundations` | LOSB ✓ · Wong (queued) · Appelbaum (queued) | 🔵 needs 2nd source |
| `parlays-and-sgps` | LOSB ✓ · Wong (queued) | 🔵 needs 2nd source |
| `psychology-of-the-bettor` | LOSB (light) · academic papers (separate track) | 🔵 needs Funt + dark-patterns research |
| `industry-fragility` | LOSB ✓ | ⚪ unique to LOSB so far |
| `dark-patterns-behavioral-design` | (not yet covered) | 🔵 pending Funt + Scientific American material |
| `closing-line-value` | (not yet covered in depth) | 🔵 pending |
| `devig-methods` | LOSB (light) | 🔵 needs deeper source |
| `kelly-criterion-and-sizing` | (not yet covered in depth) | 🔵 needs Wong + dedicated source |

---

## Next moves (set by current state)

1. Finish Logic of Sports Betting priority chapters (Marketing, Chopping Hold, Strong/Weak, Props).
2. Process Everybody Loses (Funt) — opens the industry-critique angle and unlocks topic syntheses for `account-profiling` and `dark-patterns-behavioral-design`.
3. After 2 books done, spin up first `topics/` syntheses on the most cross-referenced subjects.
4. After 3-5 books done, re-rank `content-opportunities.md` and pick the first 🟢 items to ship as actual PPS content (lessons, guides, tools).
5. After ~10 books processed: the index is mature enough to draft the Ban-or-Bankrupt paper from the synthesis (not from any one source).

---

*This index is a living document. Every session that touches the library updates it. As the library grows, the field-state sections grow with it — and eventually become the spine of PPS's own book.*
