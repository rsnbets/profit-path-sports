# PPS Library

The synthesized knowledge base behind PROFITPATH Sports — the institutional memory of the entire site.

> **Start here:** [`INDEX.md`](INDEX.md) — the living master document. Current state of the field, where sources agree/conflict, gaps PPS can fill, and what content the library is feeding into next. Updated every session.
>
> This README documents the *workflow* (templates, conventions, copyright). The INDEX documents the *knowledge*.

**This is not a research project for one paper. It's the spine of every guide, lesson, tool, and content piece PPS ships going forward.** Every book we process here surfaces:

- Frameworks and concepts to teach (→ lessons)
- Specific tactics to operationalize (→ guides)
- Math that can be made interactive (→ calculators)
- Gaps in the public market — things no one's explaining well (→ originals)
- Citations and authority for everything we publish

Source material lives here, gets distilled into notes, synthesized across topics, then turned into the actual products visitors see.

## Directory layout

```
library/
├── source-pdfs/    ← raw PDFs (gitignored — copyrighted material)
├── notes/          ← one synthesis file per book (ours, committed)
├── topics/         ← cross-book synthesis by subject (ours, committed)
└── our-book/       ← eventual long-form manuscript (down the road)
```

## What goes where

### `source-pdfs/`
- Raw PDFs uploaded by the user
- **Never committed to git.** Listed in `.gitignore`.
- Naming convention: `lastname-title-keyword.pdf` (e.g. `miller-davidow-interception.pdf`).
  Doesn't have to be perfect — anything readable works.

### `notes/`
- One markdown file per book.
- Filename: `{book-slug}.md` (lowercase, hyphens, e.g. `interception-miller-davidow.md`).
- Our work, not the original text. Paraphrases, frameworks, examples, our analysis.
- Stays under copyright respect — direct quotes only with page numbers, used sparingly.

**Template** (used for every book):

```markdown
# [Title] — [Authors] ([Year])

## Bibliography
ISBN, publisher, where acquired, edition.

## Thesis in one paragraph
What the book is actually arguing.

## Key frameworks / named concepts
The book's intellectual contributions — taxonomies, models, named ideas.

## Strongest claims (with evidence)
Well-defended points. Cite page numbers.

## Examples / case studies worth preserving
Specific scenarios, anonymized as needed.

## What's unique vs. other sources
Where this book covers ground others don't.

## Weak claims / dated material / criticisms
Honest assessment. We'll need this for reconciliation.

## Where we'd extend or disagree
PPS's POV on the material.

## Reader pain points exposed
Specific moments in the source where the author surfaces a pain
point the reader feels (or has felt). These become:
  - **Opening hooks** for PPS content ("Lead with the pain, deliver
    the math")
  - **Empathy bridges** — show we understand the reader's situation
    before we sell the solution
  - **Trust signals** — acknowledging the dark side makes us
    credible vs hype-merchants
  - **Lead-gen angles** — pain-point search queries (e.g., "why does
    FanDuel keep limiting me") are real demand

For each pain point: a 1-sentence description + which content
piece could lead with it.

Even a book that's analytically thin can be rich here. Hit this
section harder when the source is journalism, memoir, or a
beginner guide; lighter when the source is pure analytics.

## Pedagogical patterns
How the author teaches — what we can borrow, what to avoid.
The published book has already done significant work figuring out
how to explain hard concepts. Track:
  - **Effective analogies** (memorable, accurate, transferable)
  - **Sequencing tricks** (build assumption → flip it; concrete → abstract; etc.)
  - **Borrowed mental models** (using reader's existing frames)
  - **Counter-intuitive delivery patterns** (how they cushion surprising claims)
  - **Worked examples vs abstract math** (when do they switch?)
  - **Permission-giving language** (cushion phrases, foreshadowing, etc.)
  - **Named-character scenarios** (Spencer-the-trader, "your friend with the gold")
  - **Voice / tone moves** (self-deprecation, direct address, etc.)
  - **What they choose NOT to explain** (assumed background, deferrals)
  - **Where they lose clarity** (overload, jargon, etc. — what to avoid)

Each item: a short observation + 1-2 example references. Becomes
the meta-layer for HOW PPS teaches across all our content.

## Content opportunities this book seeds
What PPS could ship informed by this material:
  - Lessons (curriculum pieces) — concepts to teach plainly
  - Guides (deep-dive pages) — angles to explore in depth
  - Tools (calculators / interactive) — math worth making clickable
  - Originals — frameworks no one else has ported into plain English

Each item: one-line description + a confidence tag (HIGH / MEDIUM /
SPECULATIVE) for whether the book's evidence supports it.

## Market gaps this book reveals
Things this book covers that nothing in the public market does well:
  - Concepts widely misunderstood (correction opportunities)
  - Math no public tool exposes
  - Strategies talked about but never explained step-by-step
  - Industry practices no one explains in newbie language

Each item: one-line description + why it's a gap (no one's done it /
done badly / behind a paywall / etc.).

## Direct quotes (sparingly, with page numbers)
For attribution when we cite later.

## Topic tags
For cross-referencing into /topics/.
```

