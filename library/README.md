# PPS Library

The synthesized knowledge base behind PROFITPATH Sports content. Source material lives here, gets distilled into notes, then synthesized across topics, then turned into our own published work.

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

## Long-term vision

| Tier | Output | Audience |
|------|--------|----------|
| 1 | The library itself (notes + topics) | Internal reference |
| 2 | "The Ban-or-Bankrupt Equilibrium" research paper | Press, policy, academic search |
| 3 | "How the Books Really Work" digestible guide | Bettors, conversion |
| 4 | PPS book manuscript (eventual) | Authority asset |
| 5 | PPS Curriculum (college-class shape) | Long-term moat |

Each tier draws from the one above it. The library is the foundation everything rests on.
