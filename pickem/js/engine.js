/* PPS Pick'em: "who can still win" engine.
 *
 * Port of pickem-handoff/engine-reference.js. Same math, same outputs; the
 * internals are packed so a 14-game Sunday with 50 players recomputes fast
 * enough to run on a phone. Exact enumeration of every 2^n ending, no sampling.
 *
 * Inputs
 *   games:   [{ id, away, home, status: 'pre'|'live'|'final', away_score, home_score, p_home }]
 *            p_home = de-vigged market win % for the home team, frozen at kickoff.
 *   players: [{ name, picks: { [gameId]: 'H'|'A' }, tb }]   tb = tiebreak guess (MNF total)
 *   opts:    { mu, sd, rules: { tie: 'nobody'|'all' } }
 *            mu, sd = tiebreak total distribution (market total, fitted SD).
 *
 * analyze({ forced, known, light })
 *   forced = what-if results { [gameId]: 'H'|'A' }
 *   known  = treat only these finals as decided (feed replay), else every 'final' game
 *   light  = skip tiebreak shares (status only, faster)
 *
 * Ties: a final with equal scores is decided with winner 'T'. Nobody's pick
 * matches it, so by default nobody gets the point. rules.tie = 'all' gives
 * everyone who made a pick the point instead.
 *
 * Blank picks never match anything, so a missed pick counts wrong.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.PickemEngine = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // popcount lookup for 16-bit words (two lookups cover a 32-bit mask).
  var POP16 = new Uint8Array(65536);
  for (var i = 1; i < 65536; i++) POP16[i] = POP16[i >> 1] + (i & 1);
  function popcount(x) { return POP16[x & 0xffff] + POP16[(x >>> 16) & 0xffff]; }

  // Discretized normal over integer totals 0..120.
  function totalDist(mu, sd) {
    var out = [], s = 0;
    for (var t = 0; t <= 120; t++) { var z = (t - mu) / sd; var v = Math.exp(-0.5 * z * z); out.push(v); s += v; }
    return out.map(function (v) { return v / s; });
  }
  // Distance of guess g from total t. A missing guess (null) is never closest.
  function dist(g, t) { return (g === null || g === undefined || isNaN(g)) ? 1e9 : Math.abs(t - g); }
  function closest(gs, t) { var b = 1e9; for (var k = 0; k < gs.length; k++) b = Math.min(b, dist(gs[k], t)); return b; }

  // Share of the tiebreak each tied player wins. Closest absolute guess wins;
  // equal distance splits evenly. td = totalDist(mu, sd).
  function tbSharesWith(td, gs) {
    var out = gs.map(function () { return 0; });
    for (var t = 0; t <= 120; t++) {
      var b = closest(gs, t), n = 0, k;
      for (k = 0; k < gs.length; k++) if (dist(gs[k], t) === b) n++;
      for (k = 0; k < gs.length; k++) if (dist(gs[k], t) === b) out[k] += td[t] / n;
    }
    return out;
  }
  // Integer MNF totals where guess k is (co-)closest. Returns [lo, hi] or [null, null].
  function tbRange(gs, k) {
    var lo = null, hi = null;
    if (gs[k] === null || gs[k] === undefined) return [null, null];
    for (var t = 0; t <= 120; t++) if (dist(gs[k], t) === closest(gs, t)) { if (lo === null) lo = t; hi = t; }
    return [lo, hi];
  }

  function makeEngine(games, players, opts) {
    opts = opts || {};
    var mu = opts.mu, sd = opts.sd;
    var rules = opts.rules || {};
    var tieRule = rules.tie || 'nobody';
    var td = totalDist(mu, sd);
    var byId = {};
    games.forEach(function (g) { byId[g.id] = g; });
    var winner = function (g) {
      var a = Number(g.away_score), h = Number(g.home_score);
      return h > a ? 'H' : a > h ? 'A' : 'T';
    };
    var tbCache = {};
    function tbShares(gs) {
      var key = gs.join(',');
      if (!tbCache[key]) tbCache[key] = tbSharesWith(td, gs);
      return tbCache[key];
    }

    function analyze(o) {
      o = o || {};
      var forced = o.forced || {}, known = o.known || null, light = !!o.light;
      var dec = {};
      games.forEach(function (g) {
        var isFinal = known ? known.indexOf(g.id) >= 0 : g.status === 'final';
        dec[g.id] = isFinal ? winner(g) : (forced[g.id] || null);
      });
      var U = games.filter(function (g) { return dec[g.id] === null; }).map(function (g) { return g.id; });
      var n = U.length, N = 1 << n;
      var P = players.length;

      // Points already decided (finals + what-ifs).
      var base = players.map(function (p) {
        var a = 0;
        games.forEach(function (g) {
          var d = dec[g.id];
          if (!d) return;
          var pk = p.picks[g.id];
          if (d === 'T') { if (tieRule === 'all' && pk) a++; return; }
          if (pk === d) a++;
        });
        return a;
      });
      // Per-player bitmasks over U: bit j set = picked home (maskH) / away (maskA).
      var maskH = new Int32Array(P), maskA = new Int32Array(P);
      players.forEach(function (p, i) {
        U.forEach(function (gid, j) {
          var pk = p.picks[gid];
          if (pk === 'H') maskH[i] |= (1 << j);
          else if (pk === 'A') maskA[i] |= (1 << j);
        });
      });
      // Ending weights: product of p_home / (1 - p_home) over the bits of m.
      var pH = U.map(function (gid) { return byId[gid].p_home; });
      var ALL = N - 1;

      var win = new Float64Array(P), sole = new Int32Array(P), inTop = new Int32Array(P);
      var outcomes = new Array(N);
      var pts = new Int32Array(P);
      for (var m = 0; m < N; m++) {
        var w = 1;
        for (var j = 0; j < n; j++) w *= ((m >> j) & 1) ? pH[j] : 1 - pH[j];
        var top = -1, i;
        for (i = 0; i < P; i++) {
          var v = base[i] + popcount(m & maskH[i]) + popcount((~m & ALL) & maskA[i]);
          pts[i] = v; if (v > top) top = v;
        }
        var S = [];
        for (i = 0; i < P; i++) if (pts[i] === top) S.push(i);
        var pw = {};
        if (S.length === 1) { pw[S[0]] = 1; sole[S[0]]++; }
        else if (!light) {
          var sh = tbShares(S.map(function (k) { return players[k].tb; }));
          S.forEach(function (k, q) { pw[k] = sh[q]; });
        }
        for (i = 0; i < S.length; i++) { inTop[S[i]]++; win[S[i]] += w * (pw[S[i]] || 0); }
        outcomes[m] = { m: m, w: w, S: S, pw: pw };
      }
      var status = players.map(function (p, i) {
        return inTop[i] === 0 ? 'Out' : sole[i] === N ? 'Clinched' : sole[i] === 0 ? 'Tiebreak only' : 'Alive';
      });
      var res = {
        U: U, N: N, outcomes: outcomes, base: base,
        win: Array.prototype.slice.call(win), sole: Array.prototype.slice.call(sole), inTop: Array.prototype.slice.call(inTop),
        status: status, max: base.map(function (b) { return b + n; }),
        decided: dec, forced: forced,
        side: function (m, j) { return ((m >> j) & 1) ? 'H' : 'A'; }
      };
      return res;
    }

    // What player i needs. Must-haves, then "plus k of" when exact, else likeliest path.
    function needs(res, i) {
      var N = res.N, U = res.U, n = U.length;
      var inW = new Uint8Array(N), W = [];
      for (var m = 0; m < N; m++) { var o = res.outcomes[m]; if (o.S.indexOf(i) >= 0) { inW[m] = 1; W.push(o); } }
      if (!W.length) return null;
      var must = [], rel = [], mustMask = 0, mustVal = 0;
      for (var j = 0; j < n; j++) {
        var bit = 1 << j, v = W[0].m & bit, same = true, q;
        for (q = 1; q < W.length; q++) if ((W[q].m & bit) !== v) { same = false; break; }
        if (same) { must.push({ gid: U[j], side: v ? 'H' : 'A' }); mustMask |= bit; if (v) mustVal |= bit; continue; }
        var relevant = false;
        for (q = 0; q < N; q++) if (inW[q] !== inW[q ^ bit]) { relevant = true; break; }
        if (relevant) rel.push(U[j]);
      }
      var pk = players[i].picks;
      var relH = 0, relA = 0;
      rel.forEach(function (gid) { var j = U.indexOf(gid); if (pk[gid] === 'H') relH |= (1 << j); else if (pk[gid] === 'A') relA |= (1 << j); });
      var ALL = N - 1;
      var hits = function (m) { return popcount(m & relH) + popcount((~m & ALL) & relA); };
      var kmin = 0;
      if (rel.length) { kmin = 1e9; W.forEach(function (o) { kmin = Math.min(kmin, hits(o.m)); }); }
      var count = 0;
      for (var m2 = 0; m2 < N; m2++) if ((m2 & mustMask) === mustVal && hits(m2) >= kmin) count++;
      var exact = count === W.length;
      var best = W[0];
      for (var b = 1; b < W.length; b++) if (W[b].w > best.w) best = W[b];
      // Likeliest ending that also agrees with the player's own picks on the relevant games, when one exists.
      // The raw "best" can route through a loss the player survives (a favorite beating their pick while
      // their rivals share that pick), which reads wrong as a "way through".
      var agree = function (m) { return (m & relH) === relH && ((~m & ALL) & relA) === relA; };
      var bestPick = null;
      for (var c = 0; c < W.length; c++) if (agree(W[c].m) && (!bestPick || W[c].w > bestPick.w)) bestPick = W[c];
      var toPath = function (o) { return rel.map(function (gid) { return { gid: gid, side: res.side(o.m, U.indexOf(gid)), againstPick: !!pk[gid] && pk[gid] !== res.side(o.m, U.indexOf(gid)) }; }); };
      return {
        must: must, rel: rel, kmin: kmin, exact: exact, paths: W.length,
        best: toPath(best),
        bestPick: bestPick ? toPath(bestPick) : null,
        W: W
      };
    }

    // Win % for every player conditional on each side of each undecided game. Cached on res.
    function rootForAll(res) {
      if (res._rootAll) return res._rootAll;
      var U = res.U, n = U.length, N = res.N, P = players.length;
      var wH = new Float64Array(n), wA = new Float64Array(n);
      var pHs = [], pAs = [];
      for (var j = 0; j < n; j++) { pHs.push(new Float64Array(P)); pAs.push(new Float64Array(P)); }
      for (var m = 0; m < N; m++) {
        var o = res.outcomes[m];
        for (var jj = 0; jj < n; jj++) {
          var isH = (m >> jj) & 1;
          if (isH) wH[jj] += o.w; else wA[jj] += o.w;
          var tgt = isH ? pHs[jj] : pAs[jj];
          for (var s = 0; s < o.S.length; s++) { var k = o.S[s]; tgt[k] += o.w * (o.pw[k] || 0); }
        }
      }
      var all = [];
      for (var i = 0; i < P; i++) {
        all.push(U.map(function (gid, j2) {
          var cH = wH[j2] ? pHs[j2][i] / wH[j2] : 0, cA = wA[j2] ? pAs[j2][i] / wA[j2] : 0;
          return { gid: gid, ifHome: cH, ifAway: cA, swing: Math.abs(cH - cA), side: cH >= cA ? 'H' : 'A', cond: Math.max(cH, cA) };
        }));
      }
      res._rootAll = all;
      return all;
    }
    function rootFor(res, i) { return rootForAll(res)[i]; }

    // Most likely tie group for player i among endings that keep them alive.
    function likeliestTie(res, i, nd) {
      var agg = {};
      nd.W.forEach(function (o) { if (o.S.length > 1) { var k = o.S.join(','); agg[k] = (agg[k] || 0) + o.w; } });
      var keys = Object.keys(agg).sort(function (a, b) { return agg[b] - agg[a]; });
      if (!keys.length) return null;
      var S = keys[0].split(',').map(Number);
      return {
        S: S,
        with: S.filter(function (j) { return j !== i; }).map(function (j) { return players[j].name; }),
        range: tbRange(S.map(function (j) { return players[j].tb; }), S.indexOf(i))
      };
    }

    // Game whose result moves the pool's win odds the most. Names grouped by the side they need (5+ point swing).
    function biggestGame(res) {
      var all = rootForAll(res);
      var big = null;
      res.U.forEach(function (gid, j) {
        var tot = 0, cnt = 0, hN = [], aN = [];
        players.forEach(function (p, i) {
          var r = all[i][j];
          tot += r.swing;
          if (r.swing >= 0.10) cnt++;
          if (r.swing >= 0.05) (r.side === 'H' ? hN : aN).push({ name: p.name, swing: r.swing });
        });
        if (!big || tot > big.tot) big = { gid: gid, tot: tot, cnt: cnt, homeNames: hN, awayNames: aN };
      });
      if (big) {
        var bySwing = function (a, b) { return b.swing - a.swing; };
        big.homeNames.sort(bySwing); big.awayNames.sort(bySwing);
      }
      return big;
    }

    // Replay finals in the order they ended; report who was eliminated by each.
    function eliminationFeed(finalOrder) {
      var prev = analyze({ known: [], light: true }).status.map(function (s) { return s === 'Out'; });
      var known = [], out = [];
      finalOrder.forEach(function (gid) {
        known.push(gid);
        var now = analyze({ known: known.slice(), light: true }).status.map(function (s) { return s === 'Out'; });
        out.push({ gid: gid, eliminated: players.filter(function (p, i) { return now[i] && !prev[i]; }).map(function (p) { return p.name; }) });
        prev = now;
      });
      return out;
    }

    return {
      analyze: analyze, needs: needs, rootFor: rootFor, rootForAll: rootForAll, likeliestTie: likeliestTie,
      biggestGame: biggestGame, eliminationFeed: eliminationFeed, tbShares: tbShares, tbRange: tbRange, td: td
    };
  }

  return { makeEngine: makeEngine, totalDist: totalDist, tbSharesWith: tbSharesWith, tbRange: tbRange, popcount: popcount };
}));
