'use strict';
// Test 1: the fixture. Win % within 0.05 points; statuses, must-haves, plus-k
// sets, likeliest paths, tie partners, MNF ranges, elimination feed, what-if
// and biggest game match exactly.
var H = require('./helpers.js');
module.exports = function (fixturePath) {
  var L = H.loadFixture(fixturePath), games = L.games, players = L.players, fx = L.fx;
  var eng = H.E.makeEngine(games, players, { mu: fx.params.mu, sd: fx.params.sd });
  var res = eng.analyze({});
  var exp = fx.expected;
  H.check(res.N === exp.endings, 'endings ' + res.N + ' != ' + exp.endings);
  players.forEach(function (p, i) {
    var e = exp.players[p.name];
    var pre = p.name + ': ';
    H.check(res.base[i] === e.points, pre + 'points ' + res.base[i] + ' != ' + e.points);
    H.check(res.max[i] === e.max, pre + 'max ' + res.max[i] + ' != ' + e.max);
    H.check(res.status[i] === e.status, pre + 'status ' + res.status[i] + ' != ' + e.status);
    H.check(H.near(res.win[i] * 100, e.win_pct, 0.05), pre + 'win ' + (res.win[i] * 100).toFixed(3) + ' != ' + e.win_pct);
    if (e.status === 'Out') return;
    var nd = eng.needs(res, i);
    H.check(!!nd, pre + 'needs null');
    if (!nd) return;
    var must = nd.must.map(function (x) { return H.teamOf(games, x.gid, x.side); });
    H.check(H.same(must, e.must), pre + 'must ' + JSON.stringify(must) + ' != ' + JSON.stringify(e.must));
    H.check(nd.exact === e.exact, pre + 'exact ' + nd.exact + ' != ' + e.exact);
    H.check(nd.paths === e.endings_alive, pre + 'paths ' + nd.paths + ' != ' + e.endings_alive);
    if (e.plus) {
      var of = nd.rel.map(function (gid) { return H.teamOf(games, gid, p.picks[gid]); });
      H.check(nd.kmin === e.plus.k, pre + 'k ' + nd.kmin + ' != ' + e.plus.k);
      H.check(H.same(of, e.plus.of), pre + 'plus of ' + JSON.stringify(of) + ' != ' + JSON.stringify(e.plus.of));
    } else if (e.exact) {
      H.check(nd.kmin === 0 || nd.rel.length === 0, pre + 'unexpected plus-k ' + nd.kmin + ' of ' + nd.rel.length);
    }
    if (e.likeliest_path) {
      var path = nd.best.map(function (x) { return H.teamOf(games, x.gid, x.side); });
      H.check(H.same(path, e.likeliest_path), pre + 'path ' + JSON.stringify(path) + ' != ' + JSON.stringify(e.likeliest_path));
    }
    var tie = eng.likeliestTie(res, i, nd);
    if (e.likeliest_tie === null) H.check(tie === null, pre + 'expected no tie, got ' + JSON.stringify(tie && tie.with));
    else {
      H.check(!!tie && H.same(tie.with, e.likeliest_tie.with), pre + 'tie with ' + JSON.stringify(tie && tie.with) + ' != ' + JSON.stringify(e.likeliest_tie.with));
      H.check(!!tie && H.same(tie.range, e.likeliest_tie.mnf_range), pre + 'range ' + JSON.stringify(tie && tie.range) + ' != ' + JSON.stringify(e.likeliest_tie.mnf_range));
    }
  });
  // Root for (one player)
  Object.keys(exp).filter(function (k) { return k.indexOf('root_for_') === 0; }).forEach(function (k) {
    var name = k.slice('root_for_'.length);
    var i = players.map(function (p) { return p.name; }).indexOf(name);
    var rf = eng.rootFor(res, i).slice().sort(function (a, b) { return b.swing - a.swing; });
    exp[k].forEach(function (e, q) {
      var r = rf[q];
      H.check(r && H.teamOf(games, r.gid, r.side) === e.team, name + ' root ' + q + ' team ' + (r && H.teamOf(games, r.gid, r.side)) + ' != ' + e.team);
      H.check(r && H.near(r.cond * 100, e.win_pct_if, 0.05), name + ' root ' + q + ' if ' + (r && (r.cond * 100).toFixed(2)) + ' != ' + e.win_pct_if);
      H.check(r && H.near(r.swing * 100, e.swing_pts, 0.05), name + ' root ' + q + ' swing ' + (r && (r.swing * 100).toFixed(2)) + ' != ' + e.swing_pts);
    });
  });
  // Biggest game
  var big = eng.biggestGame(res);
  var bg = games.filter(function (g) { return g.id === big.gid; })[0];
  H.check(H.label(bg) === exp.biggest_game.game, 'biggest game ' + H.label(bg) + ' != ' + exp.biggest_game.game);
  H.check(big.cnt === exp.biggest_game.players_moved_10plus, 'biggest moved ' + big.cnt + ' != ' + exp.biggest_game.players_moved_10plus);
  H.check(H.near(big.tot, exp.biggest_game.total_swing, 0.001), 'biggest total swing ' + big.tot.toFixed(4) + ' != ' + exp.biggest_game.total_swing);
  // Elimination feed
  var order = games.filter(function (g) { return g.status === 'final'; }).sort(function (a, b) { return a.final_order - b.final_order; }).map(function (g) { return g.id; });
  var feed = eng.eliminationFeed(order).map(function (f) { return { final: H.label(games.filter(function (g) { return g.id === f.gid; })[0]), eliminated: f.eliminated }; });
  H.check(H.same(feed, exp.elimination_feed), 'feed ' + JSON.stringify(feed) + ' != ' + JSON.stringify(exp.elimination_feed));
  // What-if DAL wins
  var dal = games.filter(function (g) { return g.away === 'DAL' || g.home === 'DAL'; })[0];
  var wi = eng.analyze({ forced: (function () { var f = {}; f[dal.id] = dal.away === 'DAL' ? 'A' : 'H'; return f; })() });
  var ti = players.map(function (p) { return p.name; }).indexOf('TallRobLC');
  H.check(wi.N === exp.what_if_DAL_wins.endings, 'what-if endings ' + wi.N);
  H.check(H.near(wi.win[ti] * 100, exp.what_if_DAL_wins.TallRobLC_win_pct, 0.05), 'what-if win ' + (wi.win[ti] * 100).toFixed(2) + ' != ' + exp.what_if_DAL_wins.TallRobLC_win_pct);
  H.check(wi.status[ti] === exp.what_if_DAL_wins.TallRobLC_status, 'what-if status ' + wi.status[ti]);
  return H.report('fixture ' + H.path.basename(fixturePath));
};
