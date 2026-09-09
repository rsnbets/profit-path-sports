/* PROFITPATH Sports — Key-Number Toolkit math (pure, no DOM).
 * Works in the browser (window.KeyNum) and under node (module.exports) so the
 * numbers can be unit-tested outside the page.
 *
 * Conventions
 *   m  = HOME margin (home score − away score), an integer; ties ignored.
 *   x  = HOME spread line (−3.5 means home favoured by 3.5). Away line = −x.
 *   S(t) = P(m > t) — the "survival" curve of the margin, known at half-points
 *          straight from two-sided de-vigged prices: a home −3.5 / away +3.5
 *          pair prices P(m > 3.5) directly, with no push to muddy it.
 *   P(m = k) = S(k − 0.5) − S(k + 0.5)   ← the push / landing table.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.KeyNum = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const SHARP_BOOKS = new Set(['pinnacle', 'circa', 'novig', 'prophetexchange',
    'betfairexchange', 'matchbook', 'lowvig', 'bookmakereu']);

  // ─── odds helpers ───
  function toProb(a) {                       // American → implied probability (vig included)
    a = Number(a);
    if (!isFinite(a) || a === 0) return null;
    return a > 0 ? 100 / (a + 100) : -a / (-a + 100);
  }
  function toDecimal(a) { const p = toProb(a); return p ? 1 / p : null; }
  function probToAmerican(p) {                // fair probability → American odds (number)
    if (!(p > 0 && p < 1)) return null;
    return p >= 0.5 ? -Math.round(100 * p / (1 - p)) : Math.round(100 * (1 - p) / p);
  }
  function decToAmerican(d) {
    if (!(d > 1)) return null;
    return d >= 2 ? Math.round((d - 1) * 100) : -Math.round(100 / (d - 1));
  }
  function fmtAmerican(a) {
    if (a === null || a === undefined || !isFinite(a)) return '—';
    a = Math.round(a);
    if (a === 0 || a === 100 || a === -100) return 'EVEN';
    return (a > 0 ? '+' : '') + a;
  }
  // "cents" scale: −110 → −10, +105 → +5, EVEN → 0. Distance between two prices
  // in cents = |cents(a) − cents(b)|, which is how bettors talk ("25 cents").
  function cents(a) { a = Number(a); return a > 0 ? a - 100 : a + 100; }
  function centsBetween(a, b) { return cents(b) - cents(a); }   // + = b is a better price for the bettor
  function devigPower(p1, p2) {              // power method: p1^k + p2^k = 1
    if (!(p1 > 0 && p2 > 0)) return null;
    let lo = 0, hi = 10;
    for (let i = 0; i < 60; i++) {
      const k = (lo + hi) / 2;
      if (Math.pow(p1, k) + Math.pow(p2, k) > 1) lo = k; else hi = k;
    }
    const k = (lo + hi) / 2;
    return Math.pow(p1, k);
  }
  function median(arr) {
    const a = arr.slice().sort((p, q) => p - q), n = a.length;
    if (!n) return null;
    return n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2;
  }
  function isHalf(v) { return Math.abs(v * 2 - Math.round(v * 2)) < 1e-9 && Math.abs(v - Math.round(v)) > 1e-9; }

  // ─── Pool-adjacent-violators: weighted monotone (non-increasing) fit ───
  function pavNonIncreasing(ys, ws) {
    const blocks = ys.map((y, i) => ({ sum: y * ws[i], w: ws[i], n: 1 }));
    let i = 0;
    while (i < blocks.length - 1) {
      const a = blocks[i], b = blocks[i + 1];
      if (a.sum / a.w < b.sum / b.w - 1e-12) {        // violation: later value higher
        blocks.splice(i, 2, { sum: a.sum + b.sum, w: a.w + b.w, n: a.n + b.n });
        if (i > 0) i--;
      } else i++;
    }
    const out = [];
    blocks.forEach(b => { for (let k = 0; k < b.n; k++) out.push(b.sum / b.w); });
    return out;
  }

  /**
   * Build the margin survival curve S(t) for one game from its spread ladder.
   * @param spread  {homeLineKey: {book: [homeOdds, awayOdds]}}
   * @param opts    {source: 'median'|'sharp', minBooks: 1}
   * @returns {rungs, S, dist, meta}
   */
  function buildLadder(spread, opts) {
    opts = opts || {};
    const source = opts.source || 'median';
    const minBooks = opts.minBooks || 1;
    const rungs = [];                                   // half-point rungs only
    const wholeRungs = [];                              // whole numbers kept for validation/pricing
    for (const key of Object.keys(spread || {})) {
      const x = parseFloat(key);
      if (!isFinite(x)) continue;
      const perBook = {}, sharp = [], all = [];
      for (const [bk, pair] of Object.entries(spread[key])) {
        const ph = toProb(pair[0]), pa = toProb(pair[1]);
        if (!ph || !pa) continue;
        const f = devigPower(ph, pa);                   // P(home covers at x), de-vigged
        if (f === null) continue;
        perBook[bk] = f; all.push(f);
        if (SHARP_BOOKS.has(bk)) sharp.push(f);
      }
      if (!all.length) continue;
      const cons = (source === 'sharp' && sharp.length)
        ? sharp.reduce((s, v) => s + v, 0) / sharp.length
        : median(all);
      const r = { x, t: -x, cover: cons, n: all.length, nSharp: sharp.length, perBook,
                  sharpUsed: source === 'sharp' && sharp.length > 0 };
      if (isHalf(x)) rungs.push(r); else wholeRungs.push(r);
    }
    rungs.sort((a, b) => a.t - b.t);                    // by margin threshold t = −x
    const used = rungs.filter(r => r.n >= minBooks);
    // S(t) = P(m > t) = P(home covers at x = −t). Must be non-increasing in t.
    const fitted = pavNonIncreasing(used.map(r => r.cover), used.map(r => Math.sqrt(r.n)));
    used.forEach((r, i) => { r.raw = r.cover; r.S = fitted[i]; });
    const ts = used.map(r => r.t), Ss = used.map(r => r.S);
    const tMin = ts.length ? ts[0] : null, tMax = ts.length ? ts[ts.length - 1] : null;

    function S(t) {                                     // interpolate; clamp outside the ladder
      if (!ts.length) return null;
      if (t <= tMin) return t === tMin ? Ss[0] : null;
      if (t >= tMax) return t === tMax ? Ss[Ss.length - 1] : null;
      let i = 0;
      while (i < ts.length - 1 && ts[i + 1] < t) i++;
      if (Math.abs(ts[i] - t) < 1e-9) return Ss[i];
      const t0 = ts[i], t1 = ts[i + 1], s0 = Ss[i], s1 = Ss[i + 1];
      return s0 + (s1 - s0) * (t - t0) / (t1 - t0);
    }
    // landing distribution P(m = k) for every k the ladder brackets
    const dist = {};
    if (ts.length) {
      for (let k = Math.ceil(tMin + 0.5); k <= Math.floor(tMax - 0.5); k++) {
        const a = S(k - 0.5), b = S(k + 0.5);
        if (a !== null && b !== null) dist[k] = Math.max(0, a - b);
      }
    }
    // consensus main line = the home line quoted by the most books (any rung)
    let main = null, mainN = -1;
    for (const key of Object.keys(spread || {})) {
      const n = Object.keys(spread[key]).length;
      if (n > mainN) { mainN = n; main = parseFloat(key); }
    }
    return { rungs: used, wholeRungs, S, dist, tMin, tMax,
             meta: { source, mainHomeLine: main, mainBooks: mainN,
                     nRungs: used.length, sharpRungs: used.filter(r => r.nSharp > 0).length,
                     tailLow: ts.length ? 1 - Ss[0] : null,           // P(m ≤ tMin)
                     tailHigh: ts.length ? Ss[Ss.length - 1] : null } }; // P(m > tMax)
  }

  /**
   * Win / push / loss probabilities for a bet on `side` at `line` (that side's own
   * line: home −3 or away +3), from the survival curve.
   */
  function sideProbs(ladder, side, line) {
    const S = ladder.S;
    const L = Number(line);
    if (!isFinite(L)) return null;
    let win, push = 0;
    if (side === 'home') {                              // covers when m + L > 0  ⇔  m > −L
      if (isHalf(L)) { win = S(-L); }
      else { win = S(-L + 0.5); const a = S(-L - 0.5); push = (a !== null && win !== null) ? a - win : null; }
    } else {                                            // away covers when m < L
      if (isHalf(L)) { const s = S(L); win = s === null ? null : 1 - s; }
      else { const s1 = S(L - 0.5), s2 = S(L + 0.5);    // P(m < L) = 1 − P(m > L − 0.5)
             win = s1 === null ? null : 1 - s1; push = (s1 !== null && s2 !== null) ? s1 - s2 : null; }
    }
    if (win === null || push === null) return null;
    win = Math.min(1, Math.max(0, win)); push = Math.min(1, Math.max(0, push));
    return { win, push, loss: Math.max(0, 1 - win - push) };
  }
  // fair decimal price for a win/push/loss bet: stake refunded on a push
  function fairDecimal(p) { return p && p.win > 0 ? (1 - p.push) / p.win : null; }
  function fairAmerican(p) { const d = fairDecimal(p); return d ? decToAmerican(d) : null; }
  // EV per $1 at American odds `a` given win/push/loss
  function evAt(p, a) {
    const d = toDecimal(a);
    if (!p || !d) return null;
    return p.win * (d - 1) - p.loss;
  }

  // ─── (a) Half-point buy: what a move from lineA → lineB is worth vs what a book charges ───
  function buyAnalysis(ladder, spread, side, lineA, lineB) {
    const pA = sideProbs(ladder, side, lineA), pB = sideProbs(ladder, side, lineB);
    if (!pA || !pB) return null;
    const fairA = fairAmerican(pA), fairB = fairAmerican(pB);
    const worth = centsBetween(fairB, fairA);           // cents the fair price moves (positive = B costs more)
    const idx = side === 'home' ? 0 : 1;
    const keyA = lineKey(side === 'home' ? lineA : -lineA), keyB = lineKey(side === 'home' ? lineB : -lineB);
    const books = [];
    const atA = spread[keyA] || {}, atB = spread[keyB] || {};
    for (const bk of Object.keys(atA)) {
      if (!atB[bk]) continue;
      const a = Number(atA[bk][idx]), b = Number(atB[bk][idx]);
      const charge = centsBetween(b, a);
      books.push({ book: bk, priceA: a, priceB: b, charge, overcharge: charge - worth,
                   evA: evAt(pA, a), evB: evAt(pB, b) });
    }
    books.sort((p, q) => p.charge - q.charge);
    return { pA, pB, fairA, fairB, worth, books };
  }
  function lineKey(v) {                                 // must match the feed's key format
    v = Number(v);
    if (v === 0) return '0';
    return String(parseFloat(v.toFixed(2)));
  }

  // ─── (b) Teasers ───
  function crossesKeys(lineFrom, lineTo, keys) {
    const a = Math.abs(lineFrom), b = Math.abs(lineTo);
    if (lineFrom * lineTo < 0) return [];               // crosses zero — different animal
    const lo = Math.min(a, b), hi = Math.max(a, b);
    return keys.filter(k => k >= lo && k <= hi);
  }
  /**
   * Teaser EV by enumerating win/push/loss for each leg.
   * Rule modelled: a pushed leg drops the teaser to the next size; if fewer than
   * 2 legs remain the ticket is refunded. Any loss loses the ticket.
   * @param legs   [{win, push, loss}]
   * @param payouts {2: american, 3: american, 4: american, ...}
   */
  function teaserEV(legs, payouts) {
    const n = legs.length;
    if (n < 2) return null;
    let ev = 0, pWin = 0, pPush = 0;
    const total = Math.pow(3, n);
    for (let code = 0; code < total; code++) {
      let c = code, prob = 1, losses = 0, pushes = 0;
      for (let i = 0; i < n; i++) {
        const o = c % 3; c = Math.floor(c / 3);
        const leg = legs[i];
        if (o === 0) prob *= leg.win; else if (o === 1) { prob *= leg.push; pushes++; } else { prob *= leg.loss; losses++; }
      }
      if (!prob) continue;
      if (losses) { ev -= prob; continue; }
      const remain = n - pushes;
      if (remain < 2) { pPush += prob; continue; }      // refund
      const d = toDecimal(payouts[remain]);
      if (!d) { pPush += prob; continue; }
      ev += prob * (d - 1); pWin += prob;
    }
    return { ev, pWin, pPush, pLoss: 1 - pWin - pPush,
             breakEvenLeg: Math.pow(toProb(payouts[n]), 1 / n) };   // per-leg prob needed, no pushes
  }
  /** Every teasable spread leg on the slate at teaser size T (points). */
  function teaserLegs(games, ladders, T, keys) {
    keys = keys || [3, 7];
    const out = [];
    games.forEach((g, gi) => {
      const lad = ladders[gi];
      if (!lad || lad.meta.mainHomeLine === null) return;
      const x = lad.meta.mainHomeLine;
      [['home', x], ['away', -x]].forEach(([side, L]) => {
        const teased = L + T;
        const p = sideProbs(lad, side, teased);
        if (!p) return;
        const crossed = crossesKeys(L, teased, keys);
        out.push({ game: g, gi, side, team: side === 'home' ? g.home : g.away, line: L, teased, probs: p,
                   crossed, wong: crossed.length === keys.length,
                   fairTeased: fairAmerican(p) });
      });
    });
    out.sort((a, b) => b.probs.win - a.probs.win);
    return out;
  }

  return { SHARP_BOOKS, toProb, toDecimal, probToAmerican, decToAmerican, fmtAmerican, cents, centsBetween,
           devigPower, median, isHalf, pavNonIncreasing, buildLadder, sideProbs, fairDecimal, fairAmerican,
           evAt, buyAnalysis, lineKey, crossesKeys, teaserEV, teaserLegs };
});