### `topics/`
- One markdown file per subject area.
- Filename: `{topic-slug}.md` (e.g. `pricing-inefficiencies.md`, `account-profiling.md`).
- Synthesizes the views of ALL books that touch a topic.
- Resolves conflicts. Names where books disagree and why we side one way.
- This is where original PROFITPATH thinking gets recorded.

**Likely topics** (will grow as we read):
- `pricing-inefficiencies.md`
- `account-profiling.md`
- `dark-patterns-behavioral-design.md`
- `kelly-criterion-and-sizing.md`
- `expected-value-foundations.md`
- `closing-line-value.md`
- `devig-methods.md`
- `parlays-and-sgps.md`
- `bonus-conversion.md`
- `arbitrage-and-hedging.md`
- `middles.md`
- `industry-structure-and-regulation.md`
- `psychology-of-the-bettor.md`

### `our-book/`
- Empty for now.
- Eventually houses the manuscript for PPS's own book, drafted from `topics/` syntheses.
- Long-term goal: book-length authority asset.

## Workflow

1. **Drop PDFs** in `source-pdfs/` as you acquire them.
2. **Claude processes one book per session** (or a few short ones), producing `notes/{book-slug}.md`.
3. **After every 3-5 books**, Claude updates relevant `topics/` syntheses with the new material.
4. **At ~15 books processed**, we have enough for the first research paper draft (Ban-or-Bankrupt).
5. **At full library**, we have enough for an original book + a college-level curriculum.

## Copyright posture

- We **never reproduce copyrighted text verbatim** in committed files.
- We **paraphrase, synthesize, and cite**.
- Direct quotes are limited (under fair use), always attributed with page numbers.
- The PDFs themselves stay gitignored.
- Anything we publish (paper, guides, eventual book) is our original work informed by these sources.

## What the library generates

The library isn't a tier system — it's a content engine. Every book processed feeds into multiple output streams:

| Output stream | What it produces |
|---|---|
| **Lessons** (Paths 01–03 curriculum) | Plain-English concept teaching, fed by `notes/` and `topics/` |
| **Deep-dive guides** | Long-form pages on specific angles (e.g., "How sportsbooks really set prices") |
| **Calculators / tools** | Math we expose interactively — many tool ideas surface in book notes |
| **PPS Originals** | Frameworks no one else has ported into plain English (Bet X-Ray, Triple Stack — and more to come) |
| **The Ban-or-Bankrupt Research Paper** | One specific scholarly-style output, drawing from `topics/industry-structure-and-regulation.md` and related |
| **Eventual PPS book** | Long-form manuscript synthesizing the whole library |
| **The PPS Curriculum** | College-class-shaped catalog of every concept the library covers |

Each `notes/` file flags **content opportunities** explicitly. After every 3-5 books we roll those up into a master pipeline doc (`library/content-opportunities.md`) so we can see across the whole library what to ship next.

The library is also our **market gap detector** — when we read across books, we naturally surface concepts and tactics nobody has explained well publicly. Those gaps are PPS's content roadmap.
