# PPS Content Opportunities Pipeline

Rolled up from every `notes/` synthesis. As we process more books, this file grows. After every 3-5 books processed, we re-rank and use it to decide what to ship next.

**How items get here:** each book's note has a `Content opportunities this book seeds` section. As notes get committed, the strongest items (HIGH confidence, validated by multiple sources, or clearly market-gap-filling) migrate up to this master list.

**Status legend:**
- 🟢 **Ready** — enough source material to ship; just needs writing/building
- 🟡 **Forming** — promising but wants another book or two of validation
- 🔵 **Researching** — surfaced but needs deeper investigation
- ⚪ **Speculative** — interesting idea, may or may not pan out

---

## Lessons (curriculum)

| Title | Source(s) | Status | Notes |
|---|---|---|---|
| How sportsbook prices actually get made (the 3 methods) | LOSB Market Making | 🟢 | Newbie-friendly, viral-friendly, demolishes Vegas-oracle myth |
| What "sharp money pounding the line" really means | LOSB Market Making | 🟢 | Brief debunker piece |
| Why parlays don't actually "hold more" — they amplify volume | LOSB Parlays | 🟢 | Counter-intuitive math reframe |
| How books grade you (the 1-5 sharpness scale) | LOSB Sportsbook Business Models | 🟡 | Teach the framework, don't overclaim literal scale |
| Market agreement and resistance — why CLV matters | LOSB Strong vs Weak Markets | 🟢 | Practical: if other sharps disagree, you're probably wrong |
| Attack weak markets — where edges actually live | LOSB Strong vs Weak Markets | 🟢 | The operating mantra |
| Why 60% hit rate is the wrong goal | LOSB Chopping the Hold | 🟢 | Counter-intuitive: edge net of hold matters, not hit rate |
| Bet during timeouts only (defeats the in-play delay) | LOSB Sportsbook Marketing | 🟢 | Actionable tactical lesson |
| The "go for broke" deposit-bonus method | LOSB Sportsbook Marketing | 🟢 | Counter-intuitive but math-proven; brand-aligned |
| The free play longshot rule | LOSB Sportsbook Marketing | 🟢 | Trivial math, almost never explained publicly |

## Guides (deep-dive pages)

| Title | Source(s) | Status | Notes |
|---|---|---|---|
| Market makers vs retail books — and why it matters where you bet | LOSB Sportsbook Business Models | 🟢 | 9-dim cross-tab + practical "find your book's tier" |
| The copy-chain fragility | LOSB Market Making | 🟢 | Most prices are reflections; integrity-monitoring weakness |
| The 6-step process for finding +EV in props and derivatives | LOSB Props chapter | 🟢 | Miller's framework in PPS voice |
| **Chopping the Hold: the master strategy** | LOSB Chopping the Hold | 🟢 | Could be a flagship strategy guide — unifies many tactics |
| Why your in-play bet takes 8 seconds to confirm (and what to do) | LOSB Sportsbook Marketing | 🟢 | Exposé content; names pattern without naming books |
| In-play modeling errors by sport | LOSB Sportsbook Marketing (p211 chart) | 🟡 | Long-tail SEO; sport-by-sport content |
| Why a 0.25% federal tax structurally kills market making | LOSB Sportsbook Business Models | ⚪ | Policy-adjacent, narrower audience |
| **The Ban-or-Bankrupt Equilibrium** (research paper + digestible guide pair) | LOSB + Funt (pending) + journalism | 🟡 | Already in roadmap; firms up after Funt processed |

## Tools / calculators

