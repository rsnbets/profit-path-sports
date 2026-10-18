/* PPS Pick'em: standings. The week grid: right, wrong, leading now, not started, rare-pick marker, consensus and Market rows. */
(function () {
  'use strict';
  var U = window.PickemUI, S = window.PickemStore, ESPN = window.PickemESPN;
  var esc = U.esc, qs = U.qs;
  var st = { data: null, key: '', demo: false, scores: {}, finals: {}, players: [], you: '', lastFetch: null };

  function init() {
    st.demo = U.param('demo') === '1';
    var load = st.demo ? U.loadDemo().then(function (d) { st.data = d.data; st.scores = d.scores; st.finals = d.finals; st.players = d.players; })
      : U.loadWeek().then(function (d) { st.data = d; });
    load.then(function () {
      st.key = S.weekKey(st.data.season, st.data.week) + (st.demo ? '-demo' : '');
      if (!st.demo) { st.finals = S.get('finals:' + st.key, {}); var m = S.get('picks:' + st.key, null); st.players = m && m.players ? m.players : []; }
      st.you = S.get('you', '') || '';
      renderShell(); render();
      if (!st.demo) poll();
    }).catch(function (e) { document.getElementById('app').innerHTML = '<main class="pk-main"><div class="notice err"><h2>Could not load this week</h2><div>' + esc(e.message) + '</div></div></main>'; });
  }
  function poll() {
    ESPN.fetchWeek(st.data.season, st.data.week).then(function (scores) {
      st.scores = scores; st.lastFetch = new Date().toISOString();
      var changed = false, nowIso = new Date().toISOString();
      st.data.games.forEach(function (g) { var s = g.espn && scores[String(g.espn)]; if (s && s.status === 'final' && !st.finals[g.id]) { st.finals[g.id] = nowIso; changed = true; } });
      if (changed) S.set('finals:' + st.key, st.finals);
      render();
    }).catch(function () { render(); }).then(function () { setTimeout(poll, 60000); });
  }
  function renderShell() {
    document.getElementById('app').innerHTML = U.header('standings', '<span id="youSlot"></span>') +
      '<main class="pk-main"><section class="pk-title" id="title"></section><div id="body"></div><section class="card import" id="import"></section><footer class="pk-footer" id="foot"></footer></main>';
  }
  function winnerOf(g) { return g.home_score > g.away_score ? 'H' : g.away_score > g.home_score ? 'A' : 'T'; }
  function teamOf(g, side) { return side === 'H' ? g.home : side === 'A' ? g.away : ''; }
  function rankOf(vals, i) { var ahead = vals.filter(function (v) { return v > vals[i]; }).length, same = vals.filter(function (v) { return v === vals[i]; }).length; return (same > 1 ? 'T' : '') + (ahead + 1); }

  function render() {
    var data = st.data, games = U.assembleGames(data, st.scores, st.finals), Pl = st.players, N = Pl.length;
    var now = Date.now(), lockAll = Math.max.apply(null, games.map(function (g) { return new Date(g.lock_at).getTime(); }));
    var locked = st.demo || now >= lockAll;
    qs('#youSlot').innerHTML = N ? U.youSelect(Pl, st.you) : '';
    var ys = qs('#youSel'); if (ys) ys.onchange = function () { st.you = this.value; S.set('you', st.you); render(); };
    var finals = games.filter(function (g) { return g.status === 'final'; });
    var mkt = {}; games.forEach(function (g) { mkt[g.id] = g.p_home >= 0.5 ? 'H' : 'A'; });
    var wkPts = Pl.map(function (p) { return finals.filter(function (g) { return p.picks[g.id] === winnerOf(g); }).length; });
    var mktWk = finals.filter(function (g) { return mkt[g.id] === winnerOf(g); }).length;

    qs('#title').innerHTML = '<div style="display:flex;flex-direction:column;gap:6px"><div class="eyebrow cyan">' + data.season + ' season · Week ' + data.week + (finals.length === games.length ? ' final' : ' in progress') + '</div><h1>Standings</h1>' +
      '<p>' + esc(data.pool.name || 'Pool') + (N ? ' · ' + N + ' players' : '') + ' · ' + finals.length + ' of ' + games.length + ' Week ' + data.week + ' games final' + (st.lastFetch ? ' · scores ' + esc(U.fmtTime(st.lastFetch)) : '') + '</p></div>' +
      '<div class="pk-pills">' + (st.demo ? '<span class="badge">MOCK DATA</span>' : '') + '</div>';

    if (!N) { qs('#body').innerHTML = '<div class="notice warn"><h2>No picks loaded in this browser</h2><div>Drop the PoolHost download (allpicks.xls) into the Pool data panel on the Live page or below.</div></div>'; renderImport(games); renderFoot(); return; }
    if (!locked) { qs('#body').innerHTML = '<div class="notice"><h2>Picks show once every game’s picks are in</h2><div>Picks lock ' + esc(U.fmtDayTime(data.pool.deadline_utc)) + '.</div></div>'; renderImport(games); renderFoot(); return; }

    var youI = Pl.map(function (p) { return p.name; }).indexOf(st.you);
    qs('#body').innerHTML = weekGrid(games, Pl, wkPts, mkt, mktWk, youI);
    renderImport(games); renderFoot();
  }

  function cell(g, side, n) {
    var abbr = teamOf(g, side);
    if (!abbr) return '<span class="cell blank" title="No pick">·</span>';
    var rare = n <= 2 ? '<span class="rare" aria-label="2 or fewer took this"></span>' : '';
    var mine = side === 'H' ? g.home_score : g.away_score, theirs = side === 'H' ? g.away_score : g.home_score;
    var cls = g.status === 'final' ? (mine > theirs ? 'right' : 'wrong') : g.status === 'live' ? (mine > theirs ? 'lead' : 'trail') : 'pre';
    return '<span class="cell ' + cls + '">' + esc(abbr) + rare + '</span>';
  }
  function weekGrid(games, Pl, wkPts, mkt, mktWk, youI) {
    var G = games.length, cols = '230px repeat(' + G + ', minmax(62px, 1fr)) 64px 56px';
    var row = function (cls) { return '<div class="wgrid ' + cls + '" style="grid-template-columns:' + cols + '">'; };
    var heads = games.map(function (g) {
      var fin = g.status === 'final', pre = g.status === 'pre', w = fin ? winnerOf(g) : null;
      return '<span class="gh"><span class="s ' + (fin ? 'fin' : g.status === 'live' ? 'live' : 'pre') + '">' + esc(fin ? (g.clock || 'FINAL') : g.status === 'live' ? g.clock : g.slot) + '</span><span class="tl' + (fin && w === 'H' ? ' lost' : '') + '"><span>' + esc(g.away) + '</span><span>' + (pre ? '' : g.away_score) + '</span></span><span class="tl' + (fin && w === 'A' ? ' lost' : '') + '"><span>' + esc(g.home) + '</span><span>' + (pre ? '' : g.home_score) + '</span></span></span>';
    }).join('');
    var counts = games.map(function (g) { return { H: Pl.filter(function (p) { return p.picks[g.id] === 'H'; }).length, A: Pl.filter(function (p) { return p.picks[g.id] === 'A'; }).length }; });
    var cons = games.map(function (g, k) { var side = counts[k].H >= counts[k].A ? 'H' : 'A'; return '<span class="cc"><b>' + esc(teamOf(g, side)) + '</b><small>' + Math.round(100 * counts[k][side] / Pl.length) + '%</small></span>'; }).join('');
    var order = Pl.map(function (p, i) { return i; }).sort(function (a, b) { return wkPts[b] - wkPts[a] || Pl[a].name.localeCompare(Pl[b].name); });
    var topWeek = Math.max.apply(null, wkPts);
    var rows = order.map(function (i) {
      var p = Pl[i];
      return row(i === youI ? 'you' : '') + '<span class="sticky"><span class="rk">' + rankOf(wkPts, i) + '</span><span class="nm"' + (i === youI ? ' style="color:var(--cyan)"' : '') + '>' + esc(p.name) + '</span>' + (i === youI ? '<span class="you">YOU</span>' : '') + '</span>' +
        games.map(function (g, k) { return cell(g, p.picks[g.id], counts[k][p.picks[g.id]] || 0); }).join('') +
        '<span class="ctr wk' + (wkPts[i] === topWeek ? ' top' : '') + '">' + wkPts[i] + '</span><span class="ctr mono" style="font-size:13px;color:rgba(240,238,232,0.7)">' + (p.tb == null ? '·' : p.tb) + '</span></div>';
    }).join('');
    var mrow = row('mkt') + '<span class="sticky"><span class="rk">·</span><span style="display:flex;flex-direction:column;line-height:1.25"><span style="font-size:15px;font-weight:700;color:var(--yellow)">The Market</span><span style="font-size:11px;color:var(--dim)">Every favorite · not eligible</span></span></span>' +
      games.map(function (g) { return cell(g, mkt[g.id], 99); }).join('') + '<span class="ctr wk" style="color:var(--yellow)">' + mktWk + '</span><span class="ctr mono" style="font-size:13px;color:var(--dim)">' + (st.data.tiebreak.total == null ? '' : st.data.tiebreak.total) + '</span></div>';
    return '<section class="card" aria-label="Week picks" style="overflow:hidden"><div style="padding:14px 18px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid var(--border-soft)"><h2 style="font-family:var(--head);font-size:20px;margin:0">Week ' + st.data.week + ' picks</h2>' +
      '<div class="keys"><span><i class="right"></i>Right</span><span><i class="wrong"></i>Wrong</span><span><i class="lead"></i>Leading now</span><span><i class="pre"></i>Not started</span><span><i class="rare"></i>2 or fewer took it</span></div></div>' +
      '<div class="tscroll"><div style="min-width:' + (300 + 68 * G + 140) + 'px;padding-bottom:6px">' +
      row('th') + '<span class="sticky th">Player</span>' + heads + '<span class="thl" style="padding-bottom:12px">Week</span><span class="thl" style="padding-bottom:12px" title="Tiebreak guess: ' + esc(st.data.tiebreak.label) + ' total">TB</span></div>' +
      row('cons') + '<span class="sticky" style="font-size:13px;font-weight:700;color:rgba(240,238,232,0.75)">Pool consensus</span>' + cons + '<span></span><span></span></div>' +
      rows + mrow + '</div></div></section>';
  }
  function renderImport(games) {
    var el = qs('#import');
    if (st.demo) { el.innerHTML = '<div class="ihead"><h2>Mock data</h2><span class="srcnote">Design fixture with anonymized handles.</span></div>'; return; }
    if (el.getAttribute('data-key') === st.key) return;
    el.setAttribute('data-key', st.key);
    U.importPanel(el, { games: games, key: st.key, season: st.data.season, week: st.data.week }, function () { var m = S.get('picks:' + st.key, null); st.players = m && m.players ? m.players : []; render(); });
  }
  function renderFoot() {
    qs('#foot').innerHTML = '<span><b>Math, not picks. Win % from betting markets, frozen at kickoff.</b></span><span>Weekly winner is most correct picks, closest ' + esc(st.data.tiebreak.label) + ' total breaks ties. The Market row picks every de-vigged favorite as a benchmark and can’t win anything. A tied game scores nobody. A blank pick counts wrong.</span><span>Scores: ESPN scoreboard. Market favorites from the data build (' + esc(U.fmtDayTime(st.data.generated_at)) + '). Times shown in ' + esc(U.TZ || 'your local zone') + '.</span>';
  }
  init();
}());
