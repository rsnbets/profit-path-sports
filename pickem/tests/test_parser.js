'use strict';
// Test 6: the template round-trips, the PoolHost name map works both ways, bad codes show up in the report.
var H = require('./helpers.js');
var P = require('../js/parser.js');
module.exports = function () {
  var tpl = H.fs.readFileSync(H.path.join(__dirname, 'picks-template.csv'), 'utf8');
  var head = P.readCSV(tpl)[0].slice(2);
  var games = head.map(function (h, i) { var m = h.split('@'); return { id: '2026_06_' + m[0] + '_' + m[1], away: m[0], home: m[1] }; });
  var r = P.parsePicksCSV(tpl, games);
  H.check(r.ok, 'template parse errors: ' + r.report.errors.join(' | '));
  H.check(r.players.length === 2 && r.players[0].name === 'TallRobLC', 'template players ' + r.players.map(function (p) { return p.name; }));
  var out = P.toPicksCSV(r.players, games);
  H.check(out.trim() === tpl.trim(), 'round trip differs:\n' + out + '\nvs\n' + tpl);
  var again = P.parsePicksCSV(out, games);
  H.check(H.same(again.players, r.players), 'second parse differs');
  // Name map both ways
  H.check(P.toPoolHostName('NYJ') === 'New York (A)' && P.toPoolHostName('NYG') === 'New York (N)', 'NY names');
  H.check(P.toPoolHostName('LAC') === 'Los Angeles (A)' && P.toPoolHostName('LA') === 'Los Angeles (N)', 'LA names');
  H.check(P.fromPoolHostName('New York (A)') === 'NYJ' && P.fromPoolHostName('New York (N)') === 'NYG', 'NY codes');
  H.check(P.fromPoolHostName('Los Angeles (A)') === 'LAC' && P.fromPoolHostName('Los Angeles (N)') === 'LA', 'LA codes');
  H.check(P.normalizeTeam('LAR') === 'LA' && P.normalizeTeam('WSH') === 'WAS' && P.normalizeTeam('denver') === 'DEN', 'aliases');
  // PoolHost names inside the template cells also parse
  var withNames = 'player,tiebreak,NYJ@NE,ARI@LA\nA,40,New York (A),Los Angeles (N)\n';
  var g2 = [{ id: 'g1', away: 'NYJ', home: 'NE' }, { id: 'g2', away: 'ARI', home: 'LA' }];
  var rn = P.parsePicksCSV(withNames, g2);
  H.check(rn.ok && rn.players[0].picks.g1 === 'A' && rn.players[0].picks.g2 === 'H', 'PoolHost names in cells: ' + JSON.stringify(rn));
  // Bad code never fails silently
  var bad = 'player,tiebreak,NYJ@NE,ARI@LA\nA,40,NYJ,XXX\nB,41,DEN,LA\nA,42,NE,ARI\nC,,NE,\n';
  var rb = P.parsePicksCSV(bad, g2);
  H.check(!rb.ok, 'bad file should not be ok');
  var errs = rb.report.errors.join(' | ');
  H.check(/XXX/.test(errs) && /Unknown team/.test(errs), 'unknown code reported: ' + errs);
  H.check(/DEN/.test(errs) && /not in the game/.test(errs), 'wrong-game pick reported: ' + errs);
  H.check(/duplicate player "A"/.test(errs), 'duplicate reported: ' + errs);
  var warns = rb.report.warnings.join(' | ');
  H.check(/no tiebreak/.test(warns) && /no pick for ARI@LA/.test(warns), 'blank tiebreak and blank pick reported: ' + warns);
  // Unknown header routes to the PoolHost stub, never silently
  var ru = P.parseAny('Rank,Name,Week 6,Total\n1,Someone,9,55\n', g2);
  H.check(!ru.ok && ru.report.format === 'poolhost' && ru.report.errors.length === 1, 'poolhost stub: ' + JSON.stringify(ru.report));
  // Season CSV
  var rs = P.parseSeasonCSV('player,W1,W2,W3\nA,9,10,\nB,8,x,7\n');
  H.check(!rs.ok && rs.season.A[2] === null && /not a number/.test(rs.report.errors.join()), 'season csv: ' + JSON.stringify(rs));
  H.check(P.detectFormat('player,W1,W2\nA,1,2') === 'season' && P.detectFormat(tpl) === 'template', 'detectFormat');
  return H.report('parser: round trip, name map, validation report');
};
