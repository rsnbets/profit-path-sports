#!/usr/bin/env python3
"""Score an observed break against the board's model.

Takes a recorded break (spot contents + what each spot actually sold for) and
asks whether the board would have helped: does a spot's predicted share track
its price, and which spots were the best and worst buys?

    python scripts/card_prices/score_break.py data/break-results/<file>.json
"""
import json, re, statistics, sys, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
W = [1, 3, 25]          # base / insert / auto, same weights the boards use


def norm(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z ]", "", s).replace(" jr", "").replace(" ii", "").strip()


def load_board(board):
    m = re.search(r"const P=(\{.*?\});\n", (ROOT / f"{board}.html").read_text(), re.S)
    return json.loads(m.group(1))


def main(path):
    br = json.loads(Path(path).read_text())
    P = load_board(br["board"])
    pid = {norm(p): i for i, p in enumerate(P["players"])}
    val = [0.0] * len(P["players"])
    autos = [0] * len(P["players"])
    for _, _, _, pi, b in P["e"]:
        val[pi] += W[b]
        if b == 2:
            autos[pi] += 1
    tot = sum(val)
    take = sum(s["price"] for s in br["spots"])

    rows, missing = [], []
    for s in br["spots"]:
        v = a = 0
        for n in s["players"]:
            i = pid.get(norm(n))
            if i is None:
                missing.append(n); continue
            v += val[i]; a += autos[i]
        fair = take * v / tot
        rows.append({"lead": s["players"][0], "price": s["price"], "fair": fair,
                     "edge": fair - s["price"], "autos": a, "share": 100 * v / tot})

    pr = [r["price"] for r in rows]; sh = [r["share"] for r in rows]
    mp, ms = statistics.mean(pr), statistics.mean(sh)
    cov = sum((a - mp) * (b - ms) for a, b in zip(pr, sh)) / len(pr)
    r = cov / (statistics.pstdev(pr) * statistics.pstdev(sh))

    print(f"{br['product']} — {len(rows)} spots, take ${take:,}")
    if missing:
        print(f"  !! {len(missing)} players not on the checklist: {', '.join(missing[:6])}")
    print(f"  price  mean ${mp:.0f}  range ${min(pr)}-${max(pr)}  spread {max(pr)/min(pr):.2f}x")
    print(f"  fair   mean ${statistics.mean(r_['fair'] for r_ in rows):.0f}  "
          f"range ${min(r_['fair'] for r_ in rows):.0f}-${max(r_['fair'] for r_ in rows):.0f}  "
          f"spread {max(r_['fair'] for r_ in rows)/max(1e-9,min(r_['fair'] for r_ in rows)):.1f}x")
    print(f"  correlation share vs price: r = {r:+.3f}  (r2 = {r*r:.2f})")

    rows.sort(key=lambda x: -x["edge"])
    print(f"\n  {'best buys':<26}{'autos':>6}{'paid':>7}{'fair':>7}{'edge':>8}")
    for x in rows[:5]:
        print(f"  {x['lead'][:24]:<26}{x['autos']:>6}{x['price']:>7}{x['fair']:>7.0f}{x['edge']:>+8.0f}")
    print(f"\n  {'worst buys':<26}{'autos':>6}{'paid':>7}{'fair':>7}{'edge':>8}")
    for x in rows[-5:]:
        print(f"  {x['lead'][:24]:<26}{x['autos']:>6}{x['price']:>7}{x['fair']:>7.0f}{x['edge']:>+8.0f}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else sys.exit("usage: score_break.py <break.json>"))
