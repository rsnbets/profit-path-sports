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
  H.check(enc.indexOf('3~2026-w06~14~') === 0 && /^[A-Za-z0-9._~%-]+$/.test(enc), 'v3 prefix and unreserved chars only: ' + enc.slice(0, 40));
  var dec = U.decodeShare('#p=' + enc, games, '2026-w06');
  H.check(dec && dec.players && H.same(dec.players, players), 'v2 round trip: ' + JSON.stringify(dec && dec.players && dec.players[2]));
  H.check(enc.length < 120, 'v2 length for 3 players ' + enc.length);
  var wrong = U.decodeShare('#p=' + enc, games, '2026-w07');
  H.check(wrong && /for 2026-w06, not 2026-w07/.test(wrong.error), 'wrong week refused: ' + JSON.stringify(wrong));
  var short = U.decodeShare('#p=' + enc, games.concat([{ id: 'x', away: 'X', home: 'Y' }]), '2026-w06');
  H.check(short && short.error, 'game count mismatch refused');
  // v2 (! and *) still decodes
  var v2 = '2!2026-w06!14!TallRobLC*50*' + U.packPicks(players[0], games);
  var d2 = U.decodeShare('#p=' + v2, games, '2026-w06');
  H.check(d2 && d2.players && d2.players[0].tb === 50 && H.same(d2.players[0].picks, players[0].picks), 'v2 decode: ' + JSON.stringify(d2));
  var cut = U.decodeShare('#p=' + enc.slice(0, enc.length - 3), games, '2026-w06');
  H.check(cut && /cut off/.test(cut.error), 'truncated link reported: ' + JSON.stringify(cut));
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
