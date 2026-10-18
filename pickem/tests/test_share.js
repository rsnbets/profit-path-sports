'use strict';
// Share link: v2 packed format round-trips every pick, tiebreak (including blank) and odd names; v1 JSON links still decode.
var H = require('./helpers.js');
module.exports = function () {
  global.location = { hash: '' }; global.history = { replaceState: function () {} };
  global.btoa = function (s) { return Buffer.from(s, 'binary').toString('base64'); };
  global.atob = function (s) { return Buffer.from(s, 'base64').toString('binary'); };
  global.self = global; global.PickemStore = { get: function () { return null; }, set: function () { return true; } };
  global.PickemESPN = { clockText: function () { return ''; } };
  require('../js/parser.js'); require('../js/ui.js');
  var U = global.PickemUI;
  var games = []; for (var g = 0; g < 14; g++) games.push({ id: '2026_06_G' + g, away: 'A' + g, home: 'H' + g });
  var players = [
    { name: 'TallRobLC', tb: 50, picks: {} }, { name: 'Player 02', tb: null, picks: {} }, { name: 'odd*name!x~y', tb: 47.5, picks: {} }
  ];
  var pat = ['HAHAHAHAHAHAHA', 'HHHHHHHHHHHHH-', '-A-A-A-A-A-A-A'];
  players.forEach(function (p, i) { games.forEach(function (gm, j) { p.picks[gm.id] = pat[i][j] === '-' ? '' : pat[i][j]; }); });
  var enc = U.encodeShare(players, games, '2026-w06');
  H.check(enc.indexOf('2!2026-w06!') === 0, 'v2 prefix: ' + enc.slice(0, 20));
  var dec = U.decodeShare('#p=' + enc, games, '2026-w06');
  H.check(dec && dec.players && H.same(dec.players, players), 'v2 round trip: ' + JSON.stringify(dec && dec.players && dec.players[2]));
  H.check(enc.length < 120, 'v2 length for 3 players ' + enc.length);
  var wrong = U.decodeShare('#p=' + enc, games, '2026-w07');
  H.check(wrong && /for 2026-w06, not 2026-w07/.test(wrong.error), 'wrong week refused: ' + JSON.stringify(wrong));
  var short = U.decodeShare('#p=' + enc, games.concat([{ id: 'x', away: 'X', home: 'Y' }]), '2026-w06');
  H.check(short && short.error, 'game count mismatch refused');
  // v1 still decodes
  var v1 = Buffer.from(JSON.stringify({ k: '2026-w06', p: [['TallRobLC', 50, pat[0]]] })).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  var d1 = U.decodeShare('#p=' + v1, games, '2026-w06');
  H.check(d1 && d1.players && d1.players[0].picks['2026_06_G1'] === 'A' && d1.players[0].tb === 50, 'v1 decode: ' + JSON.stringify(d1));
  // 13 real-sized players stay short
  var many = []; for (var k = 0; k < 13; k++) many.push({ name: 'Handle' + (1000 + k), tb: 40 + k, picks: players[0].picks });
  var big = U.encodeShare(many, games, '2026-w06');
  console.log('     (13 players: ' + big.length + ' chars after #p=)');
  H.check(big.length < 320, '13-player link ' + big.length + ' chars');
  return H.report('share link encoding');
};
