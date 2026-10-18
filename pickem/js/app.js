/* PPS Pick'em: the live board. Who can still win, the chance each player has, what each needs. */
(function () {
  'use strict';
  var U = window.PickemUI, S = window.PickemStore, E = window.PickemEngine, ESPN = window.PickemESPN;
  var esc = U.esc, sw = U.sw, pct = U.pct, qs = U.qs;
  var SC = { 'Clinched': ['clinched', '#4DFF78'], 'Alive': ['alive', '#00D4FF'], 'Tiebreak only': ['tb', '#F5B545'], 'Out': ['out', 'rgba(240,238,232,0.62)'] };

  var st = { data: null, key: '', demo: false, scores: {}, finals: {}, players: [], forced: {}, sel: null, you: '', lastFetch: null, fetchErr: null, timer: null };

  function init() {
    st.demo = U.param('demo') === '1';
    var load = st.demo ? U.loadDemo().then(function (d) { st.data = d.data; st.scores = d.scores; st.finals = d.finals; st.demoPlayers = d.players; })
      : U.loadWeek().then(function (d) { st.data = d; });
    load.then(function () {
      st.key = S.weekKey(st.data.season, st.data.week) + (st.demo ? '-demo' : '');
      st.finals = st.demo ? st.finals : S.get('finals:' + st.key, {});
      st.you = S.get('you', '') || '';
      if (!st.demo) { var sl = U.importFromShareLink(st.data.games, st.key); if (sl && sl.error) st.shareErr = sl.error; else if (sl) st.shareOk = sl.players.length; }
      loadPicks();
      renderShell();
      render();
      if (!st.demo) { poll(); }
      // A share link opened while the page is already up only changes the hash: import it then too.
      window.addEventListener('hashchange', function () { if (st.demo) return; var sl = U.importFromShareLink(st.data.games, st.key); if (sl && sl.error) st.shareErr = sl.error; else if (sl) { st.shareOk = sl.players.length; st.shareErr = null; } loadPicks(); st.forced = {}; st.sel = null; var el = qs('#import'); if (el) el.removeAttribute('data-key'); render(); });
      setInterval(function () { if (!st.engineOn) render(); }, 30000);   // keep the countdown fresh
    }).catch(function (e) {
      document.getElementById('app').innerHTML = '<main class="pk-main"><div class="notice err"><h2>Could not load this week</h2><div>' + esc(e.message) + '</div><div class="srcnote">The data build writes pickem/data/&lt;season&gt;-w&lt;week&gt;.json and latest.json.</div></div></main>';
    });
  }
  function loadPicks() {
    if (st.demo) { st.players = st.demoPlayers; return; }
    var m = S.get('picks:' + st.key, null);
    st.players = m && m.players ? m.players : [];
  }

  // ---------- live scores ----------
  function anyLiveWindow(games) {
    var now = Date.now();
    return games.some(function (g) { return g.status === 'live' || (g.status !== 'final' && new Date(g.kickoff).getTime() <= now && now - new Date(g.kickoff).getTime() < 5 * 3600 * 1000); });
  }
  function poll() {
    ESPN.fetchWeek(st.data.season, st.data.week).then(function (scores) {
      st.scores = scores; st.lastFetch = new Date().toISOString(); st.fetchErr = null;
      var changed = false, nowIso = new Date().toISOString();
      st.data.games.forEach(function (g) { var s = g.espn && scores[String(g.espn)]; if (s && s.status === 'final' && !st.finals[g.id]) { st.finals[g.id] = nowIso; changed = true; } });
      if (changed) S.set('finals:' + st.key, st.finals);
      render();
    }).catch(function (e) { st.fetchErr = e.message; render(); }).then(function () {
      var games = U.assembleGames(st.data, st.scores, st.finals);
      var wait = anyLiveWindow(games) ? 60000 : 5 * 60000;
      clearTimeout(st.timer); st.timer = setTimeout(poll, wait);
    });
  }

  // ---------- shell ----------
  function renderShell() {
    var app = document.getElementById('app');
    app.innerHTML = U.header('live', '<span id="youSlot"></span>') +
      '<main class="pk-main">' +
      '<section class="pk-title" id="title"></section>' +
      '<div id="gate"></div>' +
      '<div id="banner"></div>' +
      '<section aria-label="Scoreboard" id="scoreboard" style="display:flex;flex-direction:column;gap:12px"></section>' +
      '<div class="cols" id="cols"></div>' +
      '<section class="card import" id="import" aria-label="Pool data"></section>' +
      '<footer class="pk-footer" id="foot"></footer>' +
      '</main>';
  }

  // ---------- render ----------
  function render() {
    var data = st.data;
    var games = U.assembleGames(data, st.scores, st.finals);
    var byId = {}; games.forEach(function (g) { byId[g.id] = g; });
    var now = Date.now();
    var lockAll = Math.max.apply(null, games.map(function (g) { return new Date(g.lock_at).getTime(); }));
    var locked = st.demo || now >= lockAll;
    var hasPicks = st.players.length > 0;
    st.engineOn = locked && hasPicks;
    var finals = games.filter(function (g) { return g.status === 'final'; }), lives = games.filter(function (g) { return g.status === 'live'; });

    // You selector
    qs('#youSlot').innerHTML = hasPicks ? U.youSelect(st.players, st.you) : '';
    var ys = qs('#youSel'); if (ys) ys.onchange = function () { st.you = this.value; S.set('you', st.you); if (!st.sel && st.you) st.sel = st.you; render(); };

    var res = null, eng = null, mkt = null;
    if (st.engineOn) {
      eng = E.makeEngine(games, st.players, { mu: data.tiebreak.total, sd: data.tiebreak.sd, rules: data.pool.rules });
      res = eng.analyze({ forced: st.forced });
      if (!Object.keys(st.forced).length) U.logSnapshot(st.key, finals.length ? 'final' : 'picks-locked', games, st.players, res);
    }

    // Title
    var state = games.every(function (g) { return g.status === 'final'; }) ? 'done' : lives.length ? 'live' : 'pre';
    var eyebrow = state === 'live' ? '<div class="eyebrow live"><span class="dot"></span>Live</div>' : state === 'done' ? '<div class="eyebrow done">Final</div>' : '<div class="eyebrow pre">' + (locked ? 'Picks in' : 'Before the deadline') + '</div>';
    var counts = res ? { alive: res.status.filter(function (s) { return s === 'Alive' || s === 'Clinched'; }).length, tb: res.status.filter(function (s) { return s === 'Tiebreak only'; }).length, out: res.status.filter(function (s) { return s === 'Out'; }).length } : null;
    qs('#title').innerHTML =
      '<div style="display:flex;flex-direction:column;gap:6px">' + eyebrow +
      '<h1>Week ' + data.week + ': who can still win</h1>' +
      '<p>' + esc(data.pool.name || 'Pool') + (hasPicks ? ' · ' + st.players.length + ' players' : '') + ' · picks locked ' + esc(U.fmtDayTime(data.pool.deadline_utc)) + '</p></div>' +
      '<div class="pk-pills">' +
      (counts ? '<span class="pill cyan">' + counts.alive + ' alive</span><span class="pill yellow">' + counts.tb + ' tiebreak only</span><span class="pill dim">' + counts.out + ' out</span>' : '') +
      (st.demo ? '<span class="badge">MOCK DATA</span>' : '') +
      (st.fetchErr ? '<span class="badge" title="' + esc(st.fetchErr) + '">scores offline</span>' : '') +
      '<span class="updated">' + (st.demo ? 'Mock week' : st.lastFetch ? 'Scores ' + esc(U.fmtTime(st.lastFetch)) : 'Scores loading') + '</span></div>';

    // Gate / notices
    var gate = '';
    if (st.shareErr) gate += '<div class="notice err"><h2>Share link problem</h2><div>' + esc(st.shareErr) + '</div></div>';
    if (st.shareOk) gate += '<div class="notice"><div class="eyebrow cyan">Loaded from share link</div><div>' + st.shareOk + ' players\u2019 picks are now saved on this device.</div></div>';
    if (!hasPicks) gate += '<div class="notice warn"><h2>No picks on this device</h2><div>Ask the commissioner for the share link, or drop the PoolHost download (allpicks.xls) into the Pool data panel below. Picks stay on the device that loads them.</div><div><button type="button" class="btn green" id="goImport">Go to import</button></div></div>';
    if (!locked) {
      var ms = lockAll - now, h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
      gate += '<div class="notice"><h2>Board opens when every pick is in</h2><div class="countdown">' + (ms > 0 ? h + 'h ' + m + 'm' : 'now') + '</div><div>Picks lock ' + esc(U.fmtDayTime(data.pool.deadline_utc)) + '. Until then this page shows results so far. Picks that are not in yet are never used.</div></div>';
    }
    if (locked && hasPicks && data.tiebreak.total == null) gate += '<div class="notice warn"><h2>No market total for the tiebreak game</h2><div>Tiebreak odds are off until the data build has one.</div></div>';
    qs('#gate').innerHTML = gate;
    var gi = qs('#goImport'); if (gi) gi.onclick = function () { var el = qs('#import'); var b = qs('#impBody', el); if (b) b.classList.remove('hidden'); el.scrollIntoView({ behavior: 'smooth' }); };

    // Market row picks
    mkt = {}; games.forEach(function (g) { mkt[g.id] = g.p_home >= 0.5 ? 'H' : 'A'; });

    renderBanner(games, eng, res);
    renderScoreboard(games, res);
    renderCols(games, eng, res, mkt, byId);
    renderImport(games);
    renderFooter(games, res);
  }

  function winnerOf(g) { return g.home_score > g.away_score ? 'H' : g.away_score > g.home_score ? 'A' : 'T'; }
  function teamOf(g, side) { return side === 'H' ? g.home : side === 'A' ? g.away : 'TIE'; }

  function renderBanner(games, eng, res) {
    var el = qs('#banner');
    if (!res || !res.U.length) { el.innerHTML = ''; return; }
    var big = eng.biggestGame(res);
    if (!big) { el.innerHTML = ''; return; }
    var g = games.filter(function (x) { return x.id === big.gid; })[0];
    var names = function (arr) { return arr.length ? arr.map(function (x) { return esc(x.name); }).join(', ') : 'Nobody with a real stake'; };
    el.innerHTML = '<section class="banner" aria-label="Biggest game left"><div class="lead"><div class="eyebrow">Biggest game left</div>' +
      '<div class="big">' + esc(g.away) + ' @ ' + esc(g.home) + '</div><div class="sub">' + (g.status === 'live' ? 'Live, ' + esc(g.clock) : esc(g.slot) + ', ' + esc(U.fmtKick(g.kickoff))) + ' · moves ' + big.cnt + ' players’ odds by 10+ points</div></div>' +
      '<div class="sides"><div class="side-box"><div class="who">' + sw(g.away) + 'Pulling for ' + esc(g.away) + '</div><div class="names">' + names(big.awayNames) + '</div></div>' +
      '<div class="side-box"><div class="who">' + sw(g.home) + 'Pulling for ' + esc(g.home) + '</div><div class="names">' + names(big.homeNames) + '</div></div></div></section>';
  }

  function renderScoreboard(games, res) {
    var el = qs('#scoreboard');
    var anyForced = Object.keys(st.forced).length > 0;
    var forcedList = Object.keys(st.forced).map(function (gid) { var g = games.filter(function (x) { return String(x.id) === String(gid); })[0]; return g ? teamOf(g, st.forced[gid]) : ''; });
    var P = st.players.length;
    var hint = !st.engineOn ? (st.players.length ? 'What-ifs turn on once the board opens.' : 'Market win % shown under each game.') : anyForced ? 'What-if: ' + esc(forcedList.join(', ')) + ' win. Everything below reflects it.' : 'Tap any team in a game that isn’t final to test a result.';
    var cards = games.map(function (g) {
      var fin = g.status === 'final', w = fin ? winnerOf(g) : null, f = st.forced[g.id] || null;
      var row = function (side) {
        var abbr = teamOf(g, side);
        var n = st.players.filter(function (p) { return p.picks[g.id] === side; }).length;
        var isWin = fin && w === side, isLose = fin && w !== side, isF = f === side, isFOther = !!f && f !== side;
        var cls = 'team' + (isWin ? ' win' : '') + (isLose || isFOther ? ' lose' : '') + (isF ? ' pressed' : '');
        var inner = sw(abbr) + '<span class="ab">' + esc(abbr) + (isWin ? '<span class="tag">W</span>' : '') + (isF ? '<span class="tag wi">WHAT IF</span>' : '') + (fin && w === 'T' ? '<span class="tag">TIE</span>' : '') + '</span>' +
          '<span class="share">' + (P && st.engineOn ? Math.round(100 * n / P) + '%' : '') + '</span><span class="sc">' + (g.status === 'pre' ? '' : esc(side === 'H' ? g.home_score : g.away_score)) + '</span>';
        if (fin || !st.engineOn) return '<div class="' + cls + '">' + inner + '</div>';
        return '<button type="button" class="' + cls + '" data-gid="' + esc(g.id) + '" data-side="' + side + '" aria-pressed="' + isF + '" aria-label="' + (isF ? 'Remove what-if: ' + abbr + ' wins' : 'What if ' + abbr + ' wins?') + '">' + inner + '</button>';
      };
      var favH = g.p_home >= 0.5, fav = favH ? g.home : g.away, favP = favH ? g.p_home : 1 - g.p_home;
      var hit = fin && st.engineOn ? st.players.filter(function (p) { return p.picks[g.id] === w; }).length : 0;
      var foot = fin ? (st.engineOn ? hit + ' of ' + P + ' got it' : esc(g.clock)) : '<span title="' + esc(U.sourceTitle(g)) + '">Market: ' + esc(fav) + ' ' + Math.round(100 * favP) + '% to win' + (g.status === 'live' ? ' (pregame)' : '') + (g.p_source === 'nflverse' ? ' · nflverse' : g.frozen === false && g.p_source === 'store' ? ' · provisional' : '') + '</span>';
      var stCls = fin ? '' : g.status === 'live' ? ' live' : ' pre';
      var stLabel = fin ? esc(g.clock || 'FINAL') : g.status === 'live' ? '<span class="dot"></span>' + esc(g.clock || 'LIVE') : esc(g.slot);
      return '<div class="game' + (g.status === 'live' ? ' live' : '') + (f ? ' forced' : '') + '"><div class="top"><span class="st' + stCls + '">' + stLabel + '</span><span class="kick">' + esc(U.fmtKick(g.kickoff)) + '</span></div>' + row('A') + row('H') + '<div class="foot">' + foot + '</div></div>';
    }).join('');
    el.innerHTML = '<div class="sec-head"><div style="display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px"><h2>Scoreboard</h2><span class="hint">' + hint + '</span></div>' +
      (anyForced ? '<button type="button" class="btn cyan" id="clearWI">Clear what-ifs</button>' : '') + '</div>' +
      '<div class="games">' + cards + '</div>' +
      '<div class="legend">% next to each team = share of the pool that picked it. Picks show once every game’s picks are in. Market % hover shows its source. Games in progress use the pregame number.</div>';
    el.querySelectorAll('button.team').forEach(function (b) { b.onclick = function () { toggle(this.getAttribute('data-gid'), this.getAttribute('data-side'), games); }; });
    var c = qs('#clearWI'); if (c) c.onclick = function () { st.forced = {}; render(); };
  }
  function toggle(gid, side, games) {
    var g = games.filter(function (x) { return String(x.id) === gid; })[0]; if (!g) return;
    var f = Object.assign({}, st.forced);
    if (f[g.id] === side) delete f[g.id]; else f[g.id] = side;
    st.forced = f; render();
  }

  function needsShort(res, eng, i, nd, byId) {
    var s = res.status[i];
    if (s === 'Out') return 'Out of reach';
    if (s === 'Clinched') return 'Locked up';
    if (!nd) return '';
    var ab = function (gid, side) { return teamOf(byId[gid], side); };
    var mustTxt = nd.must.map(function (x) { return ab(x.gid, x.side); }).join(', ');
    if (nd.exact) {
      var some = nd.kmin ? nd.kmin + ' of ' + nd.rel.map(function (gid) { return ab(gid, st.players[i].picks[gid]); }).join('/') : '';
      if (mustTxt && some) return mustTxt + ' + ' + some;
      if (mustTxt) return mustTxt;
      if (some) return some;
      return 'Can’t drop out of first';
    }
    return (mustTxt ? mustTxt + ' + help · ' : '') + 'works in ' + nd.paths + ' of ' + res.N + ' endings';
  }
  function bars(win, color, n, big) {
    var f = win > 0 ? Math.max(1, Math.round(win * n)) : 0, out = '';
    for (var k = 0; k < n; k++) out += '<i' + (k < f ? ' class="on" style="--c:' + color + '"' : '') + '></i>';
    return '<span class="' + (big ? 'bigbars' : 'bars') + '" aria-hidden="true">' + out + '</span>';
  }

  function renderCols(games, eng, res, mkt, byId) {
    var el = qs('#cols');
    if (!st.engineOn) { el.innerHTML = ''; return; }
    var P = st.players, N = P.length;
    var actual = P.map(function (p) { var a = 0; games.forEach(function (g) { if (g.status === 'final' && p.picks[g.id] === winnerOf(g)) a++; }); return a; });
    var mktPts = 0; games.forEach(function (g) { if (g.status === 'final' && mkt[g.id] === winnerOf(g)) mktPts++; });
    var nonFinal = games.filter(function (g) { return g.status !== 'final'; });
    var nds = P.map(function (_, i) { return res.status[i] === 'Out' ? null : eng.needs(res, i); });
    var order = P.map(function (p, i) { return i; }).sort(function (a, b) { return actual[b] - actual[a] || res.win[b] - res.win[a] || P[a].name.localeCompare(P[b].name); });
    if (!st.sel || !P.some(function (p) { return p.name === st.sel; })) st.sel = st.you && P.some(function (p) { return p.name === st.you; }) ? st.you : P[order[0]].name;

    var rows = order.map(function (i) {
      var p = P[i], s = res.status[i], sc = SC[s];
      var ahead = actual.filter(function (v) { return v > actual[i]; }).length, same = actual.filter(function (v) { return v === actual[i]; }).length;
      var diff = actual[i] - mktPts, isSel = p.name === st.sel, isYou = p.name === st.you;
      return '<div class="trow' + (isSel ? ' sel' : '') + '">' +
        '<span class="rank">' + (same > 1 ? 'T' : '') + (ahead + 1) + '</span>' +
        '<span class="pname"><button type="button" data-sel="' + esc(p.name) + '" class="' + (isSel ? 'sel' : s === 'Out' ? 'out' : '') + '" aria-pressed="' + isSel + '">' + esc(p.name) + '</button>' + (isYou ? '<span class="you">YOU</span>' : '') + '</span>' +
        '<span class="pts">' + actual[i] + '</span><span class="mx">' + res.max[i] + '</span>' +
        '<span><span class="spill ' + sc[0] + '">' + s + '</span></span>' +
        '<span class="winc">' + bars(s === 'Out' ? 0 : res.win[i], sc[1], 20) + '<span class="wint" style="color:' + (s === 'Out' ? 'rgba(240,238,232,0.62)' : '#F0EEE8') + '" title="' + esc(U.pct1(res.win[i])) + '">' + (s === 'Out' ? '0%' : pct(res.win[i])) + '</span></span>' +
        '<span class="vs" title="Points vs The Market (every favorite)">' + (diff > 0 ? '+' + diff : diff < 0 ? '−' + Math.abs(diff) : 'even') + '</span>' +
        '<span class="needs' + (s === 'Out' ? ' out' : '') + '">' + esc(needsShort(res, eng, i, nds[i], byId)) + '</span></div>';
    }).join('');
    var mrows = order.map(function (i) {
      var p = P[i], s = res.status[i], sc = SC[s], isSel = p.name === st.sel;
      var ahead = actual.filter(function (v) { return v > actual[i]; }).length, same = actual.filter(function (v) { return v === actual[i]; }).length;
      return '<button type="button" class="mrow' + (isSel ? ' sel' : '') + '" data-sel="' + esc(p.name) + '" aria-pressed="' + isSel + '"><span class="rank">' + (same > 1 ? 'T' : '') + (ahead + 1) + '</span><span class="nm"' + (isSel ? ' style="color:var(--cyan)"' : '') + '>' + esc(p.name) + '</span><span class="pt">' + actual[i] + '</span><span><span class="spill ' + sc[0] + '">' + s + '</span></span><span class="wn">' + (s === 'Out' ? '0%' : pct(res.win[i])) + '</span></button>';
    }).join('');
    var mktRow = '<div class="trow mkt"><span class="rank">·</span><span class="name"><b>The Market</b><small>Picks every favorite</small></span><span class="pts" style="color:var(--yellow)">' + mktPts + '</span><span class="mx">' + (mktPts + nonFinal.length) + '</span><span><span class="spill bench">Benchmark</span></span><span style="font-size:13px;color:var(--dim)">Not eligible to win</span><span class="vs" style="color:var(--dim)">0</span><span class="needs" style="color:var(--muted)">Still on ' + esc(nonFinal.map(function (g) { return teamOf(g, mkt[g.id]); }).join(', ') || 'nothing') + '</span></div>';

    var standings = '<section class="card standings" aria-label="Standings"><div class="head"><h2>Standings</h2><span class="hint">Tap a name to see what they need</span></div>' +
      '<div class="tscroll"><div class="tmin"><div class="trow th"><span>Rank</span><span>Player</span><span>Pts</span><span>Max</span><span>Status</span><span>Win week</span><span title="Points vs The Market">vs Mkt</span><span>Needs</span></div>' + rows + mktRow + '</div></div>' +
      '<div class="mlist">' + mrows + '</div></section>';

    el.innerHTML = standings + '<aside class="aside">' + renderPanel(games, eng, res, nds, actual, byId) + renderFeed(games, eng, byId) + '</aside>';
    el.querySelectorAll('[data-sel]').forEach(function (b) { b.onclick = function () { st.sel = this.getAttribute('data-sel'); render(); }; });
  }

  function renderPanel(games, eng, res, nds, actual, byId) {
    var P = st.players, di = P.map(function (p) { return p.name; }).indexOf(st.sel), p = P[di], s = res.status[di], sc = SC[s], nd = nds[di];
    var isYou = p.name === st.you, anyForced = Object.keys(st.forced).length > 0;
    var chip = function (gid, side, must) { var g = byId[gid], abbr = teamOf(g, side), opp = side === 'H' ? g.away : g.home; return '<span class="chip' + (must ? ' must' : '') + '">' + sw(abbr) + '<span class="ab">' + esc(abbr) + '</span><span class="opp">over ' + esc(opp) + '</span></span>'; };
    var body = '';
    if (s === 'Clinched') body = '<div class="clinch">Locked up. Every ending is an outright win.</div>';
    else if (s === 'Out') {
      var feed = eng.eliminationFeed(U.finalOrder(games)), by = null;
      feed.forEach(function (f) { if (f.eliminated.indexOf(p.name) >= 0) by = byId[f.gid]; });
      body = '<div class="outbox"><div class="t">Out for the week</div><div class="x">' + (by && !anyForced ? 'Eliminated by ' + esc(teamOf(by, winnerOf(by)) + ' ' + Math.max(by.home_score, by.away_score) + ', ' + teamOf(by, winnerOf(by) === 'H' ? 'A' : 'H') + ' ' + Math.min(by.home_score, by.away_score)) + (by.finalAt ? ' at ' + esc(U.fmtTime(by.finalAt)) : '') + '. Max of ' + res.max[di] + ' can’t reach the top in any ending.' : 'No ending gets them to the top' + (anyForced ? ' with these what-ifs.' : '.')) + '</div></div>';
    } else if (nd) {
      var must = nd.must.map(function (x) { return chip(x.gid, x.side, true); }).join('');
      var some = nd.exact && nd.kmin ? nd.rel.map(function (gid) { return chip(gid, p.picks[gid], false); }).join('') : '';
      var path = !nd.exact ? nd.best.map(function (x) { return chip(x.gid, x.side, false); }).join('') : '';
      var tie = eng.likeliestTie(res, di, nd);
      var tbHead = 'No tiebreak needed', tbMain = 'Every ending that works is an outright win';
      if (tie) {
        var others = tie.with, who = others.length <= 2 ? others.map(esc).join(' & ') : esc(others[0]) + ' + ' + (others.length - 1) + ' others';
        var r = tie.range, rng = r[0] === null ? null : r[0] === 0 && r[1] === 120 ? 'any total' : r[0] === 0 ? r[1] + ' or fewer' : r[1] === 120 ? r[0] + ' or more' : r[0] + ' to ' + r[1];
        tbHead = (s === 'Tiebreak only' ? 'Can only win on the tiebreaker. ' : '') + 'Most likely tie: with ' + who;
        tbMain = rng ? 'Needs ' + esc(st.data.tiebreak.label) + ' total of ' + rng : 'Loses that tiebreak';
      }
      var tbSub = (isYou ? 'Your' : esc(p.name) + '’s') + ' guess: ' + (p.tb == null ? 'none' : p.tb) + ' · market total ' + st.data.tiebreak.total + (st.data.tiebreak.total_source === 'store' ? ' (median of ' + st.data.tiebreak.total_books + ' books)' : st.data.tiebreak.total_source ? ' (' + esc(st.data.tiebreak.total_source) + ')' : '');
      var root = eng.rootFor(res, di).slice().sort(function (a, b) { return b.swing - a.swing; }).map(function (r) {
        var g = byId[r.gid], matters = r.swing >= 0.005, abbr = teamOf(g, r.side), opp = r.side === 'H' ? g.away : g.home;
        if (!matters) return '<div class="root na"><span class="ab"><span class="sw" style="background:#333" aria-hidden="true"></span>·</span><span class="mid"><span class="note">' + esc(g.away) + ' @ ' + esc(g.home) + ' doesn’t matter</span><span class="bar"></span></span><span class="v"></span></div>';
        return '<div class="root"><span class="ab">' + sw(abbr) + esc(abbr) + '</span><span class="mid"><span class="note">over ' + esc(opp) + (g.status === 'live' ? ', live' : ', ' + esc(g.slot)) + '</span><span class="bar" aria-hidden="true"><b style="width:' + Math.round(r.cond * 100) + '%"></b></span></span><span class="v" title="' + esc(U.pct1(r.cond)) + '">' + pct(r.cond) + '</span></div>';
      }).join('');
      body = (must ? '<div class="block"><div class="t">Needs all of these</div><div class="chips">' + must + '</div></div>' : '') +
        (some ? '<div class="block"><div class="t">Plus ' + nd.kmin + ' of these</div><div class="chips">' + some + '</div></div>' : '') +
        (path ? '<div class="block"><div class="t">Most likely way through</div><div class="chips">' + path + '</div></div>' : '') +
        (!must && !some && !path ? '<div style="font-size:14px">Stays tied for first or better in every ending.</div>' : '') +
        '<div class="ptxt">Wins or ties for first in ' + nd.paths + ' of ' + res.N + ' possible endings' + (anyForced ? ', with your what-ifs.' : '.') + '</div>' +
        '<div class="tbbox"><div class="l">Tiebreak</div><div class="h">' + tbHead + '</div><div class="m">' + tbMain + '</div><div class="s">' + tbSub + '</div></div>' +
        '<div class="block"><div class="rootl">Root for</div>' + root + '<div class="legend">Number = win-the-week chance if that team wins.</div></div>';
    }
    return '<section class="card panel" aria-label="Player detail"><div class="ph"><div><div class="lbl">' + (isYou ? 'Your week' : 'Viewing') + '</div><div class="nm">' + esc(p.name) + '</div></div><span class="spill ' + sc[0] + '">' + s + '</span></div>' +
      '<div class="stats3"><div class="stat"><div class="l">Points</div><div class="v">' + actual[di] + '</div></div><div class="stat"><div class="l">Max possible</div><div class="v">' + res.max[di] + '</div></div><div class="stat"><div class="l">Win the week</div><div class="v" style="color:' + sc[1] + '" title="' + esc(U.pct1(res.win[di])) + '">' + (s === 'Out' ? '0%' : pct(res.win[di])) + '</div></div></div>' +
      bars(s === 'Out' ? 0 : res.win[di], sc[1], 20, true) + body + '</section>';
  }

  function renderFeed(games, eng, byId) {
    var order = U.finalOrder(games), P = st.players;
    var feed = eng.eliminationFeed(order);
    var items = [{ time: U.fmtTime(st.data.pool.deadline_utc), text: 'Picks locked', sub: P.length + ' sheets in. Everyone can see the picks now.', hot: false }];
    feed.forEach(function (f) {
      var g = byId[f.gid], w = winnerOf(g);
      var label = w === 'T' ? g.away + ' ' + g.away_score + ', ' + g.home + ' ' + g.home_score + ' tie' : (w === 'H' ? g.home + ' ' + g.home_score + ', ' + g.away + ' ' + g.away_score : g.away + ' ' + g.away_score + ', ' + g.home + ' ' + g.home_score) + ' final';
      var hit = P.filter(function (p) { return p.picks[g.id] === w; }).length;
      items.push({ time: g.finalAt ? U.fmtTime(g.finalAt) : 'Final', text: label, sub: (f.eliminated.length ? 'Out: ' + f.eliminated.join(', ') : 'Nobody eliminated') + ' · ' + hit + ' of ' + P.length + ' had it', hot: f.eliminated.length > 0 });
    });
    items.reverse();
    return '<section class="card feed" aria-label="What just happened"><h2>What just happened</h2>' + items.map(function (f) { return '<div class="fi"><span class="tm">' + esc(f.time) + '</span><span><div class="tx">' + esc(f.text) + '</div><div class="sb' + (f.hot ? ' hot' : '') + '">' + esc(f.sub) + '</div></span></div>'; }).join('') + '</section>';
  }

  function renderImport(games) {
    var el = qs('#import');
    if (st.demo) { el.innerHTML = '<div class="ihead"><h2>Mock data</h2><span class="srcnote">This is the design fixture with anonymized handles. Real weeks load picks from a CSV you import; nothing is uploaded.</span></div>'; return; }
    if (el.getAttribute('data-key') === st.key) return;
    el.setAttribute('data-key', st.key);
    U.importPanel(el, { games: games, key: st.key, season: st.data.season, week: st.data.week, open: st.players.length === 0 }, function () { loadPicks(); st.forced = {}; st.sel = null; render(); });
  }

  function renderFooter(games, res) {
    var d = st.data;
    var src = {}; games.forEach(function (g) { src[g.p_source] = (src[g.p_source] || 0) + 1; });
    var srcTxt = Object.keys(src).map(function (k) { return src[k] + ' ' + (k === 'store' ? 'from the odds store (median of all books)' : k === 'nflverse' ? 'from nflverse (store had no snapshot)' : k); }).join(', ');
    var gaps = games.filter(function (g) { return g.frozen && g.gap_minutes != null; }).map(function (g) { return g.gap_minutes; });
    qs('#foot').innerHTML = '<span><b>Math, not picks. Win % from betting markets, frozen at kickoff.</b></span>' +
      '<span>Win % weighs every possible ending by de-vigged market odds (pregame odds for games in progress). Statuses come from checking all ' + (res ? res.N : '2^n') + ' endings, no sampling.</span>' +
      '<span>Tiebreak: closest guess to the ' + esc(d.tiebreak.label) + ' total, equal distance splits evenly. Modeled as a normal around the market total of ' + (d.tiebreak.total == null ? 'n/a' : d.tiebreak.total) + ' with SD ' + d.tiebreak.sd + ' (fitted on 2021 to 2025 closing totals). A tied game scores nobody. A blank pick counts wrong.</span>' +
      '<span>Sources: win % for ' + games.length + ' games: ' + esc(srcTxt) + '. ' + (gaps.length ? 'Freeze snapshots landed a median of ' + Math.round(gaps.slice().sort(function (a, b) { return a - b; })[Math.floor(gaps.length / 2)]) + ' min before kickoff. ' : '') + 'Scores: ESPN scoreboard, polled every 60 seconds while games are live. Data built ' + esc(U.fmtDayTime(d.generated_at)) + '. Times shown in ' + esc(U.TZ || 'your local zone') + '.</span>';
  }

  init();
}());
