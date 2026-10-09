#!/usr/bin/env python3
"""Incrementally pull card sales and append them to an on-repo store.

Design notes, because they are not obvious:

* The daily quota counts ROWS RETURNED, not requests, so the cost of a product
  is its whole sales volume — not the subset we can match to a checklist.
* Sales are indexed with roughly a two-day lag. Filtering on sale_date would
  silently lose most of them, so we sync on `indexed_after` instead.
* Rows carry no index timestamp, so the next watermark is the run's start time
  minus an overlap. Overlapping rows re-appear and are dropped by `id`.
* Each UTC day is written to its own file and never rewritten. An append-only
  single file would make git store a fresh copy of the whole thing every day.
"""
import json, os, sys, time, urllib.parse, urllib.request, urllib.error
from datetime import datetime, timedelta, timezone
from pathlib import Path

API = "https://www.thecardapi.com/api/v1/market/sales"
ROOT = Path(__file__).resolve().parents[2]
STORE = ROOT / "data" / "card-sales"
STATE = STORE / "_state.json"
CONFIG = Path(__file__).parent / "products.json"

OVERLAP_HOURS = 3        # re-ask for a little already-seen data; id dedupes it
BOOTSTRAP_DAYS = 7       # first run: take the whole window the tier allows
PAGE = 1000              # API maximum
QUOTA_FLOOR = 250        # stop before exhausting the day's allowance

KEEP = ("id", "platform", "listing_type", "title", "price", "sale_date", "print_run")


def get(url, key):
    req = urllib.request.Request(url, headers={"x-market-api-key": key})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read()), dict(r.headers)
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < 3:
                time.sleep(2 ** attempt * 3)
                continue
            raise
        except urllib.error.URLError:
            if attempt < 3:
                time.sleep(2 ** attempt * 3)
                continue
            raise
    raise RuntimeError("unreachable")


def fetch(product, since, key):
    """Yield trimmed rows for one product, newest first, following the cursor."""
    cursor, seen, remaining = None, 0, None
    while True:
        params = {"q": product["q"], "limit": PAGE, "indexed_after": since}
        if cursor:
            params["cursor"] = cursor
        body, headers = get(API + "?" + urllib.parse.urlencode(params), key)

        rem = headers.get("x-ratelimit-remaining")
        if rem is not None:
            remaining = int(rem)

        rows = body.get("data") or []
        for row in rows:
            yield {k: row.get(k) for k in KEEP}
        seen += len(rows)

        if remaining is not None and remaining < QUOTA_FLOOR:
            print(f"    ! stopping early, {remaining} rows of quota left", file=sys.stderr)
            break
        cursor = (body.get("pagination") or {}).get("next_cursor")
        if not cursor or not rows:
            break
    print(f"    {seen} rows returned" + (f", quota left {remaining}" if remaining is not None else ""))


def main():
    key = os.environ.get("TCA_API_KEY")
    if not key:
        sys.exit("TCA_API_KEY is not set")

    cfg = json.loads(CONFIG.read_text())["products"]
    state = json.loads(STATE.read_text()) if STATE.exists() else {}
    started = datetime.now(timezone.utc)

    # Everything this run collects, bucketed by the UTC day it was indexed into
    # our store (not the sale date — a day's file must never be rewritten).
    day_file = STORE / f"{started:%Y}" / f"{started:%m}" / f"{started:%Y-%m-%d}.jsonl"
    day_file.parent.mkdir(parents=True, exist_ok=True)

    known = set()
    for existing in sorted(STORE.rglob("*.jsonl")):
        for line in existing.read_text().splitlines():
            if line.strip():
                known.add(json.loads(line)["id"])
    print(f"store holds {len(known)} sales")

    fresh, per_product = [], {}
    for p in cfg:
        since = state.get(p["slug"], (started - timedelta(days=BOOTSTRAP_DAYS)).strftime("%Y-%m-%dT%H:%M:%SZ"))
        print(f"  {p['slug']}: indexed_after={since}")
        kept = 0
        for row in fetch(p, since, key):
            if row["id"] in known:
                continue
            known.add(row["id"])
            row["product"] = p["slug"]
            fresh.append(row)
            kept += 1
        per_product[p["slug"]] = kept
        state[p["slug"]] = (started - timedelta(hours=OVERLAP_HOURS)).strftime("%Y-%m-%dT%H:%M:%SZ")

    if fresh:
        with day_file.open("a") as fh:
            for row in fresh:
                fh.write(json.dumps(row, separators=(",", ":"), ensure_ascii=False) + "\n")
    STATE.write_text(json.dumps(state, indent=1, sort_keys=True) + "\n")

    print(f"\nnew sales: {sum(per_product.values())}  " +
          "  ".join(f"{k}={v}" for k, v in per_product.items()))
    print(f"written to {day_file.relative_to(ROOT)}" if fresh else "nothing new")


if __name__ == "__main__":
    main()