| Tool | Source(s) | Status | Notes |
|---|---|---|---|
| **Sportsbook Tier-Map** (market-maker vs retail visualization, maintained) | LOSB Sportsbook Business Models | 🟡 | High value; needs ongoing maintenance |
| **The Hold Chopper** (synthetic market comparer) | LOSB Chopping the Hold | 🟢 | Paste prices from multiple books/related markets → returns lowest-hold synthetic. Could be flagship-quality, alongside Bet X-Ray |
| **Bonus Strategy Selector** (grind vs go-for-broke) | LOSB Sportsbook Marketing | 🟢 | Input offer details → compares expected returns. Easy build |
| **Free Play Longshot Picker** | LOSB Sportsbook Marketing | 🟢 | Trivial calc; great SEO ("free play strategy") |
| Parlay True Volume Calculator | LOSB Parlays | 🟢 | Extends existing Parlay Calculator |
| **In-Play Delay Detector** | LOSB Sportsbook Marketing | 🟡 | Times submit-to-confirm gap at chosen book. Needs API/extension |
| CLV Performance Tracker (with the "half the hold" benchmark) | LOSB Strong vs Weak Markets | 🟢 | Already partly in Bet Tracker; emphasize the threshold |
| Sharpness Profile Diagnostic | LOSB Sportsbook Business Models | ⚪ | Engaging hook, hard to validate |

## PPS Originals (in-house content no one else publishes)

| Title | Source(s) | Status | Notes |
|---|---|---|---|
| The Ban-or-Bankrupt Equilibrium (paper + guide) | LOSB + Funt + journalism | 🟡 | Flagship research piece |
| How sportsbooks decide what to charge for the bet you want | LOSB Market Making | 🟢 | 1500-word plain-English explainer |
| **The Hold Chopper** (calc + guide pair) | LOSB Chopping the Hold | 🟢 | Original-quality, sits alongside Bet X-Ray |
| **The Go-For-Broke Bonus Method** | LOSB Sportsbook Marketing | 🟢 | Counter-intuitive math + accompanying calc; brand-aligned |

## Market gaps identified

Things this library has surfaced that **nothing public explains well**:

1. **Market-maker vs retail-book business model dichotomy** — completely absent from public sportsbook review/comparison content. *(LOSB)*
2. **Lines are mostly copied, not independently set** — rarely surfaced for general bettors. *(LOSB)*
3. **The 1-5 sharpness profiling system** — privately known among sharps; recreationals have no idea. *(LOSB)*
4. **Parlay-volume math** — common advice is wrong-in-mechanism. Right framing missing publicly. *(LOSB)*
5. **CLV specific benchmark (>50% of the hold over hundreds of bets)** — everyone says "track CLV"; nobody says "at what level CLV predicts profitability." *(LOSB)*
6. **"Attack weak markets" as a thesis** — operating principle of every winning bettor, almost never explicitly explained. Most public guides teach NFL/NBA, the strongest markets. *(LOSB)*
7. **In-play 4-8s sportsbook delay** — widely experienced, almost never named. *(LOSB)*
8. **Go-For-Broke deposit-bonus math** — provably correct, runs against universal "grind it out" advice. **Brand-aligned, contrarian, high-clickability.** *(LOSB)*
9. **Chopping-the-Hold as a unified mental model** — sharp bettors apply intuitively; novices never learn the framework. *(LOSB)*
10. **Free play longshot rule** — trivial math, rarely explained. *(LOSB)*

---

## Re-rank cadence

After every 3-5 books processed:
1. Pull each new note's "Content opportunities" section into the appropriate table above
2. Re-rank by confidence + market-gap size
3. Pick the top 1-2 🟢 items to ship next as PPS content
4. Decide whether any 🟡 items have enough source material to graduate to 🟢

After 10 books processed: build the first `library/topics/` syntheses around the most cross-referenced topic tags. Those become the source of truth for the corresponding content pieces.

## Current priority shortlist (LOSB-only state)

If we shipped one thing from this pipeline tomorrow, top candidates ranked by ratio of (impact × differentiation × ease):

1. **The Hold Chopper calc + guide** — flagship-quality PPS Original, fills a major framework gap, builds on existing PPS calculator credibility
2. **The Go-For-Broke Bonus Method** (guide + calc) — counter-intuitive, brand-aligned, viral potential, fills #8 gap
3. **"Market makers vs retail books"** guide — fills the biggest market gap (#1), high SEO potential
4. **The Sportsbook Tier-Map** tool — directly actionable, builds the moat (no one else has this)
5. **"How sportsbook prices actually get made"** lesson — Path 01 staple, demolishes a myth a lot of bettors hold
