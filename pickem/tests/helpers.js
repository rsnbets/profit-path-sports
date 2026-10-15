'use strict';
// Shared helpers for the pick'em test suite (Node, no dependencies).
var fs = require('fs'), path = require('path');
var E = require('../js/engine.js');

function loadFixture(p) {
  var fx = JSON.parse(fs.readFileSync(p, 'utf8'));
  var games = fx.games.map(function (g) { return Object.assign({}, g); });
  var players = fx.players.map(function (p) {
    var picks = {};
    for (var j = 0; j < p.picks.length; j++) picks[games[j].id] = p.picks[j];
    return { name: p.name, tb: p.tb, picks: picks };
  });
  return { fx: fx, games: games, players: players, params: fx.params };
}
function label(g) { return g.away + '@' + g.home; }
function teamOf(games, gid, side) { var g = games.filter(function (x) { return x.id === gid; })[0]; return side === 'H' ? g.home : g.away; }

var failures = [];
function check(ok, msg) { if (!ok) failures.push(msg); return ok; }
function near(a, b, tol) { return Math.abs(a - b) <= tol; }
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function report(name) {
  if (failures.length) { console.log('FAIL ' + name + ' (' + failures.length + ')'); failures.forEach(function (f) { console.log('   - ' + f); }); process.exitCode = 1; }
  else console.log('ok   ' + name);
  var n = failures.length; failures.length = 0; return n === 0;
}
module.exports = { E: E, loadFixture: loadFixture, label: label, teamOf: teamOf, check: check, near: near, same: same, report: report, fs: fs, path: path };
