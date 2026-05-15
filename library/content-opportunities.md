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
| How sportsbook prices actually get made (the 3 methods) | LOSB ch. Market Making | 🟢 | Newbie-friendly, viral-friendly |
| What "sharp money pounding the line" really means | LOSB ch. Market Making | 🟢 | Brief debunker piece |
| Why parlays don't actually "hold more" — they amplify volume | LOSB ch. Parlays | 🟢 | Counter-intuitive math reframe |
| How books grade you (the 1-5 sharpness scale) | LOSB ch. Sportsbook Business Models | 🟡 | Don't overclaim it's a literal system; teach the framework |

## Guides (deep-dive pages)

| Title | Source(s) | Status | Notes |
|---|---|---|---|
| Market makers vs retail books — and why it matters where you bet | LOSB ch. Sportsbook Business Models | 🟢 | 9-dimension cross-tab + practical implications |
| The copy-chain fragility — most prices are reflections of one price | LOSB ch. Market Making | 🟢 | Includes integrity-monitoring angle |
| Why a 0.25% federal tax structurally kills market making | LOSB ch. Sportsbook Business Models | ⚪ | Policy-adjacent, narrower audience |
| **The Ban-or-Bankrupt Equilibrium** (research paper + digestible guide) | LOSB + Funt (pending) + others | 🟡 | Already in roadmap |

## Tools / calculators

| Tool | Source(s) | Status | Notes |
|---|---|---|---|
| **Sportsbook Tier-Map** (market-maker vs retail visualization, maintained) | LOSB ch. Sportsbook Business Models | 🟡 | High value; needs ongoing maintenance |
| **Parlay True Volume Calculator** (exposes parlay-as-volume-amplifier math) | LOSB ch. Parlays | 🟢 | Could extend the existing Parlay Calculator |
| **Sharpness Profile Diagnostic** (input betting history → estimate 1-5 score) | LOSB ch. Sportsbook Business Models | ⚪ | Engaging hook but hard to validate without real data |

## PPS Originals (in-house content with no public equivalent)

| Title | Source(s) | Status | Notes |
|---|---|---|---|
| The Ban-or-Bankrupt Equilibrium (paper + guide) | LOSB + Funt + journalism | 🟡 | Flagship research piece |
| How sportsbooks decide what to charge for the bet you want | LOSB Market Making | 🟢 | 1500-word plain-English explainer |

## Market gaps identified

Things this library has surfaced that **nothing public explains well**:

1. **Market-maker vs retail-book business model dichotomy** — completely absent from public sportsbook review/comparison content. Every comparison rates on features/promos; nobody mentions that the underlying business model determines whether *you'll get limited*. Massive gap.
2. **Lines are mostly copied, not independently set** — almost never surfaced for general bettors. Reframes how to think about line movement.
3. **The 1-5 sharpness profiling system** — privately known among sharps and pros, but the public bettor has no idea where they sit or what moves them on the scale.
4. **Parlay-volume math** — the standard "don't play parlays they hold 12.5%" advice is wrong-in-mechanism. Right framing (volume amplification) is missing from public discourse.

---

## Re-rank cadence

After every 3-5 books processed:
1. Pull each new note's "Content opportunities" section into the appropriate table above
2. Re-rank by confidence + market-gap size
3. Pick the top 1-2 🟢 items to ship next as PPS content
4. Decide whether any 🟡 items have enough source material to graduate to 🟢

After 10 books processed: build the first `library/topics/` syntheses around the most cross-referenced topic tags. Those become the source of truth for the corresponding content pieces.
