#!/usr/bin/env python3
"""Turn the raw sales store into per-card price summaries for the boards.

Deliberately separate from the fetcher: matching titles to checklist cards is
the part most likely to need fixing, and keeping it downstream means a fix can
be re-run over everything already collected without spending quota again.

A board page embeds its own card list as `const P={...}`, so that page is the
source of truth for which card numbers exist — no second copy to drift.
"""
import json, re, statistics, sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STORE = ROOT / "data" / "card-sales"
OUT = ROOT / "data" / "card-prices"
CONFIG = Path(__file__).parent / "products.json"

CODE = re.compile(r"\b([A-Z]{2,5}-[A-Z0-9]{1,4})\b")
GRADED = re.compile(r"\b(PSA|BGS|SGC|CGC)\s*\d", re.I)
PRINT_RUN = re.compile(r"/\s?(\d{1,4})\b")


def board_cards(board):
    """Card numbers declared by a board page, or None if it has no card index."""
    page = ROOT / f"{board}.html"
    if not page.exists():
        return None
    m = re.search(r"const P=(\{.*?\});\n", page.read_text(), re.S)
    if not m:
        return None
    try:
        P = json.loads(m.group(1))
    except json.JSONDecodeError:
        return None
    if "e" not in P:
        return None
    cards = defaultdict(list)
    for spot, st, no, pi, bucket in P["e"]:
        cards[no.upper()].append({"spot": P["spots"][spot][0], "set": P["sets"][st],
                                  "player": P["players"][pi], "bucket": bucket})
    return cards


def load_sales():
    rows = []
    for f in sorted(STORE.rglob("*.jsonl")):
        for line in f.read_text().splitlines():
            if line.strip():
                rows.append(json.loads(line))
    return rows


def main():
    products = json.loads(CONFIG.read_text())["products"]
    sales = load_sales()
    print(f"{len(sales)} sales in store")

    by_product = defaultdict(list)
    for s in sales:
        by_product[s.get("product")].append(s)

    OUT.mkdir(parents=True, exist_ok=True)
    for p in products:
        board = p.get("board")
        rows = by_product.get(p["slug"], [])
        if not board or not rows:
            continue
        cards = board_cards(board)
        if cards is None:
            print(f"  {p['slug']}: {board} has no card index — skipped")
            continue

        hits, matched, graded_n = defaultdict(list), 0, 0
        for s in rows:
            title = (s.get("title") or "").upper()
            codes = [c for c in set(CODE.findall(title)) if c in cards]
            if not codes:
                continue
            matched += 1
            if GRADED.search(title):          # a graded copy is a different thing
                graded_n += 1
                continue
            pr = PRINT_RUN.search(s.get("title") or "")
            hits[codes[0]].append({"p": s["price"], "d": s["sale_date"],
                                   "id": s["id"], "run": int(pr.group(1)) if pr else None})

        # One card number covers the base card AND every numbered parallel of it,
        # which trade orders of magnitude apart — a /5 selling for $1,500 says
        # nothing about the base card at $20. Summarise each print run on its own.
        out = {}
        for code, lst in hits.items():
            tiers = defaultdict(list)
            for x in lst:
                tiers["base" if x["run"] is None else str(x["run"])].append(x)
            entry = {}
            for tier, rows_ in tiers.items():
                rows_.sort(key=lambda x: x["d"])
                prices = [x["p"] for x in rows_ if x["p"]]
                if not prices:
                    continue
                last = rows_[-1]
                entry[tier] = {
                    "last": round(last["p"], 2), "date": last["d"], "id": last["id"],
                    "n": len(prices), "median": round(statistics.median(prices), 2),
                    "low": round(min(prices), 2), "high": round(max(prices), 2),
                }
            if entry:
                out[code] = entry
        path = OUT / f"{board}.json"
        path.write_text(json.dumps({"cards": out, "generated": max((s["sale_date"] for s in rows), default=None)},
                                   separators=(",", ":"), sort_keys=True) + "\n")
        pct = 100 * matched / len(rows)
        print(f"  {p['slug']}: {len(rows)} sales -> {matched} matched ({pct:.0f}%), "
              f"{graded_n} graded excluded, {len(out)} cards priced -> {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
