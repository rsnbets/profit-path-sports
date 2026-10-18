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
  H.check(!ru.ok && ru.report.format === 'poolhost' && ru.report.errors.length >= 1, 'unknown format fails loudly: ' + JSON.stringify(ru.report));
  // PoolHost export (synthetic table in the real layout: home listed first, PoolHost codes, No Picks row, Week/Total/tiebreak columns)
  var ph = '<style>.x{}</style><div><table class="table all-picks-table"><thead><tr><th>Rank</th><th>Status</th><th>Score:<br />Home:<br />Away:<br />Score:<br />Status:<br /><div>Player Name</div></th>' +
    '<th>17<br/>DEN<br/><br/>SEA<br/>14<br/>Final<br>OT</th><th>LAR<br/>AZ</th><th><span>JAC</span><br/>HOU</th><th>Week</th><th>Total</th><th>SF/WAS<br/>Total<br/>(TBD)</th></tr></thead><tbody>' +
    '<tr><td>1.</td><td>Picked</td><td>TallRobLC</td><td class="game-won">DEN</td><td>AZ</td><td>HOU</td><td>1</td><td>51</td><td>47</td></tr>' +
    '<tr><td>2.</td><td>Picked</td><td>Player02</td><td>SEA</td><td>LAR</td><td></td><td>0</td><td>40</td><td></td></tr>' +
    '<tr><td>3.</td><td>No Picks</td><td>Player03</td><td></td><td></td><td></td><td>0</td><td>19</td><td></td></tr></tbody></table></div>';
  var g3 = [{ id: 'd', away: 'SEA', home: 'DEN' }, { id: 'l', away: 'ARI', home: 'LA' }, { id: 'j', away: 'HOU', home: 'JAX' }];
  H.check(P.detectFormat(ph) === 'poolhost', 'detect poolhost');
  var rp = P.parseAny(ph, g3);
  H.check(rp.ok, 'poolhost parse errors: ' + rp.report.errors.join(' | '));
  H.check(rp.players.length === 2 && rp.players[0].name === 'TallRobLC' && rp.players[0].tb === 47, 'poolhost players (No Picks row excluded): ' + JSON.stringify(rp.players.map(function (p) { return [p.name, p.tb]; })));
  H.check(rp.players[0].picks.d === 'H' && rp.players[0].picks.l === 'A' && rp.players[0].picks.j === 'A', 'poolhost picks (AZ->ARI away, HOU away): ' + JSON.stringify(rp.players[0].picks));
  H.check(rp.players[1].picks.d === 'A' && rp.players[1].picks.l === 'H' && rp.players[1].picks.j === '' && rp.players[1].tb === null, 'poolhost blanks: ' + JSON.stringify(rp.players[1]));
  H.check(H.same(rp.season.satOut, ['Player03']) && /did not enter this week.*Player03/.test(rp.report.warnings.join()), 'no-picks row kept as sat-out: ' + rp.report.warnings.join(' | '));
  H.check(rp.season.prior.TallRobLC === 50 && rp.season.prior.Player03 === 19, 'prior totals: ' + JSON.stringify(rp.season.prior));
  var rpBad = P.parseAny(ph.replace('<td>SEA</td>', '<td>KC</td>'), g3);
  H.check(!rpBad.ok && /KC for SEA@DEN/.test(rpBad.report.errors.join()), 'poolhost wrong-game pick reported: ' + rpBad.report.errors.join(' | '));
  // Season CSV
  H.check(P.detectFormat(tpl) === 'template', 'detectFormat');
  return H.report('parser: round trip, name map, validation report');
};
