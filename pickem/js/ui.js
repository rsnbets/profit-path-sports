/* PPS Pick'em: shared page plumbing. Data loading, import panel, formatting, team swatches. */
(function (root) {
  'use strict';
  var S = root.PickemStore, P = root.PickemParser;

  var COLORS = {
    ARI: '#97233F', ATL: '#A71930', BAL: '#241773', BUF: '#00338D', CAR: '#0085CA', CHI: '#0B162A', CIN: '#FB4F14', CLE: '#311D00',
    DAL: '#869397', DEN: '#FB4F14', DET: '#0076B6', GB: '#203731', HOU: '#03202F', IND: '#002C5F', JAX: '#006778', KC: '#E31837',
    LA: '#003594', LAC: '#0080C6', LV: '#A5ACAF', MIA: '#008E97', MIN: '#4F2683', NE: '#002244', NO: '#D3BC8D', NYG: '#0B2265',
    NYJ: '#125740', PHI: '#004C54', PIT: '#FFB612', SEA: '#002244', SF: '#AA0000', TB: '#D50A0A', TEN: '#4B92DB', WAS: '#5A1414'
  };
  function sw(code) { return '<span class="sw" style="background:' + (COLORS[code] || '#333') + '" aria-hidden="true"></span>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pct(x) {
    if (!(x > 0)) return '0%';
    if (x < 0.01) return '<1%';
    if (x > 0.99 && x < 0.9999) return '>99%';
    return Math.round(x * 100) + '%';
  }
  function pct1(x) { return (x * 100).toFixed(1) + '%'; }
  var TZ = (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return undefined; } }());
  function fmt(iso, opts) {
    if (!iso) return '';
    try { return new Intl.DateTimeFormat(undefined, opts).format(new Date(iso)); } catch (e) { return String(iso); }
  }
  function fmtTime(iso) { return fmt(iso, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }); }
  function fmtKick(iso) { return fmt(iso, { weekday: 'short', hour: 'numeric', minute: '2-digit' }); }
  function fmtDayTime(iso) { return fmt(iso, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }); }
  function slotOf(g) {
    var d = new Date(g.kickoff), h = d.getUTCHours(), wd = d.getUTCDay();
    if (wd === 2 && h < 6) return 'MNF';
    if (wd === 1 && h < 6) return 'SNF';
    if (wd === 5 && h < 6) return 'TNF';
    if (wd === 0 && h >= 18) return 'LATE';
    if (wd === 0 && h < 16) return 'EARLY';
    return wd === 6 ? 'SAT' : 'SUN';
  }
  function qs(sel, el) { return (el || document).querySelector(sel); }
  function param(name) { try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; } }

  // ---------- week data ----------
  function loadJSON(url) {
    return fetch(url + (url.indexOf('?') < 0 ? '?_=' : '&_=') + Date.now(), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); });
  }
  function resolveWeek() {
    var season = param('season'), week = param('week');
    if (season && week) return Promise.resolve({ season: Number(season), week: Number(week), file: season + '-w' + (Number(week) < 10 ? '0' + Number(week) : week) + '.json' });
    return loadJSON('data/latest.json');
  }
  function loadWeek() {
    return resolveWeek().then(function (w) { return loadJSON('data/' + w.file); });
  }

  // Demo mode: the anonymized mockup fixture becomes a fake Week with games, scores and picks.
  function loadDemo() {
    return loadJSON('tests/fixture-mock-week.json').then(function (fx) {
      var slots = ['2026-10-18T17:00:00Z', '2026-10-18T17:00:00Z', '2026-10-18T17:00:00Z', '2026-10-18T17:00:00Z', '2026-10-18T17:00:00Z', '2026-10-18T20:05:00Z', '2026-10-18T20:25:00Z', '2026-10-18T20:25:00Z', '2026-10-19T00:20:00Z', '2026-10-20T00:15:00Z'];
      var games = fx.games.map(function (g, i) {
        return { id: g.id, espn: null, away: g.away, home: g.home, kickoff: slots[i] || slots[slots.length - 1], lock_at: '2026-10-18T16:50:00Z', p_home: g.p_home, p_source: 'mock', n_books: 0, frozen: true, market_total: 46.5 };
      });
      var scores = {}, finals = {};
      fx.games.forEach(function (g, i) {
        scores['demo' + g.id] = { status: g.status, away_score: g.away_score, home_score: g.home_score, period: g.status === 'pre' ? 0 : g.status === 'final' ? 4 : 3, clock: g.status === 'live' ? ['12:41', '2:15', '3:30'][i % 3] : '', detail: g.status === 'final' ? 'Final' : '' };
        if (g.status === 'final') finals[g.id] = '2026-10-18T20:' + String(g.final_order * 3).padStart(2, '0') + ':00Z';
        games[i].espn = 'demo' + g.id;
      });
      var players = fx.players.map(function (p) { var picks = {}; for (var j = 0; j < p.picks.length; j++) picks[fx.games[j].id] = p.picks[j]; return { name: p.name, tb: p.tb, picks: picks }; });
      var data = {
        season: 2026, week: 7, demo: true, generated_at: new Date().toISOString(),
        pool: { timezone: 'America/Denver', deadline: { weekday: 'Sunday', time: '10:50' }, deadline_utc: '2026-10-18T16:50:00Z', rules: { tie: 'nobody' } },
        tiebreak: { game_id: 9, label: 'WAS@SF', total: fx.params.mu, total_source: 'mock', sd: fx.params.sd },
        store: { available: false }, games: games
      };
      return { data: data, scores: scores, finals: finals, players: players };
    });
  }

  // Merge week data + live scores + finals-seen into engine-ready games (status, scores) with display extras.
  function assembleGames(data, scores, finals) {
    return data.games.map(function (g) {
      var s = g.espn ? scores[String(g.espn)] : null;
      var status = s ? s.status : 'pre';
      var away_score = s && s.away_score != null ? s.away_score : null, home_score = s && s.home_score != null ? s.home_score : null;
      if (status === 'pre') { away_score = null; home_score = null; }
      return {
        id: g.id, away: g.away, home: g.home, status: status, away_score: away_score, home_score: home_score, p_home: g.p_home,
        kickoff: g.kickoff, lock_at: g.lock_at, slot: slotOf(g), clock: s ? root.PickemESPN.clockText(s) : '', espn: g.espn,
        p_source: g.p_source, n_books: g.n_books, snapshot_at: g.snapshot_at, gap_minutes: g.gap_minutes, frozen: g.frozen,
        finalAt: finals[g.id] || null
      };
    });
  }
  function finalOrder(games) {
    return games.filter(function (g) { return g.status === 'final'; }).sort(function (a, b) {
      var ta = a.finalAt || '9', tb = b.finalAt || '9';
      return ta < tb ? -1 : ta > tb ? 1 : a.kickoff < b.kickoff ? -1 : a.kickoff > b.kickoff ? 1 : String(a.id) < String(b.id) ? -1 : 1;
    }).map(function (g) { return g.id; });
  }
  function sourceTitle(g) {
    if (g.p_source === 'store') return 'Market win %: power de-vig per book, median of ' + g.n_books + ' books. Snapshot ' + fmtDayTime(g.snapshot_at) + (g.frozen ? ', frozen at kickoff (' + g.gap_minutes + ' min before).' : ' (provisional until kickoff).');
    if (g.p_source === 'nflverse') return 'Market win %: nflverse moneyline, power de-vig (store had no snapshot for this game).';
    if (g.p_source === 'mock') return 'Mock win % from the design fixture.';
    return 'No market number for this game. 50% placeholder.';
  }

  // ---------- share link ----------
  // Picks ride in the URL fragment (#p=...), which browsers never send to the server. Nothing is stored
  // anywhere but the receiving browser. Compact: [name, tiebreak, picks string H/A/- in game order].
  function b64url(str) { return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function unb64url(str) { str = str.replace(/-/g, '+').replace(/_/g, '/'); while (str.length % 4) str += '='; return decodeURIComponent(escape(atob(str))); }
  // v3 format: #p=3~<key>~<game count>~<row>~<row>... (v2 used ! and * which chat apps cut) with row = name*tiebreak*picks. Picks are 2 bits per game
  // (0 blank, 1 home, 2 away) packed into bytes and base64url'd: 14 games -> 5 characters.
  // v1 (JSON in base64url) still decodes.
  var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  function packPicks(p, games) {
    var bytes = [], acc = 0, nb = 0;
    games.forEach(function (g) {
      var v = p.picks[g.id] === 'H' ? 1 : p.picks[g.id] === 'A' ? 2 : 0;
      acc = (acc << 2) | v; nb += 2;
      if (nb === 8) { bytes.push(acc); acc = 0; nb = 0; }
    });
    if (nb) bytes.push(acc << (8 - nb));
    var out = '', i;
    for (i = 0; i < bytes.length; i += 3) {
      var n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8) | (bytes[i + 2] || 0);
      out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + (i + 1 < bytes.length ? B64[(n >> 6) & 63] : '') + (i + 2 < bytes.length ? B64[n & 63] : '');
    }
    return out;
  }
  function unpackPicks(str, games) {
    var bytes = [], i;
    for (i = 0; i < str.length; i += 4) {
      var c = [0, 1, 2, 3].map(function (k) { var ch = str[i + k]; return ch === undefined ? -1 : B64.indexOf(ch); });
      if (c[0] < 0 || c[1] < 0) return null;
      var n = (c[0] << 18) | (c[1] << 12) | ((c[2] < 0 ? 0 : c[2]) << 6) | (c[3] < 0 ? 0 : c[3]);
      bytes.push((n >> 16) & 255); if (c[2] >= 0) bytes.push((n >> 8) & 255); if (c[3] >= 0) bytes.push(n & 255);
    }
    if (bytes.length * 4 < games.length) return null;
    var picks = {};
    games.forEach(function (g, j) { var v = (bytes[j >> 2] >> (6 - 2 * (j & 3))) & 3; picks[g.id] = v === 1 ? 'H' : v === 2 ? 'A' : ''; });
    return picks;
  }
  // Only unreserved URL characters (letters, digits, - _ . ~ and %xx) so chat apps never cut the link short:
  // rows joined by "~", fields by ".", names percent-encoded with "." and "~" escaped too.
  function encName(n) { return encodeURIComponent(n).replace(/\./g, '%2E').replace(/~/g, '%7E').replace(/[!*'()]/g, function (c) { return '%' + c.charCodeAt(0).toString(16).toUpperCase(); }); }
  function encodeShare(players, games, key) {
    return '3~' + key + '~' + games.length + '~' + players.map(function (p) { return encName(p.name) + '.' + (p.tb == null ? '' : String(p.tb).replace('.', '_')) + '.' + packPicks(p, games); }).join('~');
  }
  function decodeShare(frag, games, key) {
    try {
      var m = /[#&]p=([^&\s]+)/.exec(frag || ''); if (!m) return null;
      var raw = m[1], players = [], i;
      var v3 = raw.indexOf('3~') === 0, v2 = raw.indexOf('2!') === 0;
      if (v3 || v2) {
        var parts = raw.split(v3 ? '~' : '!');
        if (parts[1] !== key) return { error: 'This share link is for ' + parts[1] + ', not ' + key + '.' };
        if (Number(parts[2]) !== games.length) return { error: 'Share link does not match this week\u2019s games.' };
        for (i = 3; i < parts.length; i++) {
          var f = parts[i].split(v3 ? '.' : '*'); if (f.length !== 3) return { error: 'Share link looks cut off. Copy the whole link, including everything after the # sign.' };
          var picks = unpackPicks(f[2], games); if (!picks) return { error: 'Share link looks cut off. Copy the whole link, including everything after the # sign.' };
          var tb = f[1] === '' ? null : Number(f[1].replace('_', '.'));
          players.push({ name: decodeURIComponent(f[0]).slice(0, 60), tb: isFinite(tb) ? tb : null, picks: picks });
        }
      } else {
        var d = JSON.parse(unb64url(raw));
        if (!d || d.k !== key || !Array.isArray(d.p)) return { error: 'This share link is for ' + (d && d.k ? d.k : 'another week') + ', not ' + key + '.' };
        for (i = 0; i < d.p.length; i++) {
          var r = d.p[i]; if (!Array.isArray(r) || typeof r[0] !== 'string' || typeof r[2] !== 'string' || r[2].length !== games.length) return { error: 'Share link does not match this week’s games.' };
          var pk = {}; games.forEach(function (g, j) { pk[g.id] = r[2][j] === 'H' ? 'H' : r[2][j] === 'A' ? 'A' : ''; });
          players.push({ name: r[0].slice(0, 60), tb: typeof r[1] === 'number' && isFinite(r[1]) ? r[1] : null, picks: pk });
        }
      }
      return players.length ? { players: players } : { error: 'Share link holds no players.' };
    } catch (e) { return { error: 'Share link could not be read.' }; }
  }
  // On page load: a share link in the URL imports its picks into this browser, then the fragment is dropped.
  function importFromShareLink(games, key) {
    if (!location.hash || location.hash.indexOf('p=') < 0) return null;
    var r = decodeShare(location.hash, games, key);
    if (r && r.players) S.set('picks:' + key, { players: r.players, importedAt: new Date().toISOString(), format: 'share-link' });
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
    return r;
  }
  function shareURL(players, games, key) {
    return location.origin + location.pathname.replace(/(standings|index)\.html$/, '') + '#p=' + encodeShare(players, games, key);
  }

  // ---------- header ----------
  function header(active, extra) {
    // Carry demo/season/week params across pages, never the view toggle.
    var q = ''; try { var sp = new URLSearchParams(location.search); sp.delete('view'); q = sp.toString() ? '?' + sp.toString() : ''; } catch (e) { q = ''; }
    return '<header class="pk-header"><div class="pk-header-in">' +
      '<a class="pk-brand" href="/" aria-label="PROFITPATH Sports home"><span class="w">PROFIT<b>PATH</b></span><span class="s">SPORTS</span></a>' +
      '<span class="pk-sep" aria-hidden="true"></span><span class="pk-app">Pick’em</span>' +
      '<nav class="pk-nav" aria-label="Pool sections">' +
      '<a href="index.html' + q + '"' + (active === 'live' ? ' class="on" aria-current="page"' : '') + '>Live</a>' +
      '<a href="standings.html' + q + '"' + (active === 'standings' ? ' class="on" aria-current="page"' : '') + '>Standings</a>' +
      '</nav>' + (extra || '') + '</div></header>';
  }
  function youSelect(players, you) {
    var opts = '<option value="">(none)</option>' + players.map(function (p) { return '<option value="' + esc(p.name) + '"' + (p.name === you ? ' selected' : '') + '>' + esc(p.name) + '</option>'; }).join('');
    return '<label class="pk-you">You <select id="youSel" aria-label="Which player is you">' + opts + '</select></label>';
  }

  // ---------- import panel ----------
  // Renders into `el`. onChange(kind) fires after a successful import ('picks') or clear.
  function importPanel(el, ctx, onChange) {
    var games = ctx.games, key = ctx.key;
    var picksMeta = S.get('picks:' + key, null);
    el.innerHTML =
      '<div class="ihead"><h2>Pool data</h2><div class="row">' +
      (picksMeta ? '<span class="srcnote">' + picksMeta.players.length + ' players imported ' + esc(fmtDayTime(picksMeta.importedAt)) + '</span>' : '<span class="srcnote">No picks loaded for this week.</span>') +
      (picksMeta ? '<button class="btn small green" id="shareBtn">Copy share link</button>' : '') +
      '<button class="btn small" id="impToggle" aria-expanded="' + (ctx.open ? 'true' : 'false') + '">' + (picksMeta ? 'Replace or manage' : 'Import picks') + '</button></div></div>' +
      '<div class="report" id="shareMsg"></div>' +
      '<div id="impBody"' + (ctx.open ? '' : ' class="hidden"') + '>' +
      '<div class="drop" id="drop">Drop the PoolHost download (allpicks.xls) or the picks CSV here, or <label style="color:var(--cyan);cursor:pointer"><input type="file" id="file" accept=".csv,.xls,.html,.htm,text/csv,text/html,.txt" class="sr"> choose a file</label>.<br><span class="srcnote">PoolHost: the All Picks page\u2019s download button. CSV template: player,tiebreak,AWAY@HOME,... with nflverse codes (LA = Rams, WAS).</span></div>' +
      '<textarea id="paste" placeholder="Or paste a share link or CSV text here" aria-label="Paste share link or CSV"></textarea>' +
      '<div class="row"><button class="btn cyan" id="parseBtn">Load pasted text</button><button class="btn" id="tplBtn">Download blank template</button><button class="btn" id="exportBtn">Export week JSON</button><button class="btn danger" id="clearBtn">Clear pool data</button></div>' +
      '<div class="report" id="report"></div>' +
      '<div class="srcnote">Picks stay in this browser only. Nothing is uploaded. The export holds the snapshot log (every player’s status and win % at picks-locked time and after each final) for checking calibration later.</div>' +
      '</div>';
    var body = qs('#impBody', el), rep = qs('#report', el);
    var sb = qs('#shareBtn', el);
    if (sb) sb.onclick = function () {
      var url = shareURL(picksMeta.players, games, key), msg = qs('#shareMsg', el);
      var show = function (ok) { msg.innerHTML = (ok ? '<div class="ok">Link copied. Anyone who opens it gets this week\u2019s picks on their own device. Share it with pool members only.</div>' : '<div class="w">Copy this link:</div>') + '<textarea readonly style="min-height:60px" onclick="this.select()">' + esc(url) + '</textarea>'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { show(true); }, function () { show(false); });
      else show(false);
    };
    qs('#impToggle', el).onclick = function () { var open = body.classList.toggle('hidden'); this.setAttribute('aria-expanded', String(!open)); };
    function showReport(r, okMsg) {
      var lines = [];
      if (r.ok) lines.push('<div class="ok">' + esc(okMsg) + '</div>');
      r.report.errors.forEach(function (e) { lines.push('<div class="e">Error: ' + esc(e) + '</div>'); });
      r.report.warnings.forEach(function (w) { lines.push('<div class="w">Note: ' + esc(w) + '</div>'); });
      if (!r.ok && !r.report.errors.length) lines.push('<div class="e">Nothing imported.</div>');
      rep.innerHTML = lines.join('');
    }
    function handle(text) {
      if (/#p=/.test(text)) {
        var sl = decodeShare(text, games, key);
        if (sl && sl.players) {
          var meta2 = { players: sl.players, importedAt: new Date().toISOString(), format: 'share-link' };
          S.set('picks:' + key, meta2);
          rep.innerHTML = '<div class="ok">Loaded ' + sl.players.length + ' players from the share link.</div>';
          var note3 = qs('.ihead .srcnote', el); if (note3) note3.textContent = sl.players.length + ' players imported ' + fmtDayTime(meta2.importedAt);
          onChange('picks');
        } else rep.innerHTML = '<div class="e">Error: ' + esc(sl && sl.error ? sl.error : 'Share link could not be read.') + '</div>';
        return;
      }
      var r = P.parseAny(text, games);
      if (r.ok) {
        var meta = { players: r.players, importedAt: new Date().toISOString(), format: r.report.format };
        S.set('picks:' + key, meta);
        showReport(r, 'Loaded ' + r.players.length + ' players for ' + key + '.');
        var note = qs('.ihead .srcnote', el); if (note) note.textContent = meta.players.length + ' players imported ' + fmtDayTime(meta.importedAt);
        onChange('picks');
      } else showReport(r, '');
    }
    function readFile(f) { var rd = new FileReader(); rd.onload = function () { handle(String(rd.result)); }; rd.readAsText(f); }
    var drop = qs('#drop', el);
    drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('over'); });
    drop.addEventListener('dragleave', function () { drop.classList.remove('over'); });
    drop.addEventListener('drop', function (e) { e.preventDefault(); drop.classList.remove('over'); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); });
    qs('#file', el).onchange = function () { if (this.files[0]) readFile(this.files[0]); };
    qs('#parseBtn', el).onclick = function () { handle(qs('#paste', el).value); };
    qs('#tplBtn', el).onclick = function () {
      download('picks-template-' + key + '.csv', P.toPicksCSV([{ name: 'ExamplePlayer', tb: 47, picks: {} }], games), 'text/csv');
    };
    qs('#exportBtn', el).onclick = function () {
      var snaps = S.get('snapshots:' + key, []);
      download('pickem-' + key + '-snapshots.json', JSON.stringify({ week: key, exported_at: new Date().toISOString(), snapshots: snaps }, null, 1), 'application/json');
    };
    qs('#clearBtn', el).onclick = function () {
      if (!confirm('Clear every pick’em item stored in this browser (picks, snapshots)?')) return;
      S.clearAll(); rep.innerHTML = '<div class="ok">Cleared.</div>'; var note2 = qs('.ihead .srcnote', el); if (note2) note2.textContent = 'No picks loaded for this week.'; onChange('clear');
    };
  }
  function download(name, text, type) {
    try {
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    } catch (e) { alert('Could not start the download in this browser.'); }
  }

  // Snapshot log: one entry per board state after lock (and after each new final). Stored per week.
  function logSnapshot(key, trigger, games, players, res) {
    var finals = games.filter(function (g) { return g.status === 'final'; }).map(function (g) { return g.id; }).sort();
    var snaps = S.get('snapshots:' + key, []);
    var last = snaps[snaps.length - 1];
    var sig = finals.join('|');
    if (last && last.finals_sig === sig) return false;
    var entry = { at: new Date().toISOString(), trigger: trigger, finals: finals, finals_sig: sig, endings: res.N, players: {} };
    players.forEach(function (p, i) { entry.players[p.name] = { status: res.status[i], win: Math.round(res.win[i] * 10000) / 10000, pts: res.base[i], max: res.max[i] }; });
    snaps.push(entry);
    S.set('snapshots:' + key, snaps);
    return true;
  }

  root.PickemUI = { COLORS: COLORS, sw: sw, esc: esc, pct: pct, pct1: pct1, fmt: fmt, fmtTime: fmtTime, fmtKick: fmtKick, fmtDayTime: fmtDayTime, TZ: TZ, slotOf: slotOf, qs: qs, param: param,
    loadJSON: loadJSON, resolveWeek: resolveWeek, loadWeek: loadWeek, loadDemo: loadDemo, assembleGames: assembleGames, finalOrder: finalOrder, sourceTitle: sourceTitle,
    header: header, youSelect: youSelect, importPanel: importPanel, download: download, logSnapshot: logSnapshot,
    encodeShare: encodeShare, decodeShare: decodeShare, packPicks: packPicks, unpackPicks: unpackPicks, importFromShareLink: importFromShareLink, shareURL: shareURL };
}(typeof self !== 'undefined' ? self : this));
