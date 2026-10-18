#!/usr/bin/env node
'use strict';
/* Publish a week's picks to the site (option A, shadow season 2026).
 *
 *   node pickem/publish_picks.js ~/Downloads/allpicks.xls [--week 6] [--season 2026]
 *
 * Reads the PoolHost "All Picks" download (or the CSV template), validates it against the week's
 * game data, and writes pickem/data/picks-<season>-w<week>.json. Commit and push that file and the
 * plain board URL works on every device. "No Picks" accounts are left out (they sat the week out).
 * Decided Oct 18 2026: the pool owner accepted that handles and picks are visible in the public repo
 * for this season. Phase 2 moves picks behind logins.
 */
var fs = require('fs'), path = require('path');
var P = require('./js/parser.js');
var args = process.argv.slice(2), file = null, season = null, week = null;
for (var i = 0; i < args.length; i++) {
  if (args[i] === '--week') week = Number(args[++i]);
  else if (args[i] === '--season') season = Number(args[++i]);
  else file = args[i];
}
if (!file) { console.error('usage: node pickem/publish_picks.js <allpicks.xls|picks.csv> [--week N] [--season YYYY]'); process.exit(2); }
var dataDir = path.join(__dirname, 'data');
if (season === null || week === null) {
  var latest = JSON.parse(fs.readFileSync(path.join(dataDir, 'latest.json'), 'utf8'));
  if (season === null) season = latest.season;
  if (week === null) week = latest.week;
}
var key = season + '-w' + (week < 10 ? '0' + week : week);
var data = JSON.parse(fs.readFileSync(path.join(dataDir, key + '.json'), 'utf8'));
var text = fs.readFileSync(file, 'utf8');
var r = P.parseAny(text, data.games);
r.report.warnings.forEach(function (w) { console.error('note: ' + w); });
r.report.errors.forEach(function (e) { console.error('ERROR: ' + e); });
if (!r.ok) { console.error('not published: fix the errors above'); process.exit(1); }
var out = { key: key, season: season, week: week, source: r.report.format, published_at: new Date().toISOString(), players: r.players, sat_out: (r.season && r.season.satOut) || [] };
var dest = path.join(dataDir, 'picks-' + key + '.json');
fs.writeFileSync(dest, JSON.stringify(out, null, 1) + '\n');
console.error('wrote ' + path.relative(process.cwd(), dest) + ': ' + r.players.length + ' players, ' + out.sat_out.length + ' sat out');
