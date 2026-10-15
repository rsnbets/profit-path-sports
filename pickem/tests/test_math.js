'use strict';
// Tests 2, 3, 4, 7: Monte Carlo agreement, win % sums to 100, tiebreak shares, performance.
var H = require('./helpers.js');
var E = H.E;

function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }

function testTiebreak() {
  var td = E.totalDist(46.5, 13.5);
  var s = E.tbSharesWith(td, [44, 50]);
  H.check(H.near(s[0], 0.5146, 0.00005) && H.near(s[1], 0.4854, 0.00005), 'shares [44,50] = ' + s.map(function (x) { return x.toFixed(4); }));
  H.check(H.same(E.tbRange([44, 50], 1), [47, 120]), 'range for 50 = ' + JSON.stringify(E.tbRange([44, 50], 1)));
  var s3 = E.tbSharesWith(td, [47, 47, 52]);
  H.check(H.near(s3[0], 0.2939, 0.00005) && H.near(s3[1], 0.2939, 0.00005) && H.near(s3[2], 0.4122, 0.00005), 'shares [47,47,52] = ' + s3.map(function (x) { return x.toFixed(4); }));
  return H.report('tiebreak shares and ranges');
}

function testSums(fixturePath) {
  var L = H.loadFixture(fixturePath);
  var eng = E.makeEngine(L.games, L.players, L.params);
  var states = [{}, { forced: { 8: 'A' } }, { forced: { 8: 'H', 9: 'A' } }, { forced: { 5: 'A', 6: 'A', 7: 'H', 8: 'H', 9: 'H' } }, { known: [] }, { known: [0, 3] }];
  states.forEach(function (st) {
    var r = eng.analyze(st);
    var s = sum(r.win) * 100;
    H.check(H.near(s, 100, 0.01), 'sum ' + s.toFixed(4) + ' for ' + JSON.stringify(st));
  });
  return H.report('win % sums to 100 in every state');
}

// Deterministic PRNG so the test is repeatable.
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function testMonteCarlo(fixturePath, draws) {
  var L = H.loadFixture(fixturePath), games = L.games, players = L.players;
  var eng = E.makeEngine(games, players, L.params);
  var res = eng.analyze({});
  var rnd = mulberry32(20261018);
  var U = res.U.map(function (gid) { return games.filter(function (g) { return g.id === gid; })[0]; });
  var base = res.base, P = players.length;
  var wins = new Float64Array(P);
  var td = eng.td;
  for (var d = 0; d < draws; d++) {
    var pts = base.slice();
    var oc = {};
    U.forEach(function (g) { var h = rnd() < g.p_home; oc[g.id] = h ? 'H' : 'A'; });
    for (var i = 0; i < P; i++) for (var j = 0; j < U.length; j++) if (players[i].picks[U[j].id] === oc[U[j].id]) pts[i]++;
    var top = Math.max.apply(null, pts);
    var S = []; for (i = 0; i < P; i++) if (pts[i] === top) S.push(i);
    if (S.length === 1) { wins[S[0]] += 1; continue; }
    // Draw an MNF total from the same discretized normal and award the tiebreak.
    var u = rnd(), acc = 0, t = 0;
    for (t = 0; t <= 120; t++) { acc += td[t]; if (u <= acc) break; }
    if (t > 120) t = 120;
    var best = 1e9; S.forEach(function (k) { best = Math.min(best, Math.abs(t - players[k].tb)); });
    var tied = S.filter(function (k) { return Math.abs(t - players[k].tb) === best; });
    tied.forEach(function (k) { wins[k] += 1 / tied.length; });
  }
  var maxErr = 0;
  players.forEach(function (p, i) {
    var mc = wins[i] / draws * 100, ex = res.win[i] * 100;
    maxErr = Math.max(maxErr, Math.abs(mc - ex));
    H.check(H.near(mc, ex, 0.5), p.name + ' MC ' + mc.toFixed(2) + ' vs exact ' + ex.toFixed(2));
  });
  console.log('     (max |MC - exact| = ' + maxErr.toFixed(3) + ' points over ' + draws + ' draws)');
  return H.report('enumeration vs Monte Carlo');
}

function testPerformance() {
  // 14 undecided games, 50 players, full board recompute: analyze + needs for all + root-for all + biggest game.
  var rnd = mulberry32(7);
  var games = [], players = [];
  for (var g = 0; g < 14; g++) games.push({ id: g, away: 'A' + g, home: 'H' + g, status: 'pre', away_score: null, home_score: null, p_home: 0.3 + 0.4 * rnd() });
  for (var p = 0; p < 50; p++) { var picks = {}; for (g = 0; g < 14; g++) picks[g] = rnd() < 0.6 ? 'H' : 'A'; players.push({ name: 'P' + p, tb: 35 + Math.floor(rnd() * 25), picks: picks }); }
  var eng = E.makeEngine(games, players, { mu: 46.5, sd: 13.1 });
  var t0 = Date.now();
  var res = eng.analyze({});
  var t1 = Date.now();
  var nds = players.map(function (_, i) { return eng.needs(res, i); });
  var t2 = Date.now();
  eng.rootForAll(res); eng.biggestGame(res);
  players.forEach(function (_, i) { if (nds[i]) eng.likeliestTie(res, i, nds[i]); });
  var t3 = Date.now();
  var total = t3 - t0;
  console.log('     (analyze ' + (t1 - t0) + ' ms, needs x50 ' + (t2 - t1) + ' ms, root-for + biggest + ties ' + (t3 - t2) + ' ms, total ' + total + ' ms on this machine; N = ' + res.N + ')');
  H.check(H.near(sum(res.win) * 100, 100, 0.01), 'perf board sums to ' + (sum(res.win) * 100).toFixed(4));
  H.check(total < 500, 'full recompute took ' + total + ' ms (budget 500 ms on a mid-range phone; this is a laptop number, the page also has a worker path)');
  return H.report('performance: 14 games x 50 players');
}

module.exports = { testTiebreak: testTiebreak, testSums: testSums, testMonteCarlo: testMonteCarlo, testPerformance: testPerformance };
