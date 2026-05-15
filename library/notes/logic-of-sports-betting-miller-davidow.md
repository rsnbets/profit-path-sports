# The Logic of Sports Betting — Ed Miller & Matthew Davidow (2019)

> **Reading status:** ✅ All priority chapters processed (Introduction, Market Making, Sportsbook Business Models, Strong vs Weak Markets, Props, Taking Advantage of Sportsbook Marketing, Chopping The Hold). Secondary chapters skimmed via TOC/cross-references; deep read not yet on Public Money, Multiway Markets & Futures, Angles, In-Play Betting, Should You Try To Win 60% Or 54%?

## Bibliography

- **Title:** The Logic of Sports Betting
- **Authors:** Ed Miller, Matthew Davidow
- **Year:** 2019
- **ISBN:** 978-1-0968-0572-4
- **Publisher:** Self-published (TheLogicOfSportsBetting.com), Henderson NV
- **Pages:** 241
- **Significance:** Foundational analytics text for modern sports betting. Direct predecessor to *Interception* (2023). Sets vocabulary and frameworks that all later Miller/Davidow work — and much of the modern sharp-betting literature — builds on.

## Thesis in one paragraph

Sports betting is structurally unique among gambling: it's the only game where the house is an **active adversary** (not a neutral facilitator running a fixed ruleset), it's **zero-sum** (your win = the book's loss), and it's **multiplayer** — you compete indirectly against other bettors whose actions move prices and affect your outcomes. To win, you must understand the sportsbook industry from the inside — particularly the split between **market-maker books** (who do price discovery) and **retail books** (who copy prices and survive by curating the customer pool). Once you understand the structure, the practical work becomes: **attack weak markets, chop the hold to zero, and harvest the books' own marketing budgets.**

## Key frameworks / named concepts

### 1. "Spot-the-Sucker"
> *"If you can't spot the sucker, you are the sucker."*

The multiplayer-game premise. In casino games, other players don't affect you. In sports betting, the best bettor in your market *costs you money* — every dollar they win is your loss via the books.

### 2. The Three Line-Making Methods (CRITICAL)
1. **Supernerds** (smallest role) — quants making opening lines. Expensive, information-deficient.
2. **Copying from other sportsbooks** (largest role) — most books shadow market-maker prices.
3. **Price discovery** — "post a line, take a bet, move the line on action, raise limits, repeat" — only at market-makers.

Demolishes the "Vegas oracle" myth. There is no Vegas setting prices. Most lines are reflections.

### 3. Market Makers vs. Retail Books — Two Business Models (CRITICAL)

| Dimension | Market Maker | Retail Book |
|---|---|---|
| Price source | Self (price discovery) | Copies market maker |
| Margin | Low (~1%) | Higher |
| Volume strategy | Needs high volume | Wants volume w/o sacrificing margin |
| Customer policy | All comers, high limits | Curates pool, low limits, **kicks out winners** |
| Hold % | Low | Higher |
| Marketing | Minimal | Heavy — promos, deposit bonuses, TV ads |
| Investment | Heavy upfront (talent + infra) | Lower |
| Tax sensitivity | Extreme (volume tax → ruinous) | Lower |
| **Profile customers to:** | **Move lines intelligently** | **Decide who to kick out** |

This is the most important framework for the Ban-or-Bankrupt paper. Same data, opposite purposes.

### 4. The 1-5 Customer Profiling System
Market makers grade customers with a sharpness score (Miller/Davidow use 1-5 illustratively). Number updates continuously. Critical insight: market makers profile to **price better**; retail books profile to **limit winners**.

### 5. Price Discovery as Process
Mechanical: open with a guessed line + low limit ($100) → take bets → move the line on action → raise limits as the market settles → max limits when mature. The "hold" the book places on the mature market is the margin for error against bad-bet writing during discovery.

### 6. System Fragility from Mass-Copying
Most retail books copy a few market makers, creating cascading fragility:
- Lopsided action at one market maker moves prices everywhere
- "Real" market liquidity is much smaller than it looks
- Integrity-monitoring is harder when most price moves don't reflect actual bet flow at the moving book

### 7. Market Agreement vs. Market Resistance (CLV's predictive power)
> *"What your 'smart friends,' the other serious bettors, think of your bets is indeed a very strong predictor of long-term success."*

- **Market agreement:** line moves toward your bet (other sharps agree) → bet was good.
- **Market resistance:** line moves against your bet → other sharps think you're wrong. **DO NOT load up on "cheap" pricing into resistance.** It's not "Christmas came early" — it's smart people telling you your model is broken in this specific spot.
- Concrete benchmark: **average CLV ≥ half the hold over hundreds of bets** = strong indicator of profitability.
- Only applies to liquid markets where market making is real. NFL point spreads = yes; backup-RB rushing-attempts prop at retail book XYZ = no signal either way.

### 8. Attack Weak Markets (the practical mantra)
> *"To win at sports betting, attack weak markets."*

**Strong markets** (avoid trying to beat without serious tooling): multiple market makers, large limits, lots of attention. Examples: NFL point spreads, NBA totals, major-soccer markets.

**Weak markets** (where edges live): single market maker (or none), low limits, obscure sports, derivative markets (1st-half, ¼ markets, alt spreads), props. The book put it up "as an afterthought" or "to fill out the menu."

### 9. Props as "Massive Attack Surface"
Props create a structural asymmetry — the book offers dozens of markets per game that can't be pegged to a broader market. Specific weaknesses:
- Prop **openers** are usually priced once based on the main game line, **then never updated** when news breaks.
- **Wording errors** ("two or more" vs. "more than two") — copy mistakes between books produce real edges.
- **News asymmetry** — small news that moves the main line slightly can drastically affect a prop. Books rarely re-price props on minor news.
- Player props especially: lineup changes hit props hard, but books don't always notice in time.

**Outlook:** historically very beatable but maturing fast. Fantasy analysts have pivoted to props; market makers will start making prop markets; pick-through is increasing.

### 10. The 6-Step Process for Finding Good Bets in Weak/Derivative Markets
Miller/Davidow's explicit framework (pp 150-151):
1. **Find a derivative market** offered by a retail book (quarter/period markets, alt spreads, etc.)
2. **Watch the market** — what time openers post, how prices are made, consistency
3. **Determine pick-over level** — single-book = better, fewer pickers = better, line doesn't move on action = better
4. **Check the hold** — 4% market gives lots more good bets than a 6% market
5. **Identify outlier situations** — weather, travel, coaching tendencies, lineup quirks the book's model doesn't capture
6. **Track your bets** — refine over time

### 11. Chopping The Hold (THE CORE PRICING STRATEGY)
> *"If I can chop that hold down to zero and then turn it negative, then I'm the one who will win. I could beat Mongolian netball markets with a negative hold."*

The mental model for finding +EV bets, **regardless of sport or market**. Start with the book's listed hold (say 4%), then use every available tool to subtract from it:

| Chopping technique | Typical hold reduction |
|---|---|
| **Synthetic low-hold markets** — compare across books AND across related markets (full game ↔ 1st-half, point spread ↔ moneyline, etc.) | 4% → 1% on a single bet pair |
| **Angle plays** (weather, travel, coaching, etc.) — adds info the book hasn't priced | 0.25-1% per angle |
| **Steam following** — the market maker moved; the retail book hasn't yet | Variable |
| **Cross-derivative shopping** — picking a 1st-half line at retail vs. full-game at market maker | Big if both prices haven't synchronized |

Goal: chop the hold below zero, then bet.

### 12. The "Don't Aim For 60%" Insight (correlate of #11)
> *"To hit 60% you'd have to intentionally pass on 58% and 56% and 54% bets. Why the heck would you want to pass on bets that win? There are a lot more 54% bets floating around out there than there are 60% bets."*

Reframes the goal: hit-rate is the wrong target; **edge net of hold** is the target. Pass on a 0.5%-edge bet at 8% hold (risk eating hold from any pricing error), but bet a 1%-edge bet at 4% hold without hesitation.

### 13. Sportsbook Marketing as a Profit Pool
> *"A dirty secret of professional gambling is that a very substantial proportion of the win comes directly and indirectly from the casino or betting operator's marketing budget."*

Sports betting marketing budgets are a (temporary) profit pool for skilled bettors. Three categories of plays:

**Deposit bonuses — "Go For Broke" math:** Most bonuses come with a 10×-20× rollover. Conventional wisdom says grind out the rollover at low hold. Miller/Davidow show the math: **going for broke (max bet on longshots) is more profitable on average** because most of the time you bust early and never have to face the full rollover hold.

Worked example (p214-216):
- $500 deposit + $500 bonus, $10,000 rollover at 4% hold
- **Grind strategy:** end with ~$600 on average ($1000 - $400 expected hold)
- **Go-for-broke strategy** (bet entire $1000 on +200 longshot, repeat if win, scalp out the rest): end with ~$841 on average

Key mechanic: the more often you bust, the less often you pay the hold. Most plays bust at step 1 — the few that survive get a much bigger bankroll. **Higher variance, higher EV.**

(Also: books prefer "go for broke" bettors to grinders. Grinders get marketing-blacklisted.)

**Free play / bonus bets:** Book keeps the stake; you only keep winnings. **Always bet the longest legal longshot** the free play allows.

Worked example (p217-218): a $100 free play at -200 (70% true) returns $35 on average; at +100 (50% true) returns $50; at +200 (30% true) returns **$60**. Bigger longshot = higher EV from free play, every time.

**Odds boosts, bad-beat rebates, zero-hold markets:** "Get in front of the hose and open wide" — bet maxes on any boosted/rebated/zero-hold offer the book sends you.

### 14. The In-Play Delay Pattern (a dark pattern Miller exposes)
Most sportsbooks add an **artificial 4-8 second delay** between you submitting an in-play bet and the bet being accepted. During the delay:
- Book waits for new line updates from its odds provider
- If line moves **your way** during delay → book often declines your bet, or offers it at the new (worse) odds
- If line moves **against you** during delay → book accepts (and sometimes patronizingly "upgrades" you to the slightly better price they could now offer)

> *"It's literally impossible to win at in-play betting when you're betting into 6.5% hold lines (like -115 on each side) while also subjecting yourself to the TV delay plus the added sportsbook delay."*

Miller's solution: **bet during timeouts only** — both you and the book have the same information about game state, so the delay's adverse-selection power is neutralized. Plus: prefer books that don't use delays.

### 15. "Bet the Mistakes" in In-Play
In-play line feeds price based on game-state probability. Strategies that wait for "a better price" usually fail because the price moved for a real reason. The winning approach: identify situations where the line feed's algorithm is **structurally wrong** and bet those.

Miller's chart of feed-mistake categories (p211):
- **Mistaken game state** (algorithm has wrong context: down/distance error, foul state)
- **Failing to account for a game-specific factor** (key player rotation, coaching strategy, foul trouble, weather)
- **Fundamental modeling error** (e.g., NHL "more goals in 2nd period" tendency the algorithm doesn't price)

The full sport-by-sport angle chart (p211) is a content goldmine — could be ported into a guide.

### 16. The "Frothy Attitudes" Window
> *"While things are still frothy, sportsbook operators are likely to be more tolerant of winners."*

The post-PASPA expansion phase (2018-202?) means books are land-grabbing for market share. CEOs care more about state-by-state launches than chasing winning bettors. Once consolidation hits, "belt-tightening starts, and winning bettors will be prime targets."

Implication: get the marketing money while it lasts.

## Strongest claims (with page refs)

| Claim | Page | Why it's well-defended |
|---|---|---|
| Sports betting is a zero-sum, multiplayer adversarial game | 8-10 | Logical comparison vs. other casino games |
| Most sportsbook lines are copied, not independently set | 41-42 | First-hand industry knowledge |
| Market makers profile customers 1-5 to inform line movement | 48-49 | Mechanical detail w/ Knicks-Bucks example |
| Retail books profile customers to ban/limit | 57-58 | Explicit mechanism (low limits → closure) |
| Federal 0.25% excise tax takes ~25% of market-maker revenue | 55-56 | Arithmetic shown |
| CLV ≥ half the hold over hundreds of bets ≈ predictive of long-term profit | 113-114 | Logically derived, widely corroborated by other sources |
| Props openers are often priced and never updated | 153-154 | Mechanism described |
| Sportsbook in-play delay is 4-8s + favors the book | 208-209 | Described in operational detail |
| Going for broke on deposit bonuses beats grinding | 214-216 | Math worked out fully — counter-intuitive but provably correct |
| Free play / bonus bets: bigger longshot = higher EV, always | 217-218 | Trivial calculation; provably correct |

## Examples / case studies worth preserving

### The Knicks-Bucks 221 Total (p49) — Market-Maker Profiling
Two cancelling bets:
- Bet 1: "Category 2" corporate attorney bets OVER
- Bet 2: "Category 5" pro NBA-totals bettor bets UNDER

Book's response: **move the line DOWN** (favoring under). Why: the sharp's bet carries pricing information; the attorney's bet doesn't. The bets cancel financially but tell the book where the price *should* be. Use as the canonical illustration of "good" profiling (informational), then contrast with retail-book profiling (adversarial).

### The Gold Shop Analogy (p43-44, p59-60)
Retail gold shop Googles "price of gold" and adjusts buy/sell around it; market-maker shop discovers the gold price by quoting. If a retail shop "moved on action" without market-maker infrastructure, **arbitrageurs would scalp it all day.** This is exactly why retail sportsbooks don't move on action — and why they limit anyone who tries to scalp/middle them.

### The Spencer-At-The-Book Scenario (p149-150)
A retail-book derivative market has just been hired by "Spencer" (a stand-in for a junior trader). The book puts up a fresh ML/total derivative — Spencer doesn't know baseball. Bettors who get there fast and bet his bad openers win. But Spencer can learn. He can read Fangraphs. By August he's two steps ahead, baiting you with bad numbers. **Lesson:** weak markets don't stay weak forever; you have to keep watching.

### Go-For-Broke vs Grind on $500 Deposit + $500 Bonus + $10k Rollover (p214-216)
| Strategy | Expected return |
|---|---|
| Grind out rollover at 4% hold | ~$600 (so net +$100) |
| Bet entire $1000 on +200 longshot, repeat on win, then scalp finish | **~$841** (so net +$341) |

The math: most "go-for-broke" plays bust at step 1 (no rollover to pay), the few that survive get a big bankroll. Bookkeeping: don't combine into a single parlay ticket (you'd only get $1000 of rollover credit instead of $4000+); bet legs separately.

### The Free Play +200 Calculation (p217-218)
$100 free play at +200 (30% true win prob): keep winnings only, so EV = 0.30 × $200 = $60.
Same free play at -200 (70% true): EV = 0.70 × $50 = $35.
**Always bet the biggest longshot the free play allows.**

## What's unique vs. other sources

- **The explicit market-maker / retail dichotomy** with a 9-dimension cross-tab. Other books mention "sharp vs square" books but Miller/Davidow are the most rigorous in framing it as two distinct business models.
- **Mechanics of price discovery from the operator side** (low-limit open → bet → move → raise limits → mature → max limits). Rare insider material.
- **The 1-5 profiling framework** as a continuous, mechanical process (not a one-time judgment).
- **The Chopping-the-Hold mental model.** Rare across the literature in its rigor — most sharp-betting books are tactically prescriptive ("look for X opportunities"). Miller/Davidow give the *meta-strategy* that those opportunities serve.
- **The Go-For-Broke math on deposit bonuses.** Specific math, completely counter to popular advice, provably correct.
- **The in-play 4-8s delay exposé.** Specific, operational, name-and-shame quality (without naming names).

## Weak claims / dated material / criticisms

- **2019 context predates** post-PASPA explosion in scale. The "frothy attitudes" window the book describes is largely **over by 2026** — most operators have consolidated and entered the belt-tightening phase Miller predicted. Marketing-budget plays still exist but in narrower form (boost tokens, smaller bonuses, more rollover scrutiny).
- **No specific operator names** — lawyerly, but hurts citability.
- **Light on academic citations** — industry-insider writing.
- **The 1-5 profiling scale is illustrative, not literal** — real systems likely use continuous multi-dimensional scores. Don't quote it as a real system; teach the framework.
- **Prop-market opportunity may be smaller now.** Miller's own prediction (props would become more efficient) has played out; by 2026 prop markets have tightened considerably.

## Where we'd extend or disagree

- **Update for 2026.** Most "retail" books now have in-house sharper modeling than they did in 2019; the binary is more like a continuum. The promo windows are smaller. The retail-vs-market-maker dichotomy still holds at the structural level but specific tactics need updating.
- **Add the dark-pattern / behavioral-design layer.** Miller stops at line-making, customer-curation, and the in-play delay (the one dark pattern he names). The full app-UX layer (parlay builder dopamine, push notifications timed to losses, cashout offers, "live" framing pressure) is where modern retail-book profitability is now concentrated. Funt's *Everybody Loses* + Scientific American dark-patterns reporting fill this.
- **Name the equilibrium.** Miller/Davidow describe the components of the ban-or-bankrupt dynamic without naming it as a formal equilibrium. PROFITPATH's contribution: formalize the model.
- **Extend Chopping-the-Hold into a calculator.** Miller treats it as a mental model; we can make it interactive.

## Reader pain points exposed

LOSB is analytical, so pain points show up as flashes rather than sustained themes. A few worth capturing:

### "I think I know this stuff but I keep losing"
**The 'are you the sucker?' pain.** Miller's opening: *"If you can't spot the sucker, you are the sucker."* The reader's gut response: *am I the sucker?* Pain point: the suspicion that you've been the mark all along.

→ Use for: opening to Path 01 content. The lesson then promises: read this, learn what the sucker doesn't know.

### "I'm doing what every gambling website says — and losing"
**The bad-advice pain.** LOSB systematically demolishes common bettor wisdom:
- "Don't bet parlays, they hold 12.5%" — wrong-in-mechanism
- "Aim for 60% hit rate" — wrong target
- "Grind out the rollover" — leaves money on the table
- "Cashout for the sure win" — almost always −EV

Pain point: *every place you've gone for advice has taught you wrong things, and the wrong things FEEL right.*

→ Use for: openers to debunker content. "If you've ever been told X, you've been getting bad advice. Here's the math."

### "I keep getting limited and I don't know why"
**The blindfolded-account pain.** Miller's retail-book section explains: profile decided in 3 bets, limits ladder up, no transparent communication. Pain point for the reader: *I don't know what behavior got me flagged, the book won't tell me, and I can't fix what I can't see.*

→ Use for: opener to "How books decide you're sharp" or "How to stay under the radar" content.

### "I bet during the game and the spinner keeps spinning"
**The in-play delay pain.** Miller's 4-8 second delay explanation. The reader knows this experience — they've blamed lag, network, themselves. Pain point: *what felt like bad luck or bad WiFi was actually structural.*

→ Use for: opener to "Why your in-play bet takes 8 seconds" exposé.

### "I should be winning, but the math keeps not adding up"
**The hold-blindness pain.** Most readers don't realize they're betting into a 4-6% structural disadvantage *before* they even pick a side. Miller's hold-chopping framework reveals it. Pain point: *I've been competing in a game where I started in a 4-6% hole, and nobody told me.*

→ Use for: opener to the Hold Chopper guide or the "How sportsbook prices actually get made" lesson.

### "The whole thing feels rigged"
**The 'maybe it IS rigged' pain.** Casual bettors sometimes voice this and get dismissed by sharps. LOSB validates the feeling structurally without endorsing the conspiratorial framing: it's not rigged per se, but the system is designed against you in specific, named, mechanical ways.

→ Use for: brand-positioning. PPS takes "the system is stacked against you" seriously without devolving into "everything is fixed" — that's the credible middle.

## Pedagogical patterns

How Miller teaches — what we can borrow, what to avoid. The book is dense but rarely loses the reader; the patterns are worth lifting.

### Effective analogies
- **The Gold Shop** (p43-44, reused p59-60). Persistent multi-chapter analogy: retail gold shop Googles "price of gold" and adjusts buy/sell around it; market-maker shop discovers price by quoting. Reused later to explain why retail books can't "move on action" without getting scalped. **The reuse is the key move** — invest in one strong analogy and amortize it across chapters.
- **Mike McDermott / "spot the sucker"** (p7). Borrows a mental model the reader already has (Rounders) and extends it. Cheap, effective.
- **Spencer the junior trader** (p149-150). Names a hypothetical book employee and walks his learning curve. Gives the abstract "books can adapt over time" a face.
- **Mongolian netball** (p220). Throwaway example for "I could beat any market with a negative hold." Absurd-sport reference gets a laugh while making the point indelible — the concept attaches to the absurdity.

### Sequencing tricks
- **Build assumption → flip it.** Parlays chapter (p36-39): walks the reader through the "parlays hold 12.5% — bad!" assumption with worked numbers, then dismantles it ("Parlays don't hold more. They make you bet more"). The flip is the punchline; the setup makes it land.
- **Concrete scenario before abstract concept.** Market Making chapter: "Let's say I'm a sportsbook and I want to make markets for college football... I just post every game PK -110..." (p45-47). The full mechanical walk-through before naming "price discovery."
- **Provoking question → answer.** "Where does that number come from?" (p41). Sets up the demolition of the Vegas-oracle myth.
- **Foreshadowing.** "I'll explain price discovery in detail in just a moment" (p42). Signals patience to the reader; reduces the urge to skim.

### Counter-intuitive delivery
- **The Go-For-Broke math.** Sets up the obvious assumption ("grind out the rollover, that's how bonuses work"), then walks the math step-by-step to the counter-conclusion. Critically: shows it two different ways (theoretical loss calculation + bankroll-end calculation) because he KNOWS readers won't trust the first proof. "I know this still likely seems like voodoo math, so I will break it down a different way as well" (p215).
- **"Don't aim for 60%."** Anticipates the reader's instinct ("higher hit rate must be better") and inverts it with a logical proof, not data. The argument lands because it's mechanically clean ("Why pass on a 54% bet that wins?").

### Worked examples > abstract math
Almost every math claim uses **specific dollar amounts** and **named teams/sports**, not variables. "Let's say you have $500 deposit + $500 bonus" not "let stake S and bonus B." Examples reference real sports (NFL Sunday, Alabama, Knicks-Bucks) for grounding even when the specifics don't matter. **Lesson for PPS:** plug in real teams and dollar amounts, even in conceptual lessons. Variables alienate.

### Permission-giving language
- "Okay before I move on there's an exception to this concept big enough that I have to mention it." (p38). Signals scope; reader trusts they'll get the whole picture.
- "Honestly, I couldn't tell you how often I've heard that advice." (p36). Self-deprecating, conversational; lowers the activation energy for the counter-claim that follows.
- "TL;DR" replacement: "**Parlays don't hold more. They make you bet more money.**" (p38). Bold one-line summaries used as breaks; let readers re-emerge if they zoned out.

### Voice / tone moves
- **Direct address throughout.** "You" not "the bettor."
- **Self-deprecating humor** to defuse big claims. "I hope Vegas gets paid overtime because that sounds like a lot of work for one guy" (p41). Disarms a potentially defensive reader.
- **Wry asides.** "Then again, this is the actual perverse math of these bonus things" (p214). Calls out his own counter-intuition; reader stays with him.
- **Bullets** used sparingly, mostly for enumerated processes (the 6-step prop finding, in-play modeling errors). Otherwise narrative paragraphs.

### What he chooses NOT to explain
- **The actual data work.** Repeatedly defers modeling/quant analysis to "another book" — keeps focus on logic + structure.
- **Specific operator names.** Lawyerly — never says "FanDuel is a retail book." Trades citability for safety.
- **Probability theory foundations.** Assumes reader can do basic implied-probability math; doesn't re-derive break-even percentages from scratch.

### Where the book loses clarity (less common)
- **Tax / regulatory section** (p55-56) gets dense fast. Three different tax types mentioned in close succession without a clean visual aid; a chart of "tax type → who pays → on what base" would help.
- **The 1-5 profiling system** is described in prose without a visual. A simple "category → behavior pattern → book's response" table would land it better.

### Net takeaways for PPS teaching style
1. **Pick a few strong analogies and reuse them** across multiple lessons (like Miller's gold shop).
2. **Plug in real teams and real dollar amounts** even in conceptual content.
3. **Set up the wrong assumption explicitly before flipping it** — the flip is the lesson; the setup makes the flip land.
4. **Show counter-intuitive math two different ways.** Readers won't trust one proof.
5. **Use direct address and self-deprecating asides.** Trust-builders.
6. **Bold one-line summaries between sections.** "[Bold claim in one sentence]." for re-entry points.
7. **Defer rather than skim.** "I'll explain X later" is more honest than a half-baked aside.

## Content opportunities this book seeds

### Lessons (curriculum)

- **"How sportsbook prices actually get made" (the 3 methods)** — Path 01 lesson, demolishes the Vegas-oracle myth. **HIGH**.
- **"What 'sharp money pounding the line' really means"** — debunks sports-betting-media narratives. Brief, viral-friendly. **HIGH**.
- **"Why parlays don't actually 'hold more'"** — counter-intuitive math reframe (volume amplifier, not bad bet). **HIGH**.
- **"How books grade you (the 1-5 sharpness scale)"** — explanatory lesson; what behaviors push you up/down. **MEDIUM** (don't overclaim it's literal).
- **"Market agreement and resistance — why CLV matters"** — practical: if other sharps think you're wrong, you're probably wrong. **HIGH**.
- **"Attack weak markets" (the practical mantra)** — where edges actually live. **HIGH**.
- **"Why 60% hit rate is the wrong goal"** — counter-intuitive reframe (edge net of hold is what matters). **HIGH**.
- **"Bet during timeouts only" (in-play tactical)** — defeats the 4-8s sportsbook delay. **HIGH**.
- **"The 'go for broke' deposit-bonus method"** — counter-intuitive but provably correct. **HIGH**, slightly controversial framing.
- **"The free play longshot rule"** — book keeps stake, you keep winnings → always longshot. **HIGH**.

### Guides (deep-dive pages)

- **"Market makers vs retail books — and why it matters where you bet"** — 9-dimension cross-tab + practical "find your book's tier" implications. **HIGH**.
- **"The copy-chain fragility"** — most prices are reflections of one price. Integrity-monitoring weakness. **HIGH**.
- **"The 6-step process for finding +EV in props and derivatives"** — Miller's framework ported to PPS voice. **HIGH**.
- **"Chopping the Hold: the master strategy"** — how to systematically subtract from the book's hold using shopping, angles, steam, and cross-derivative comparison. **HIGH**. Could be a flagship strategy guide.
- **"Why your in-play bet takes 8 seconds to confirm" (and what to do about it)** — Miller's exposé adapted. Names the pattern without naming books. **HIGH**.
- **"In-play modeling errors by sport"** — Miller's full chart (p211) ported into a guide. Useful long-tail SEO content. **MEDIUM**.
- **"Why a 0.25% federal tax structurally kills market making"** — policy angle for advanced audience. **SPECULATIVE**.

### Tools / calculators

- **Sportsbook Tier-Map** — visualize which books act market-maker vs retail; user-maintained or quarterly-updated. **HIGH** value, **MEDIUM** to build.
- **The Hold Chopper** (or "Synthetic Market Comparer") — paste prices from multiple books / derivative markets, returns the lowest-hold synthetic. Could become a PPS Original. **HIGH** value, **MEDIUM** to build.
- **Parlay True Volume Calculator** — exposes parlay-as-volume-amplifier math. Extends existing Parlay Calculator. **MEDIUM**.
- **Bonus Strategy Selector** — input offer (deposit + match + rollover), compares grind vs go-for-broke expected returns. **HIGH** value, **EASY** to build.
- **Free Play Longshot Picker** — given free play size, returns the EV-max bet at each available price. **EASY**, single-purpose. Good for SEO ("free play strategy").
- **In-Play Delay Detector** — times the gap between bet submit and confirm at your chosen book. Names-and-shames slow books. **MEDIUM** to build (needs API or extension).
- **CLV Performance Tracker** — already partially in Bet Tracker; emphasize the "half the hold" benchmark. **EASY** to surface in existing tool.
- **Sharpness Profile Diagnostic** — engaging hook but hard to validate without real data. **SPECULATIVE**.

### Originals (in-house content no one else publishes)

- **Ban-or-Bankrupt Equilibrium paper** — Miller/Davidow's business-model dichotomy is the analytical spine. **HIGH**.
- **"How sportsbooks decide what to charge for the bet you want to make"** — 1500-word plain-English original. **HIGH**.
- **"The Hold Chopper" calculator + guide pair** — flagship-quality. Could sit alongside Bet X-Ray as a PPS Original. **HIGH**.
- **"The Go-For-Broke Bonus Method"** — counter-intuitive math, plain-English explanation, accompanying calc. **HIGH**. Goes against conventional advice; brand-aligned.

## Market gaps this book reveals

1. **The market-maker / retail-book dichotomy is essentially absent from public sportsbook reviews.** Every comparison site rates "FanDuel vs DraftKings" on features and promos. Nobody explains they have **fundamentally different business models** affecting whether you'll get limited. **MASSIVE GAP.**

2. **The "lines are copied" reveal is hidden from casual bettors.** Public media treats line movement as unique market intelligence; reality is one market-maker's price propagating through copying. **BIG GAP.**

3. **The 1-5 profiling system is privately known but never explained for bettors.** Sharps know they get tagged; recreationals have no idea. **GAP.**

4. **Parlay-volume math** widely misunderstood. Standard advice ("don't play parlays they hold 12.5%") is wrong-in-mechanism. **GAP.**

5. **CLV's specific benchmark (>50% of the hold over hundreds of bets)** is rarely surfaced as a concrete metric. Everyone says "track CLV"; no one says "at what level CLV indicates you'll actually win." **GAP.**

6. **"Attack weak markets" is the operating thesis of every winning bettor, almost never spelled out for newer ones.** Most "how to bet" guides teach NFL/NBA — the strongest markets, where it's hardest to win. **GAP.**

7. **The in-play 4-8s delay is widely experienced but almost never explained.** Bettors blame "lag" or "network issues." Few public sources name the pattern. **GAP.**

8. **The Go-For-Broke deposit bonus method is publicly counter-intuitive** — almost every "bonus strategy" guide tells you to grind. Miller/Davidow show grinding is mathematically inferior. **BIG GAP — and brand-aligned (against conventional book advice).**

9. **The Chopping-the-Hold mental model** is rarely presented as a unified framework. Sharp bettors apply it intuitively; novices never learn the underlying concept. **GAP.**

10. **The free-play longshot rule** — easy math, almost never explained. Many bettors waste free plays on -110 favorites because that "feels safer." **EASY GAP TO FILL.**

## Direct quotes (sparingly, with page numbers)

> "If you can't spot the sucker in your first half hour at the table, then you are the sucker." (p7 — Rounders / Mike McDermott citation Miller borrows)

> "Sports betting is unique because it's the only game where you are, in fact, playing against the house. The house is an active participant. It's your main, direct adversary." (p8)

> "Sportsbooks copy their lines from other sportsbooks. That's the answer." (p41)

> "Market making books heavily profile customers so they know how best to move their lines in response to action, retail books heavily profile customers so that they can determine which ones they don't want." (p58) — **KEY QUOTE for the Ban-or-Bankrupt paper**

> "To win at sports betting, attack weak markets." (p116) — the operating thesis

> "What your 'smart friends,' the other serious bettors, think of your bets is indeed a very strong predictor of long-term success." (p114) — CLV in plain English

> "I could beat Mongolian netball markets with a negative hold." (p220) — the chopping-the-hold thesis in one line

> "Why the heck would you want to pass on bets that win? There are a lot more 54% bets floating around out there than there are 60% bets." (p220) — the "don't aim for 60%" insight

> "A dirty secret of professional gambling is that a very substantial proportion of the win comes directly and indirectly from the casino or betting operator's marketing budget." (p212)

> "Bet during timeouts only." (p209) — the in-play tactical rule

> "It's literally impossible to win at in-play betting when you're betting into 6.5% hold lines (like -115 on each side) while also subjecting yourself to the TV delay plus the added sportsbook delay." (p209) — the in-play exposé in one line

## Topic tags

For cross-referencing into `library/topics/`:

- `industry-structure-and-regulation` — primary
- `pricing-inefficiencies` — secondary
- `account-profiling` — primary
- `market-making-and-price-discovery` — new topic, primary
- `closing-line-value` — new topic, primary
- `chopping-the-hold` — new topic, primary
- `weak-vs-strong-markets` — new topic, primary
- `props-and-derivatives` — primary
- `bonus-conversion` — primary (go-for-broke math)
- `in-play-betting-and-delay` — new topic, primary
- `dark-patterns-behavioral-design` — secondary (in-play delay is one)
- `psychology-of-the-bettor` — light
- `expected-value-foundations` — secondary
- `parlays-and-sgps` — secondary

## Reading notes for future passes

**Not yet processed (lower priority, future reading):**
- Public Money (p63) — money-flow dynamics, follows Sportsbook Business Models
- Multiway Markets and Futures (p171) — futures-specific betting strategy
- Angles (p181) — specific exploitation patterns; deep dive into how to find them
- Should You Try To Win 60% Or 54%? (p138) — strategic framing chapter; partial coverage from Chopping the Hold
- Beating The Odds (p91) — early Part II concept-grounding
- Related Markets (p122) — useful for chopping-the-hold synthetic-market construction
- The Betting Menu (p128) — closing chapter of Part II
- Taking Advantage of Parlays (p159) — strategic parlay angles
- How Do I Know If I'm Winning? (p227) — closing chapter on tracking/measurement
- Appendix A (p234)

When the Ban-or-Bankrupt paper draft is underway, return for: Public Money, Angles, Multiway Markets, How Do I Know If I'm Winning. These will tighten specific paper sections.
