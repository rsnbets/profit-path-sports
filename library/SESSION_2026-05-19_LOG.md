# PROFITPATH — Session Log, May 18–20, 2026

A long session. ~41 commits pushed, four library books added, and the competitive map of the entire space drawn. This file is a recap for next-session pickup.

---

## 1. Site / UX work — what shipped

### Lesson 01 — *Reading the Odds* — major rewrite
The biggest pedagogy fix of the session. The original lesson dropped jargon (spread, total, prop, parlay) and used a confusing two-table format.

- **Rewritten for a true beginner** (commit `40c39b6`). Removed all undefined jargon. "Moneyline" is now the only term of art, and it's *defined* the first time it appears. Cut the confusing second "$100 flat bet" math-block — one clean math-block per section + one sentence on scaling.
- **Clarified that $100 is just an example** (`2c48996`) — explicit qualifier that the reader can bet any amount; $100 is the reference number for clean math.
- **Fixed misleading "price tells you what to bet" wording** (`458c1d0`) — the price doesn't dictate the stake; it sets the risk-to-reward ratio. The bettor always chooses the amount.
- **Added an interactive mini payout calculator** (`e59f67c`) — new "Now try it yourself" section between the plus/minus chapters. Type a bet amount + odds, see profit and total return live. Accepts American or decimal. Closes with a challenge: *"Make the profit land on exactly $100 — first with a favorite, then with an underdog."* Forces the reader to feel the asymmetry.

### New: **Betting Glossary** page (`ece4ba4`, `e710bd8`)
A standalone A–Z reference page — `/glossary.html`. 42 terms in plain English, jump-index bar, each term that has a full lesson links to it. Added to the sidebar nav across all 65 pages. Fills the only real Tier-1 gap a competitor like AceOdds had on us.

### New: **Prop Bets lesson** (`c5e6ce6`, `f066929`)
New Path 01 concept page after Parlays — `learn-props.html`. Covers: what a prop is, the line-notation trap (your example: "17+" = "Over 16.5"), the half-point-vs-whole-number push trap (with a clear table), why discrete stats don't land on every number, why props are the softest market on the board but also the fastest path to limits. Green Key Point ("Props Are Soft, Not Free"). Nav link propagated sitewide.

### Path 01 — full v2 conversion
- **All 6 lessons converted** (`86ffe20`) — Path 01 is now entirely v2 (gradient hero, 3-line sub, modern palette).
- **Parlays & SGPs lesson** rebuilt in v2 (`1405628`) — and corrected the compounded-vig table (4-leg now −17.0%, 8-leg −31.1%, matching `0.9545ⁿ` exactly).
- **Path 01 overview** (`lane-new.html`) rebuilt in v2 (`0b69575`) — gradient title, 6 numbered step cards, CTA into Lesson 01.

### Calculators — beginner-language treatment rolled out (`4eb7a11`)
All 7 v2 calculators (Hedge, Middle, Arb, EV, Devig, Kelly, Odds) now have:
- A cyan **"In Plain English" intro block** under the title — one jargon-free sentence on what the tool does.
- **Linked glossary terms** — dashed-underline jargon that pops a definition card on hover/tap AND links to the full lesson. Pure-CSS, with a small JS edge-clamp so the tooltip never overflows the viewport.
- **Plainer copy** throughout — reworked the Hedge callout/Key Point especially.
- Bundled fixes: the Hedge → Futures-lesson backlink, the Middle Calculator's NFL middle hit-rate corrected to 6–9% (was wrong at 1–3%, contradicting the lesson).

