# PROFITPATH — Session Log, May 21, 2026

> **Companion file.** Prior multi-day work (May 18–20: Lesson 01 rewrite, the Glossary page, Prop Bets lesson, Path 01 v2 conversion, beginner-language calculator pass, homepage title cleanup, tagline, plus library notes for Buchdahl + Appelbaum + Manteris + LOSB interview update) is captured in **`library/SESSION_2026-05-19_LOG.md`** — that file is still the pickup brief for everything before this one. *This* file covers May 21 only.

Today was one focused session: **two big things shipped, plus a real audit-vs-drift lesson worth carrying forward.**

---

## 1. Sharp Snapshot — new "Book Limit Asymmetry" signal (Output 02)

Added a new output block to `sharp-snapshot.html` that uses the per-book limit data the calculator was already collecting but never analyzed.

### What it does
- **Per-book asymmetry cards** for Pinnacle and Circa. Each shows side-A vs side-B limits with the **lower-limit (protected) side highlighted in cyan**, the ratio (e.g. `5.00×`), and a plain-English read at four thresholds:
  - `< 1.15×` — "Limits roughly balanced — no stance signal."
  - `1.15–2×` — "Mild lean — protecting [side]."
  - `2–5×` — "Protecting [side] — book is wary on that side."
  - `> 5×` — "Strong protection on [side] — book has effectively closed it."
- **Cross-book + cross-signal status line** synthesizing across both books and the exchange-flow imbalance:
  - `confirm` when they agree
  - `conflict` when they disagree (special case: "books disagree" — Pinnacle and Circa point opposite ways)
- **Verdict integration:**
  - Asymmetry agrees with exchange → escalate one level + append *"books confirm"* (Mild → Solid → Strong).
  - Asymmetry disagrees → demote one level + append *"mixed book stance"*.
  - No exchange flow but books asymmetric → new **"Books-only lean"** verdict.

### How outputs got renumbered
The new block sits between Translation and Conviction Check. Old order: 01 Translation / 02 Conviction / 03 Consensus / 04 Target. New order: **01 Translation / 02 Book Limit Asymmetry / 03 Conviction / 04 Consensus / 05 Target.**

### Verified
All four logic branches tested live in preview: all-confirm, conflict, books-disagree, books-only-lean. CSS class transitions (`confirm`/`conflict`/`protected-flag`) activate correctly. No console errors.

### Commit
- `[earlier today]` Sharp Snapshot: add Book Limit Asymmetry signal (Output 02)

### Note
The page is still **v1** (Orbitron / `#0a0f1c` palette / `noindex,nofollow`). The new signal logic was added in-place without converting; v2 conversion is its own piece.

---

## 2. Sharp Exchange Playbook — library audit pass

Three small edits aligning **`exchange-playbook.html`** with the May 2026 library additions (Buchdahl, Manteris, LOSB-update).

1. **Manteris-authority note added to the hero.** Second intro paragraph cites *The Bookie* (2024): *"a 40-year Las Vegas head bookmaker confirms that the sharpest market-making books — not Vegas — set the true line, and Vegas follows them."* Closes a trust-signal gap the page had.
2. **Step 04 description updated** to mention the new **Book Limit Asymmetry** output we shipped today.
3. **Step 03 description updated** with a thin-market calibration caveat — applying Buchdahl's favorite-longshot finding to our own method: *"the BEST-vs-PX signal is strongest with real PX depth, noisier on thin $50–$200 markets."*

### Commit
- `3e4a5f6` Sharp Exchange Playbook: library audit pass

### Important — what we did and did NOT touch
After those three Playbook edits, **everything else today landed on the underlying lesson `learn-exchange-liquidity.html`, not on the Playbook.** That was a drift from the original ask — see §4 below.

---

## 3. `learn-exchange-liquidity.html` — major rewrite (this is where most of the work landed)

Started as a Signal #2 enhancement, ended up a top-to-bottom beginner-pass on the whole lesson. **Eight separate commits.**

### 3a. Signal #2 — added peer-set comparison (`ae53ba6`)
The original Signal #2 taught outsized depth vs. Pinnacle's typical limit (vertical read: exchange depth vs. sharp-book ceiling). Added the **horizontal read** the user described: compare *this line* against *peer lines in the same category*.

- New sub-block inside Signal #2.
- Worked example: tonight's NBA assist props — Player A $240/$310, Player B $180/$200, **Player C $1,400/$220 ← outlier**, Player D $210/$260. Apply translation rule → sharps want Under on Player C.
- Four-step practical workflow (scan board → note baseline → flag outlier → translate).
- Closing note: peer-set vs. Pinnacle-limit are *two read methods for the same signal* — peer-set is faster, Pinnacle-limit is deeper-calibrated; either alone is meaningful, both together is best.

### 3b. Translation rule — rewritten (`9b86d39`)
Original buried the rule under three paragraphs of reasoning. Rewrote so:
- **The rule comes first**, in a warn-block at the top: *"every offered price is a bet the sharps are trying to trick you into taking."*
- New h4 **"The translation rule — flip the side, flip the sign"** with two bullets:
  - Flip the side
  - Flip the sign of the price — explicitly correcting the common confusion: a `−110` display means the sharp got `+110`, **same magnitude, opposite sign** (Not +100. Not +110-ish. Exactly +110.)
