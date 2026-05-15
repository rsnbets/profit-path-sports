# The Logic of Sports Betting — Ed Miller & Matthew Davidow (2019)

> **Reading status:** First pass complete on Introduction + Market Making + Sportsbook Business Models. Remaining priority chapters (Taking Advantage of Sportsbook Marketing · Chopping The Hold · Props · Strong vs Weak Markets · Angles · In-Play Betting · Multiway Markets) pending future sessions.

## Bibliography

- **Title:** The Logic of Sports Betting
- **Authors:** Ed Miller, Matthew Davidow
- **Year:** 2019
- **ISBN:** 978-1-0968-0572-4
- **Publisher:** Self-published (TheLogicOfSportsBetting.com), Henderson NV
- **Pages:** 241
- **Significance:** Foundational analytics text for modern sports betting. Direct predecessor to *Interception* (2023). Sets vocabulary and frameworks that all later Miller/Davidow work (and much of the modern sharp-betting literature) builds on.

## Thesis in one paragraph

Sports betting is structurally unique among gambling: it's the only game where the house is an **active adversary** (not a neutral facilitator running a fixed ruleset), it's **zero-sum** (your win = the book's loss), and it's **multiplayer** — you compete indirectly against other bettors whose actions move prices and affect your outcomes. To win, you must understand the sportsbook industry from the inside — particularly the split between **market-maker books** (who do price discovery) and **retail books** (who copy prices and survive by curating the customer pool). The book argues this insider understanding is *required knowledge* to bet long-term, though insufficient on its own without data/modeling skill.

## Key frameworks / named concepts

### 1. The "Spot-the-Sucker" Framing
> *"If you can't spot the sucker, you are the sucker."*

Inherited from poker (Rounders, Mike McDermott) but extended: in casino games other players don't affect you; in sports betting, the **best bettor in your market costs you money**. Establishes the multiplayer-game premise.

### 2. The Three Line-Making Methods (CRITICAL)
Lines come from a **blend** of:
1. **Supernerds** (small role) — quants making opening lines or rare custom markets. Expensive, info-deficient (one analyst can't know everything the crowd knows: injuries, weather, late scratches).
2. **Copying from other sportsbooks** (largest role) — most books shadow market-maker prices.
3. **Price discovery** — "post a line, take a bet, move the line on action, raise limits, repeat" — only practiced at market makers.

Demolishes the "Vegas oracle" myth: there is no "Vegas" setting prices, and lines don't come from "armies of math nerds in a bunker."

### 3. Market Makers vs. Retail Books — Two Distinct Business Models
A spectrum, not a binary. Different books occupy different positions; even one book may be market-maker for hockey and retail for soccer.

| Dimension | Market Maker | Retail Book |
|---|---|---|
| **Price source** | Self (price discovery) | Copies market maker |
| **Margin** | Low (~1%) | Higher (driven up to maximize per-bet revenue) |
| **Volume strategy** | Needs high volume | Wants volume but won't sacrifice margins |
| **Customer policy** | Takes all comers, high limits | Curates pool, low limits, **kicks out winners** |
| **Hold %** | Low (keep recreationals in action) | Higher (squeeze margin per bet) |
| **Marketing** | Minimal — loyal customer base | Heavy — promos, deposit bonuses, TV ads |
| **Investment requirement** | Heavy upfront (talent + infra) | Lower — copy lines from a feed |
| **Tax sensitivity** | Extreme (volume tax is brutal at low margin) | Lower (margin tax is more manageable) |
| **Profile customers to:** | **Move lines intelligently** (faster/harder when sharps bet) | **Decide who to kick out** |

This taxonomy is the **single most important framework for the Ban-or-Bankrupt paper**. The paper's "stake factoring" / account-limiting section maps directly to retail-book defensive behavior.

### 4. The 1-5 Customer Profiling System
Market makers explicitly grade every customer with a sharpness score (Miller/Davidow use 1-5 as illustration):
- **1** = Recreational, makes no attempt to win
- **5** = Professional, demonstrated winning history

The score updates as more betting behavior comes in. **Key insight:** market makers and retail books use this profile *for opposite purposes*:
- Market maker: when a 5 bets under, move the line down faster than when a 1 bets over.
- Retail: when a 5 starts winning, limit them.

### 5. Price Discovery as a Process
The market-making algorithm in plain terms: open with a guessed line + low limit ($100), take bets, move the line in the direction of action, raise limits once action settles, repeat. By the time the market is "mature," the bookhas a price they're comfortable holding to at full limit.

> *"That's how market making works. When the market is mature, I will have a pretty good line for each game, and by placing a hold on the market, I ensure that I will end up keeping a percentage of all the bets made into the mature market."*

### 6. System Fragility from Mass-Copying
Most retail books copying from a few market makers creates a structural fragility:
> *"Often, one sportsbook moves a market based on a bet, and then a large number of sportsbooks will copy that move even though none of their customers made a bet. This behavior means the real market is often much smaller and less liquid than it appears. It also allows savvy bettors to manipulate the market. Worse, it makes game integrity problems harder to spot."*

A direct argument for our Ban-or-Bankrupt paper's section on **why limiting is structurally necessary at retail books, but creates downstream regulatory and integrity risks.**

## Strongest claims (with page refs)

| Claim | Page | Why it's well-defended |
|---|---|---|
| Sports betting is a zero-sum, multiplayer adversarial game (unlike other casino gambling). | 8-10 | Logical, well-illustrated with blackjack/poker comparisons. |
| Most sportsbook lines are copied, not independently set. | 41-42 | First-hand industry knowledge from Miller as a former book consultant. |
| Market makers profile customers 1-5 to inform line movement decisions. | 48-49 | Described in mechanical detail with worked example (Knicks-Bucks 221 total). |
| Retail books profile customers to decide whom to ban/limit. | 57-58 | Stated explicitly with the mechanism (low limits → outright closure). |
| "The house always wins" is not true in sports betting at market-maker books. | 54 | Argued by showing the actual cost of writing bad bets during price discovery. |
| Federal excise tax (0.25% on volume) takes ~25% of a market-maker's revenue. | 55-56 | Arithmetic shown; policy implications outlined. |

## Examples / case studies worth preserving

### The Knicks-Bucks 221 Total (p49)
Two simultaneous full-limit bets:
- Bet 1: from a "Category 2" wealthy corporate attorney, betting OVER
- Bet 2: from a "Category 5" pro NBA-totals bettor with a winning history, betting UNDER

Book's response: **move the line DOWN (favoring under)** — because the sharp's bet carries more information about the true line. The sharp didn't move you off your hedged position (the bets cancel financially) — but they told you where the price should be.

Use as: the canonical illustration of why profiling exists in market making (it's not adversarial — it's pricing intelligence). Then contrast with retail-book profiling, which IS adversarial.

### The Gold Shop Analogy (p43-44, p59-60)
Miller's running analogy for retail-vs-market-maker dynamics:
- A retail gold shop Googles "price of gold" every five minutes and adjusts buy/sell prices around the Google price.
- A market-maker shop discovers the gold price by quoting and adjusting on actual transactions.
- If a retail shop made the mistake of "moving on action" without market-maker infrastructure, **someone could arbitrage them all day long** (buy low at the retail shop → sell at the market maker, repeat).

Use as: the plain-English explanation for why retail sportsbooks DON'T move on action and **DO** limit anyone who tries to scalp/middle them.

## What's unique vs. other sources

- **The explicit market-maker / retail dichotomy with the cross-tabulated business-model differences.** Other books mention "sharp vs square" books but Miller/Davidow are the most rigorous in framing it as two distinct business models with different P&L levers.
- **The mechanics of price discovery from the operator side** (low-limit open → bet → move → raise limits → mature → max limits). This is rare insider material.
- **The link between low-margin market making and excise-tax policy** — argues that a 1% "integrity fee" would push market makers offshore and destabilize the regulated market. Useful for the paper's regulatory implications section.
- **The 1-5 profiling system framed as a continuous, mechanical process** — not a one-time judgment.

## Weak claims / dated material / criticisms

- **2019 context predates** the post-PASPA legal-sportsbook explosion. Some claims (e.g., "dozens of independent operators") are now outdated as the market has consolidated heavily around DK, FD, BetMGM, Caesars, Fanatics, etc.
- **No specific operator names** — Miller is careful (lawyerly) about not naming specific books as "the market maker for X." Hurts citability when we want to anchor claims.
- **Light on academic citations** — this is industry-insider writing, not academic research. We supply academic backing in our paper.
- **The 1-5 profiling scale is illustrative, not literal.** Real systems likely use continuous scores with many more dimensions. Don't quote it as a real system; quote it as a framework.

## Where we'd extend or disagree

- **Update the framework for 2026 markets.** Most "retail" books now have in-house sharper modeling than they did in 2019; the binary is now more like a continuum. The paper should call this out — Miller/Davidow underestimated how much retail-book modeling would mature.
- **Add the **dark-pattern / behavioral-design** layer Miller/Davidow don't cover.** Their analysis stops at line-making and customer-curation; the behavioral UX (push notifications, cashout offers, parlay builders) is where modern sportsbook profitability now lives. The paper extends the framework to cover this. Tied to Funt (Everybody Loses) and Scientific American dark-patterns reporting.
- **Name the equilibrium.** Miller/Davidow describe the components of the ban-or-bankrupt dynamic but don't name it as a formal equilibrium. PROFITPATH's contribution: formalize the model.

## Content opportunities this book seeds

### Lessons (curriculum)
- **"How sportsbook prices actually get made"** — the 3 line-making methods, demolishing the Vegas-oracle myth. Newbie-friendly Path 01 lesson. **HIGH** confidence.
- **"What 'sharp money pounding the line' really means"** — debunks sports-betting-media narratives about line movement. Brief, viral-friendly. **HIGH**.
- **"Why parlays don't actually hold more"** — counter-intuitive math reframe; parlays = volume amplifiers, not bad bets per se. **HIGH**.
- **"How books grade you (the 1-5 scale)"** — explanatory lesson; what behaviors push you up/down. **MEDIUM** (don't overclaim it's a real exact system).

### Guides (deep-dive pages)
- **"Market makers vs retail books — and why it matters which one you bet with"** — 9-dimension cross-tab from this book, with practical "find your book's tier" implications. **HIGH**.
- **"The copy-chain fragility"** — most prices you see are reflections of one book's price. What that means for arbitrage, integrity monitoring, regulatory risk. **HIGH**.
- **"Why a 0.25% federal tax kills market making"** — policy-adjacent piece for a more sophisticated audience. **SPECULATIVE** (smaller audience, narrower angle).

### Tools
- **Sportsbook Tier-Map** (or "Book Profile Estimator") — a maintained list/visualization of which books act more market-maker vs more retail, with limit-tolerance scoring. Helps users decide where to open accounts. **HIGH** value, **MEDIUM** to build (needs ongoing maintenance).
- **"Estimated sharpness profile" diagnostic** — input your betting history snippet → estimate where you sit on the 1-5 scale and what'd push you up. **SPECULATIVE** (hard to operationalize without real data, but engaging hook).
- **Parlay True Volume Calculator** — exposes the math that parlays multiply your effective volume. Plugs into existing Parlay Calculator. **MEDIUM**.

### Originals
- **The "Ban-or-Bankrupt Equilibrium" paper** — already planned. This book is its analytical spine.
- **"How sportsbooks decide what to charge for the bet you want to make"** plain-English original piece — Miller/Davidow's market-making chapter as a 1500-word PPS Original. **HIGH**.

## Market gaps this book reveals

What's in this book that the public market doesn't explain well anywhere else:

- **The market-maker / retail dichotomy is essentially absent from public sportsbook reviews.** Every comparison site rates "FanDuel vs DraftKings" on features and promos. Nobody explains that they have **fundamentally different business models** that affect whether YOU'LL get limited. Massive content gap. (No one / paywalled / siloed in industry-only Discord groups.)
- **The "lines are copied" reveal is hidden from casual bettors.** Public sports-betting media treats line movement as if every book independently sets prices. The copy-chain reality is rarely surfaced for a general audience. Gap.
- **The 1-5 profiling system is privately known but never operationalized for bettors.** Sharps know they get tagged; recreationals have no idea. Nobody explains the spectrum, what moves you on it, or what to do about it. Big gap.
- **Parlay-volume math** is widely misunderstood. The standard advice ("don't play parlays, they hold 12.5%") is *wrong in mechanism* even when correct in outcome. The right framing (parlays multiply your betting volume) is almost never explained publicly. Gap.
- **The integrity-fee / tax-policy analysis** is in industry trade press but never makes it to bettors. A "what would change if sports leagues got their 1% cut" piece is missing from public discourse. Smaller gap, more niche.

## Direct quotes (sparingly, with page numbers)

> "If you can't spot the sucker in your first half hour at the table, then you are the sucker." (p7 — Rounders / Mike McDermott citation Miller borrows)

> "Sports betting is unique because it's the only game where you are, in fact, playing against the house. The house is an active participant. It's your main, direct adversary." (p8)

> "Sportsbooks copy their lines from other sportsbooks. That's the answer." (p41)

> "Market making books heavily profile customers so they know how best to move their lines in response to action, retail books heavily profile customers so that they can determine which ones they don't want." (p58) — **KEY QUOTE for the Ban-or-Bankrupt paper**

> "If you increase the hold, you increase your margins. Then the trick is just to try to get more customers and get your current customers to bet more and more." (p61) — captures the retail-book treadmill that underlies promo / dark-pattern design

> "Use this insight into how books run their businesses and find the candy stores." (p62) — the book's POV in one line

## Topic tags

For cross-referencing into `library/topics/`:

- `industry-structure-and-regulation` — primary tag
- `pricing-inefficiencies` — price discovery mechanics, copying chain fragility
- `account-profiling` — both 1-5 framework and retail-book adversarial profiling
- `expected-value-foundations` — hold percentages, margin math
- `parlays-and-sgps` — parlays-don't-hold-more argument (p36-39)
- `psychology-of-the-bettor` — "spot the sucker" framing
- `industry-fragility` — copying chain, integrity-monitoring weakness

## Notes for next reading session

Priority chapters still to read (highest value first):

1. **Taking Advantage of Sportsbook Marketing** (p212-219) — direct material on promo manipulation, dark patterns, "free bet" mechanics. Major paper input.
2. **Chopping The Hold** (p220-226) — math of beating the vig, structural lever.
3. **Strong Markets vs Weak Markets** (p116-121) — where edges live structurally.
4. **Props** (p153-158) — prop market exploitability, ties to Interception.
5. **Angles** (p181-192) — specific exploitation patterns.

Secondary skim:
- **In-Play Betting** (twice — both p67 and p193) — live-market dynamics, ties to dark-patterns section.
- **Public Money** (p63) — money-flow dynamics.
- **Should You Try To Win 60% Or 54%?** (p138) — strategic framing.

After full read, update this note + spin up first `library/topics/` files based on the tags above.