### Homepage / brand
- **Tagline established:** *"Bet with your gut, fall in a rut. Bet with the math, follow the path."* — leads the homepage meta/social description (`3425881`) and sits as a two-line mantra under "The toolbox." heading on the homepage (`8ffa397`), with the "gut" line dim and the "math" line green.
- **Toolbox section cleanup** (`6a98504`) — moved off DM Serif Display; dropped the period; rewrote the sub as a centered 3-line outline.
- **Homepage section titles** all moved off DM Serif to Space Grotesk gradient (`328a89d`, `c1e9f49`, `9adb3f5`, `795cca6`). The hero headline keeps DM Serif. Path-card titles (Begin/Convert/Maintain) kept DM Serif too (they're color-coded, gradient would clash).

---

## 2. Library — books added (4)

The PPS Library is now at **16 synthesized books**, up from 13 at session start. All notes are in `library/notes/` and committed.

| Book | Note | Why it matters |
|---|---|---|
| **Buchdahl — *Fixed Odds Sports Betting*** | `fixed-odds-sports-betting-buchdahl.md` (`861923c`) | The analytical backbone for +EV / vig / Kelly. Confirms our formula `K = (E−1)/(O−1)` exactly. Surfaced a strong contrarian finding: naive odds-comparison "value betting" *lost* 6.4% over 2,256 real games (favorite-longshot bias). |
| **Appelbaum — *The Everything Guide to Sports Betting*** | `everything-guide-to-sports-betting-appelbaum.md` (`720aea2`) | Curriculum-mapping reference (closest analogue to what PPS is building). Flagged the **methodological conflict**: his "fade the public / bet under 35%" rule is the Sports Insights school, contested by LOSB/Buchdahl who treat it as priced-in folk wisdom. Borrow his teaching, scrutinise his method. |
| **Manteris — *The Bookie*** | `the-bookie-manteris.md` (`eca05fa`) | The library's only behind-the-counter voice. **A 40-year Vegas head bookmaker confirms the sharp offshore books (Betcris/Pinnacle/5Dimes) set the true line and Vegas follows** — direct authority for PPS's "devig a sharp book" method. Plus bookmaker economics (books court six-figure losers, limit winners) and a measured "too big, too fast, too loose" post-PASPA critique. |
| **LOSB note — author update** | appended to `logic-of-sports-betting-miller-davidow.md` (`7569110`) | Captures Ed Miller's *Interception* (2023) + sportshandle interview: limiting triggered by sustained profit not volume; "hold % is a useless book-quality metric"; the palpable-error rule; Prime Sports as the anti-limiting business model. |

**Parked for next session:** Sklansky's *Getting the Best of It* (322 pp, too big for tail-end of this session). Cohen's *Losing Big* (154 pp, short — started but pulled when the API got heavy).

---

## 3. Competitive recon — the three-tier market map

Across the session we examined: **AceOdds, Unabated, Action Network, SportsBettingDime (4 lessons), Covers, OddsJam, Pinnacle Betting Resources**. The picture is clear and consistent.

### Tier 1 — Beginner literacy sites
*AceOdds, Action Network, SportsBettingDime, Covers.* Flat archives of one-concept bet-type explainers, affiliate-funded. Teach *what a bet is*, never *how to win*. Quality uneven — SBD's EV and moneyline articles are correct; **their vig article mislabels hold as vig** (the exact error our `learn-vig.html` corrects with a dedicated section).

### Tier 2 — Paid +EV tools
*OddsJam, Outlier, AVO, Unabated.* Subscription scanners ($50ish/mo) that auto-devig Pinnacle/Circa and surface +EV/arb bets. **"Done-for-you recs."** Tool-first; "education" is a sales funnel to the paywall. They sell the *answer*, not the *understanding*. OddsJam's +EV page literally says *"We give real-time recs, you make bets. It's that simple."*

### Tier 3 — Sharp free education
*Pinnacle Betting Resources.* Genuinely deep — EV, CLV, vig, Kelly. But written for an *already-analytical* audience, no curriculum, sportsbook content marketing, **Pinnacle doesn't even serve the US**.

### The hole — where PROFITPATH lives
Nobody combines **beginner-accessible + structured curriculum + real winning math + free + interactive tools.** Tier 1 is accessible but shallow. Tier 2 is powerful but paywalled and makes you dependent. Tier 3 is deep but assumes expertise. PROFITPATH is the bridge.

### Threats and answers
- **OddsJam-type tools** are the real competitor for the *winning* bettor. Their pitch: "why learn to devig when a $50/mo tool does it for you?" Our answer (same as the Unabated framing): we teach you to *understand* it — so you're not dependent, can sanity-check, and the recs make sense. **We will never out-*tool* them (no live data); we out-*teach* them.** Bet X-Ray is the manual, free, learn-by-doing version of what OddsJam automates.

### The one real gap — confirmed five times over
Every Tier-1 competitor covers the **literacy layer** thoroughly: what a spread is, what a total is, how to place a bet. **PROFITPATH's Path 01 jumps to the math.** A true never-bet-before beginner has nowhere on our site to learn what a spread or total even is.

→ **The actionable item:** build a **"Betting Basics" primer** — the literacy layer beneath Lesson 01 (bet types: spread / total / moneyline / parlay / props + how & where to place a bet). It closes the only gap every competitor exploits, and it's a major SEO target ("how to bet on sports," "what is a point spread").

Open question to settle when we pick this up: **standalone page** or **Lesson 00 inside Path 01**.

---

## 4. Standing rules / process notes added this session

- **★ Beginner-accessibility pattern is now a standing rule** (in `memory/profit_path_state.md`). Every v2 tool page gets: a plain-English intro block + linked glossary terms + small JS edge-clamp + plainer prose. Do this on every new page going forward.
- **Cyan vs Green hierarchy** holds: cyan is routine/default; green is reserved for "what truly matters" (positive outcomes, key warnings, the green Key Note).
- **Disambiguate, never conflate.** Hedging ≠ bonus-bets. Vig ≠ hold. When two concepts could be confused, use a dashed `.tool-redirect` signpost.
- **Library audit on every page reformat** — verify content against the PPS Library, not just restyle.
- **Mention-it-link-it** — if a page names another tool/concept by name, link it.
- **Soft-book examples:** BetMGM, Bet365. **Sharp-book examples:** Pinnacle, Circa.

---

## 5. What's parked / open threads for next session

**High priority — actionable now:**
1. **Build the "Betting Basics" primer** — the literacy layer below Lesson 01 (decision: standalone page or Lesson 00). The single most defensible new SEO + conversion asset on the list.

**Library queue:**
2. **Cohen — *Losing Big*** (154 pp, short) — was started but pulled when context got heavy. Clean pick for a new session. Pairs with Manteris's "too big, too fast, too loose" critique.
3. **Walters — *Gambler*** (395 pp memoir) — the bettor's-side counter-voice to Manteris (his chief antagonist). Manteris note explicitly flagged this as a HIGH-priority pairing.
4. **Wong — *Sharp Sports Betting*** (355 pp, math-dense) — biggest analytical authority gap remaining. Heavier read.
5. **Sklansky — *Getting the Best of It*** (322 pp) — punted from this session; needs its own.

**Site work — v2 conversions still pending:**
- **Path 02 (Convert)** overview + lessons.
- **Path 03 (Maintain)** overview + its deep-dive lessons (`learn-middles`, `learn-futures`, `learn-arbitrage`, etc.).
- Tool pages not yet v2: Consensus, Sharp Snapshot, Bet Tracker, Bonus Converter, DFS Slip Checker, Edge Finder, Long-Run Sim, Parlay Calculator.
- A **`topics/contrarian-vs-ev.md`** file in the library — formally reconcile Appelbaum's "fade the public" school vs the +EV/CLV school (Miller/Buchdahl). High value, brand-aligned ("disambiguate, don't conflate").
- A **bettor-bias / "don't bet like a fan" lesson** for Path 01 or Path 03 — gap Appelbaum surfaced. Ground it in Duke (*Thinking in Bets*), not in Appelbaum's method.

**Strategic positioning the recon validated:**
- Keep going deeper on the **teaching layer** (devig → EV → Kelly → CLV) — that's the hole nobody else fills.
- Don't chase: sport-specific guides (Action/Covers have them; big content lift, off our lane), affiliate-promo-aggregation (AceOdds's model), or any "magic number" rules (Appelbaum's <35% — contested).
- Don't copy: aggressive marketing claims like Unabated's "96% of members become winning bettors" — credibility & responsible-gambling risk.

---

## 6. All commits this session (oldest → newest)

41 commits total. The substantive ones:

```
v2 + content rebuilds:
  827938a  v2: lift secondary-text contrast + widen lesson template
  2e6ee88  Kelly lesson: growth-curve chart + clearer math sections
  7ece232  Kelly lesson: qualify the "take it every time" line
  4991782  Kelly lesson: drop "no-brainer", introduce EV on first use
  41f3bb8  Kelly lesson: restructure hero subtitle into planned 3 lines
  37b2f8d  Hedge Calculator: full v2 rebuild + library audit
  988f193  Hedge Calculator: separate hedging from bonus bets, refine Key Point
  4eb7a11  Calculators: beginner-friendly plain-English intros + linked glossary terms
  86ffe20  Path 01 lessons: convert all 6 to v2 design system
  0b69575  Path 01 overview (lane-new): convert to v2 design system
  1405628  Parlays & SGPs lesson: convert to v2 design system

Homepage / brand:
  3425881  Homepage: lead meta/social description with the new tagline
  8ffa397  Homepage: add brand tagline to the toolbox section
  6a98504  Homepage: clean up the toolbox section head
  328a89d  Homepage: move all section titles off DM Serif to v2 gradient
  c1e9f49  Homepage: gradient title treatment on the Choose Your Path heading
  9adb3f5  Homepage: gradient title treatment on the PPS Original heading
  795cca6  Homepage: gradient title treatment on the Bet X-Ray name

New pages + sitewide nav:
  c5e6ce6  Add Prop Bets lesson (learn-props) — new Path 01 concept page
  f066929  Sidebar: add Prop Bets nav link sitewide
  ece4ba4  Add Betting Glossary — plain-English A–Z reference page
  e710bd8  Sidebar: add Glossary nav link sitewide

Lesson 01 — the beginner-rewrite track:
  40c39b6  Lesson 01 (Reading the Odds): rewrite for a true beginner
  2c48996  Lesson 01: clarify that $100 is just an example amount
  458c1d0  Lesson 01: fix misleading "price tells you what to bet" wording
  e59f67c  Lesson 01: add an interactive mini payout calculator

Library notes:
  861923c  Library: add synthesis note for Buchdahl, Fixed Odds Sports Betting
  7569110  Library: add Interception/interview update to the LOSB note
  720aea2  Library: add synthesis note for Appelbaum, The Everything Guide to Sports Betting
  eca05fa  Library: add synthesis note for Manteris, The Bookie
```

All pushed to `main` on `rsnbets/profit-path-sports`. Vercel auto-deploys ~30s lag.