- Worked example expanded to include the canonical **Pistons −110 / Cavs +110** case alongside Jays/Rays and Eagles/49ers.
- New h4 **"Why the rule works"** with the *"trick them into taking it"* framing as the load-bearing intuition.
- Pull-quote: *"The displayed price is what the sharps are daring you to take. Their real bet is the mirror image — and that's the number that matters."*

### 3c. Intro section — rewritten for beginner accessibility (`59878bb`)
Original "Why this matters" jumped straight into order-book theory. Rewrote as four plain-language sub-headers:
1. **What an exchange is** — peer-to-peer market, nobody is the "house."
2. **For regular bettors: cheaper bets** — links to `learn-vig.html`; exchanges almost always have lower vig.
3. **For sharp bettors: no limits, no flagging** — exchanges make money on commission either way, winning accounts don't die.
4. **For anyone: the book is the signal** — because sharps can size up there, the depth on the screen *is* the sharp market in real time.

Closed with a soft maker/taker jargon note so the terms aren't foreign when they reappear later — but framed so the reader only has to remember *"the depth on screen was put there by makers — mostly sharps."*

### 3d. Added "every bet is created by another user" foundational paragraph (`3a65dc3`)
Single key insight the user surfaced and we wove in as a stand-alone paragraph right after the peer-to-peer framing: *"every bet you see listed on an exchange has been **created** by one or more other users — it doesn't exist until somebody writes it."* Closes the conceptual loop that makes the rest of the lesson click.

### 3e. Matched-vs-unmatched section — simplified (`34de15b`)
Original used dense jargon ("unmatched liquidity," "matched volume," "PTO views," "fair-price opinion backed by actual capital sitting on the book") split across two nested bullet lists. Rewrote:
- New heading: **"Two things you might see — only one matters here"** (was: *"Unmatched offers vs. matched bets — get this straight first"*)
- **Bucket 1: "Bets still waiting to be taken"** — formal terms (*order book / unmatched liquidity*) as parenthetical labels.
- **Bucket 2: "Bets that already happened"** — *matched volume* as parenthetical label.
- One short prose payoff replaces the original second nested bullet list: *"You want live opinion — not last hour's history."*
- Pull-quote kept intact.

### 3f. Added "A real one — let's break down a ProphetX bet" section (`6c224f8` + image `8235932`)
A new section slotted between the "two things" intro and the translation rule. Built around a single ProphetX moneyline screenshot (**COL @ LAD** — saved to `/images/prophetx-col-lad-moneyline.png`, 1630×530, ~85 KB).

The section walks through every element on the screen in three grouped example-blocks:

1. **The two highlighted tiles** — best back-COL price (+345, $118) and best back-LAD price (−360, $2,260).
2. **The other rows** — what +335/$1,871, +330/$344, −365/$156, −370/$2,584 mean ("worse prices, more depth, sitting in line behind the best").
3. **The smaller numbers** — Last Match consensus, the **100.73% vig readout** with the math worked (22.47% + 78.26%, linked to `learn-vig.html`), and the $271K traded total as a market-depth signal.

Closes with a tip-block: *"Don't worry if some of this doesn't click yet. Every section below is teaching you how to read one piece of what you just saw. Come back to this screenshot at the end and it'll read instantly."*

**This screenshot now serves as a recurring concrete anchor** the rest of the lesson can reference without re-explaining.

### 3g. Title + intro reframing — beginner's complete guide (`a6cb4c1`)
Reframed across five places for one consistent positioning:
- **Page `<title>` + og:title + twitter:title:** "How to Read a Betting Exchange — From Your First Bet to Reading the Sharp Money"
- **Eyebrow:** "Beginner's Guide · Betting Exchanges" (was: "Exchange · Order Book")
- **H1:** "How to Read a Betting Exchange" (was: "Reading Liquidity as a Sharp Signal")
- **Lesson sub:** *"A complete beginner's walkthrough — what a betting exchange is, why regular bettors and sharps both use them, and how to read the order book like the smart money. No experience required; we'll go all the way."*
- **Intro section h3:** "What a betting exchange is — and why it matters" (was: "Why this matters")

Signals beginner-friendly + comprehensive throughout.

---

## 4. The audit-vs-drift lesson

Worth carrying forward. The user originally asked:

> *"ok lets go over our sharp exchange playbook.... have we tested this against the new library yet?"*

The first three edits *were* on the Playbook (§2 above). After that we drifted: every subsequent edit landed on **`learn-exchange-liquidity.html`** — the *lesson* the Playbook links to (Step 02), not the Playbook itself.

**The drift was caught at the end.** Two honest takeaways:

1. **The lesson edits are real wins** — that page is substantially clearer than it was at session start. Worth keeping.
2. **The Playbook itself only received those three opening edits and nothing since.** Most of today's edits don't have a slot on the Playbook anyway (it's a 5-step curriculum overview with hero + step cards + CTA — it doesn't contain "translation rule" or "matched vs unmatched" body content; that lives in the lessons).

