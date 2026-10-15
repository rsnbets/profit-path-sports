/* PPS Pick'em: picks import.
 *
 * Formats
 *   Template CSV: header "player,tiebreak,AWAY@HOME,..." (nflverse codes, LA = Rams, WAS).
 *                 Each cell is the picked team's code. Blank = no pick.
 *   PoolHost export: adapter stub until the real file is in hand (Step 0.3).
 *   season.csv: "player,W1,W2,..." weekly points for the season view.
 *
 * Every parse returns a validation report. Nothing fails silently.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.PickemParser = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // nflverse code -> PoolHost display name. The four shared-city teams carry (A)/(N).
  var POOLHOST = {
    ARI: 'Arizona', ATL: 'Atlanta', BAL: 'Baltimore', BUF: 'Buffalo', CAR: 'Carolina', CHI: 'Chicago', CIN: 'Cincinnati',
    CLE: 'Cleveland', DAL: 'Dallas', DEN: 'Denver', DET: 'Detroit', GB: 'Green Bay', HOU: 'Houston', IND: 'Indianapolis',
    JAX: 'Jacksonville', KC: 'Kansas City', LV: 'Las Vegas', LAC: 'Los Angeles (A)', LA: 'Los Angeles (N)', MIA: 'Miami',
    MIN: 'Minnesota', NE: 'New England', NO: 'New Orleans', NYG: 'New York (N)', NYJ: 'New York (A)', PHI: 'Philadelphia',
    PIT: 'Pittsburgh', SEA: 'Seattle', SF: 'San Francisco', TB: 'Tampa Bay', TEN: 'Tennessee', WAS: 'Washington'
  };
  var CODES = Object.keys(POOLHOST);
  // Aliases seen in the wild -> nflverse code.
  var ALIASES = { LAR: 'LA', WSH: 'WAS', JAC: 'JAX', OAK: 'LV', SD: 'LAC', STL: 'LA', ARZ: 'ARI', GNB: 'GB', KAN: 'KC', NWE: 'NE', NOR: 'NO', SFO: 'SF', TAM: 'TB', LVR: 'LV' };
  var NAME_TO_CODE = {};
  CODES.forEach(function (c) { NAME_TO_CODE[POOLHOST[c].toUpperCase()] = c; });

  function toPoolHostName(code) { return POOLHOST[code] || null; }
  function fromPoolHostName(name) { return NAME_TO_CODE[String(name || '').trim().toUpperCase()] || null; }
  // Normalize any cell value to a code or null (unknown).
  function normalizeTeam(raw) {
    var s = String(raw == null ? '' : raw).trim();
    if (!s) return '';
    var u = s.toUpperCase();
    if (POOLHOST[u]) return u;
    if (ALIASES[u]) return ALIASES[u];
    if (NAME_TO_CODE[u]) return NAME_TO_CODE[u];
    return null;
  }

  // Minimal RFC-4180 CSV reader. Returns array of rows (array of strings).
  function readCSV(text) {
    var rows = [], row = [], cell = '', q = false, i = 0, c;
    text = String(text || '').replace(/^﻿/, '');
    for (; i < text.length; i++) {
      c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (cell.length || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (x) { return String(x).trim() !== ''; }); });
  }
  function csvCell(s) { s = String(s == null ? '' : s); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }

  function gameLabel(g) { return g.away + '@' + g.home; }

  function detectFormat(text) {
    var rows = readCSV(text);
    if (!rows.length) return 'empty';
    var h = rows[0].map(function (x) { return x.trim().toLowerCase(); });
    if (h[0] === 'player' && h[1] === 'tiebreak') return 'template';
    if (h[0] === 'player' && h.slice(1).every(function (x) { return /^w\d+$/.test(x); })) return 'season';
    return 'unknown';
  }

  // Parse the template CSV against this week's games.
  // games: [{ id, away, home }]. Returns { ok, players, report }.
  function parsePicksCSV(text, games) {
    var report = { errors: [], warnings: [], rows: 0, format: 'template' };
    var rows = readCSV(text);
    var players = [];
    if (!rows.length) { report.errors.push('The file is empty.'); return { ok: false, players: players, report: report }; }
    var header = rows[0].map(function (x) { return x.trim(); });
    if (header[0].toLowerCase() !== 'player' || (header[1] || '').toLowerCase() !== 'tiebreak') {
      report.errors.push('Header must start with "player,tiebreak,". Got "' + header.slice(0, 2).join(',') + '".');
      report.format = 'unknown';
      return { ok: false, players: players, report: report };
    }
    var byLabel = {};
    games.forEach(function (g) { byLabel[gameLabel(g)] = g; });
    var colGame = [];   // column index -> game or null
    header.slice(2).forEach(function (h, k) {
      var col = k + 2;
      var m = h.toUpperCase().match(/^([A-Z]{2,3})\s*@\s*([A-Z]{2,3})$/);
      if (!m) { report.errors.push('Column ' + (col + 1) + ' "' + h + '" is not AWAY@HOME.'); colGame[col] = null; return; }
      var a = normalizeTeam(m[1]), hm = normalizeTeam(m[2]);
      var g = (a && hm) ? byLabel[a + '@' + hm] : null;
      if (!g) { report.errors.push('Column "' + h + '" is not one of this week\'s games.'); colGame[col] = null; return; }
      if (colGame.indexOf(g) >= 0) { report.errors.push('Column "' + h + '" appears twice.'); colGame[col] = null; return; }
      colGame[col] = g;
    });
    games.forEach(function (g) { if (colGame.indexOf(g) < 0) report.warnings.push('No column for ' + gameLabel(g) + '. Everyone gets a blank pick there.'); });

    var seen = {};
    rows.slice(1).forEach(function (r, ri) {
      var line = ri + 2;
      var name = String(r[0] || '').trim();
      if (!name) { report.errors.push('Line ' + line + ': blank player name.'); return; }
      if (seen[name.toLowerCase()]) { report.errors.push('Line ' + line + ': duplicate player "' + name + '".'); return; }
      seen[name.toLowerCase()] = true;
      var tbRaw = String(r[1] == null ? '' : r[1]).trim();
      var tb = tbRaw === '' ? null : Number(tbRaw);
      if (tbRaw === '') report.warnings.push('Line ' + line + ': ' + name + ' has no tiebreak guess. They lose every tiebreak.');
      else if (!isFinite(tb) || tb < 0 || tb > 200) { report.errors.push('Line ' + line + ': ' + name + ' tiebreak "' + tbRaw + '" is not a number of points.'); tb = null; }
      var picks = {};
      games.forEach(function (g) { picks[g.id] = ''; });
      for (var col = 2; col < Math.max(header.length, r.length); col++) {
        var g = colGame[col];
        var raw = r[col] == null ? '' : r[col];
        if (!g) { if (String(raw).trim() && col >= header.length) report.warnings.push('Line ' + line + ': extra value "' + raw + '" past the last column, ignored.'); continue; }
        var code = normalizeTeam(raw);
        if (code === '') { report.warnings.push('Line ' + line + ': ' + name + ' has no pick for ' + gameLabel(g) + '. Counts as wrong.'); continue; }
        if (code === null) { report.errors.push('Line ' + line + ': ' + name + ' picked "' + raw + '" for ' + gameLabel(g) + '. Unknown team.'); continue; }
        if (code === g.home) picks[g.id] = 'H';
        else if (code === g.away) picks[g.id] = 'A';
        else report.errors.push('Line ' + line + ': ' + name + ' picked ' + code + ' for ' + gameLabel(g) + '. That team is not in the game.');
      }
      players.push({ name: name, tb: tb, picks: picks });
      report.rows++;
    });
    if (!players.length) report.errors.push('No player rows found.');
    return { ok: report.errors.length === 0, players: players, report: report };
  }

  // Write players back out in the template format.
  function toPicksCSV(players, games) {
    var head = ['player', 'tiebreak'].concat(games.map(gameLabel));
    var lines = [head.map(csvCell).join(',')];
    players.forEach(function (p) {
      var cells = [p.name, p.tb == null ? '' : p.tb];
      games.forEach(function (g) { var s = p.picks[g.id]; cells.push(s === 'H' ? g.home : s === 'A' ? g.away : ''); });
      lines.push(cells.map(csvCell).join(','));
    });
    return lines.join('\n') + '\n';
  }

  // PoolHost export adapter. Stub until the real export is in hand (Step 0.3):
  // it recognizes that the file is not the template and says so.
  function parsePoolHostExport(text, games) {
    var report = { errors: [], warnings: [], rows: 0, format: 'poolhost' };
    var rows = readCSV(text);
    report.errors.push('PoolHost export format is not wired yet. Save the standings download, then fill the CSV template (player,tiebreak,AWAY@HOME,...).');
    if (rows.length) report.warnings.push('Saw ' + rows.length + ' rows with header: ' + rows[0].slice(0, 6).join(', ') + (rows[0].length > 6 ? ', ...' : ''));
    return { ok: false, players: [], report: report };
  }

  // season.csv: player,W1,W2,... weekly points. Returns { ok, season: { name: [pts...] }, weeks: [1,2,...], report }.
  function parseSeasonCSV(text) {
    var report = { errors: [], warnings: [], rows: 0, format: 'season' };
    var rows = readCSV(text);
    var season = {};
    if (!rows.length) { report.errors.push('The file is empty.'); return { ok: false, season: season, weeks: [], report: report }; }
    var header = rows[0].map(function (x) { return x.trim(); });
    if (header[0].toLowerCase() !== 'player') { report.errors.push('Header must start with "player".'); return { ok: false, season: season, weeks: [], report: report }; }
    var weeks = [];
    header.slice(1).forEach(function (h) {
      var m = h.toUpperCase().match(/^W(\d+)$/);
      if (!m) report.errors.push('Column "' + h + '" is not W<n>.'); else weeks.push(Number(m[1]));
    });
    rows.slice(1).forEach(function (r, ri) {
      var name = String(r[0] || '').trim();
      if (!name) { report.errors.push('Line ' + (ri + 2) + ': blank player name.'); return; }
      if (season[name]) { report.errors.push('Line ' + (ri + 2) + ': duplicate player "' + name + '".'); return; }
      season[name] = weeks.map(function (w, k) {
        var v = String(r[k + 1] == null ? '' : r[k + 1]).trim();
        if (v === '') return null;
        var n = Number(v);
        if (!isFinite(n)) { report.errors.push('Line ' + (ri + 2) + ': ' + name + ' W' + w + ' "' + v + '" is not a number.'); return null; }
        return n;
      });
      report.rows++;
    });
    return { ok: report.errors.length === 0, season: season, weeks: weeks, report: report };
  }

  // Route by format.
  function parseAny(text, games) {
    var f = detectFormat(text);
    if (f === 'template') return parsePicksCSV(text, games);
    if (f === 'season') { var s = parseSeasonCSV(text); s.format = 'season'; return s; }
    if (f === 'empty') return { ok: false, players: [], report: { errors: ['The file is empty.'], warnings: [], rows: 0, format: 'empty' } };
    return parsePoolHostExport(text, games);
  }

  return {
    POOLHOST: POOLHOST, CODES: CODES, toPoolHostName: toPoolHostName, fromPoolHostName: fromPoolHostName, normalizeTeam: normalizeTeam,
    readCSV: readCSV, detectFormat: detectFormat, parsePicksCSV: parsePicksCSV, toPicksCSV: toPicksCSV,
    parsePoolHostExport: parsePoolHostExport, parseSeasonCSV: parseSeasonCSV, parseAny: parseAny, gameLabel: gameLabel
  };
}));