**The one consistency fix the Playbook still needs:** the Step 02 description should be updated to reflect the lesson's new "complete beginner's walkthrough" framing (it currently still talks about "the translation rule" / "eight specific signals" — accurate, but doesn't signal the new beginner positioning). Flagged for next session.

**Also flagged: a real positioning overlap exists.** The lesson now contains "what an exchange even is" content — peer-to-peer market, every bet is created by another user, why regulars and sharps both use them. The Playbook's **Step 01** points to **`/book-prophetx.html`** with the description "What an Exchange Actually Is." So Step 01 and Step 02 now both serve as "what an exchange is." Two ways to resolve when ready:

- **Option A — embrace the overlap.** Step 02 is the self-contained beginner-to-sharp deep dive; Step 01 stays as the ProphetX-product intro (referral CTA). Update Step 02's description to say "the complete beginner-to-sharp walkthrough."
- **Option B — re-sequence.** Promote the lesson to Step 01, demote ProphetX to a later "where to bet" step or remove from the curriculum entirely.

User leaned toward Option A but didn't commit. Carry forward.

---

## 5. All commits this session (May 21)

```
a6cb4c1  Exchange liquidity lesson: reframe title and intro as a beginner's complete guide
8235932  Add ProphetX COL vs LAD moneyline screenshot
6c224f8  Exchange liquidity lesson: add a real ProphetX bet breakdown section
34de15b  Exchange liquidity lesson: simplify the matched-vs-unmatched section
3a65dc3  Exchange liquidity lesson: add the "every bet was created by another user" foundational paragraph
59878bb  Exchange liquidity lesson: rewrite the intro for beginner accessibility
9b86d39  Exchange liquidity lesson: rewrite the translation rule for clarity
ae53ba6  Exchange liquidity lesson: add peer-set comparison to Signal #2
3e4a5f6  Sharp Exchange Playbook: library audit pass
[earlier]  Sharp Snapshot: add Book Limit Asymmetry signal (Output 02)
```

All pushed to `main` on `rsnbets/profit-path-sports`. Vercel auto-deploys.

---

## 6. Open threads for next session

### Immediate (carryover from today)
1. **Playbook Step 02 description fix** — small consistency edit to align with the lesson's new "complete beginner-to-sharp walkthrough" positioning. ~5 min.
2. **(Optional)** Resolve the Step 01 / Step 02 overlap (option A vs B above).
3. **(Optional)** Full second audit pass on `exchange-playbook.html` itself, this time *staying on the playbook page* — if user wants deeper than the three edits already done.

### Standing queue (carried from prior sessions)
- **Build the Betting Basics primer** — the literacy layer beneath Lesson 01 (bet types: spread/total/moneyline/parlay/props + how & where to place a bet). The one real gap from the competitive recon. Open question: standalone page or Lesson 00?
- **Library books still parked:**
  - **Cohen — *Losing Big*** (154 pp, short) — clean pick for a fresh session.
  - **Walters — *Gambler*** (395 pp memoir) — explicit pairing with Manteris.
  - **Wong — *Sharp Sports Betting*** (355 pp, math-dense) — biggest authority gap remaining.
  - **Sklansky — *Getting the Best of It*** (322 pp) — punted twice.
- **v2 conversions still pending:**
  - **`learn-exchange-liquidity.html`** itself — still v1 styled (Orbitron, `#0a0f1c`). All today's content edits would carry over cleanly to v2.
  - **`sharp-snapshot.html`** — also v1.
  - **`exchange-playbook.html`** — also v1.
  - Path 02 (Convert) overview + lessons.
  - Path 03 (Maintain) overview + deep-dive lessons.
  - Remaining tool pages not yet v2: Consensus, Bet Tracker, Bonus Converter, DFS Slip Checker, Edge Finder, Long-Run Sim, Parlay Calculator.
- **Library extras:**
  - A `topics/contrarian-vs-ev.md` file reconciling the Appelbaum "fade the public" school vs the +EV/CLV school (Miller/Buchdahl).
  - A bettor-bias / "don't bet like a fan" lesson for Path 01 or Path 03, grounded in Duke.

---

## 7. Strategic positioning (unchanged from prior session)

The three-tier competitive map and PROFITPATH's positioning in the gap remain valid:
- **Tier 1** (literacy sites — AceOdds, Action Network, SBD, Covers): flat archives, affiliate-driven, no winning math.
- **Tier 2** (paid +EV tools — OddsJam, Outlier, AVO, Unabated): scanner subscriptions, done-for-you, paywalled.
- **Tier 3** (sharp free education — Pinnacle Betting Resources): deep but assumes expertise, sportsbook content marketing, not US-facing.
- **PROFITPATH:** the bridge — beginner-accessible + structured + real winning math + free + interactive. Today's exchange-lesson rewrite reinforces exactly that positioning (beginner front door → all the way to sharp signal reading, with a real PX screenshot as a recurring anchor).
