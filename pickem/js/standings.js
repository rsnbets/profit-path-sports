/* PPS Pick'em: standings. Week grid (right, wrong, leading now, not started) and the season view. */
(function () {
  'use strict';
  var U = window.PickemUI, S = window.PickemStore, ESPN = window.PickemESPN, P = window.PickemParser;
  var esc = U.esc, qs = U.qs;
  var st = { data: null, key: '', demo: false, scores: {}, finals: {}, players: [], you: '', view: 'week', sort: 'week', season: null, weeks: {}, lastFetch: null };

  function init() {
    st.demo = U.param('demo') === '1';
    st.view = U.param('view') === 'season' ? 'season' : 'week';
    var load = st.demo ? U.loadDemo().then(function (d) { st.data = d.data; st.scores = d.scores; st.finals = d.finals; st.players = d.players; })
      : U.loadWeek().then(function (d) { st.data = d; });
    load.then(function () {
      st.key = S.weekKey(st.data.season, st.data.week) + (st.demo ? '-demo' : '');
      if (!st.demo) { st.finals = S.get('finals:' + st.key, {}); var m = S.get('picks:' + st.key, null); st.players = m && m.players ? m.players : []; }
      st.you = S.get('you', '') || '';
      st.season = S.get('season:' + st.data.season, null);
      st.weeks = S.get('weeks:' + st.data.season, {});
      if (st.demo) demoSeason();
      renderShell(); render();
      if (!st.demo) poll();
    }).catch(function (e) { document.getElementById('app').innerHTML = '<main class="pk-main"><div class="notice err"><h2>Could not load this week</h2><div>' + esc(e.message) + '</div></div></main>'; });
  }
  function demoSeason() {
    // Mock prior weeks so the season view has something to show.
    var wk = [[9, 8, 14, 10, 11, 10], [8, 10, 8, 9, 9, 9], [12, 11, 10, 5, 10, 10], [11, 9, 10, 8, 8, 11], [11, 10, 13, 7, 7, 8], [13, 7, 9, 9, 10, 13], [9, 10, 10, 14, 9, 11], [12, 13, 11, 8, 7, 10], [9, 8, 7, 10, 9, 6], [11, 9, 11, 10, 9, 10], [13, 10, 7, 8, 7, 10], [11, 11, 11, 11, 10, 8], [12, 14, 9, 8, 9, 7], [5, 7, 10, 11, 6, 6], [10, 9, 8, 9, 6, 6]];
    var season = {}; st.players.forEach(function (p, i) { season[p.name] = wk[i] || [0, 0, 0, 0, 0, 0]; });
    st.season = { weeks: [1, 2, 3, 4, 5, 6], season: season, market: [10, 13, 11, 10, 10, 5] };
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
    document.getElementById('app').innerHTML = U.header(st.view === 'season' ? 'season' : 'standings', '<span id="youSlot"></span>') +
      '<main class="pk-main"><section class="pk-title" id="title"></section><section class="cards4" id="cards"></section><div id="body"></div><section class="card import" id="import"></section><footer class="pk-footer" id="foot"></footer></main>';
  }
  function winnerOf(g) { return g.home_score > g.away_score ? 'H' : g.away_score > g.home_score ? 'A' : 'T'; }
  function teamOf(g, side) { return side === 'H' ? g.home : side === 'A' ? g.away : ''; }
  function rankOf(vals, i) { var ahead = vals.filter(function (v) { return v > vals[i]; }).length, same = vals.filter(function (v) { return v === vals[i]; }).length; return (same > 1 ? 'T' : '') + (ahead + 1); }
  function ord(r) { var n = parseInt(r.replace('T', ''), 10); var s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th'; return (r.indexOf('T') === 0 ? 'T-' : '') + n + s; }

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

    // Season history: season.csv weeks + auto-saved completed weeks (never the current one).
    var hist = {}, weeksList = [], mktHist = {};
    if (st.season) { weeksList = st.season.weeks.slice(); Object.keys(st.season.season).forEach(function (n) { hist[n] = {}; st.season.season[n].forEach(function (v, k) { hist[n][weeksList[k]] = v; }); }); if (st.season.market) st.season.market.forEach(function (v, k) { mktHist[weeksList[k]] = v; }); }
    Object.keys(st.weeks).forEach(function (w) { w = Number(w); if (w === data.week) return; if (weeksList.indexOf(w) < 0) weeksList.push(w); var wk = st.weeks[w]; Object.keys(wk.points).forEach(function (n) { hist[n] = hist[n] || {}; hist[n][w] = wk.points[n]; }); if (wk.market != null) mktHist[w] = wk.market; });
    weeksList = weeksList.filter(function (w) { return w < data.week; }).sort(function (a, b) { return a - b; });
    // Save this week once it is complete.
    if (locked && N && finals.length === games.length && !st.demo && !st.weeks[data.week]) {
      var pts = {}; Pl.forEach(function (p, i) { pts[p.name] = wkPts[i]; });
      var top = Math.max.apply(null, wkPts);
      st.weeks[data.week] = { points: pts, market: mktWk, winners: Pl.filter(function (p, i) { return wkPts[i] === top; }).map(function (p) { return p.name; }), saved_at: new Date().toISOString() };
      S.set('weeks:' + data.season, st.weeks);
    }
    var usePrior = st.season && st.season.prior && st.season.priorAsOf === data.week;
    // Accounts that sat this week out still belong in the season table (blank picks, zero this week).
    if (usePrior && st.view === 'season' && st.season.satOut && st.season.satOut.length) {
      var have = {}; Pl.forEach(function (p) { have[p.name] = true; });
      Pl = Pl.concat(st.season.satOut.filter(function (n) { return !have[n]; }).map(function (n) { return { name: n, tb: null, picks: {}, satOut: true }; }));
      N = Pl.length; wkPts = Pl.map(function (p) { return finals.filter(function (g) { return p.picks[g.id] === winnerOf(g); }).length; });
    }
    var prior = Pl.map(function (p) { if (usePrior && st.season.prior[p.name] != null) return st.season.prior[p.name]; var h = hist[p.name] || {}; return weeksList.reduce(function (a, w) { return a + (h[w] || 0); }, 0); });
    var total = Pl.map(function (p, i) { return prior[i] + wkPts[i]; });
    var mktPrior = weeksList.reduce(function (a, w) { return a + (mktHist[w] || 0); }, 0), mktTotal = mktPrior + mktWk;
    var winners = {}; weeksList.forEach(function (w) { var best = -1, who = []; Pl.forEach(function (p) { var v = (hist[p.name] || {})[w]; if (v == null) return; if (v > best) { best = v; who = [p.name]; } else if (v === best) who.push(p.name); }); winners[w] = who; });
    var wins = Pl.map(function (p) { return weeksList.filter(function (w) { return winners[w].indexOf(p.name) >= 0; }).length; });

    qs('#title').innerHTML = '<div style="display:flex;flex-direction:column;gap:6px"><div class="eyebrow cyan">' + data.season + ' season · Week ' + data.week + (finals.length === games.length ? ' final' : ' in progress') + '</div><h1>Standings</h1>' +
      '<p>' + esc(data.pool.name || 'Pool') + (N ? ' · ' + N + ' players' : '') + ' · ' + finals.length + ' of ' + games.length + ' Week ' + data.week + ' games final' + (st.lastFetch ? ' · scores ' + esc(U.fmtTime(st.lastFetch)) : '') + '</p></div>' +
      '<div class="pk-pills"><div class="toggle" role="group" aria-label="View"><button type="button" id="vWeek" class="' + (st.view === 'week' ? 'on' : '') + '" aria-pressed="' + (st.view === 'week') + '">Week ' + data.week + ' picks</button><button type="button" id="vSeason" class="' + (st.view === 'season' ? 'on' : '') + '" aria-pressed="' + (st.view === 'season') + '">Season</button></div>' + (st.demo ? '<span class="badge">MOCK DATA</span>' : '') + '</div>';
    qs('#vWeek').onclick = function () { st.view = 'week'; render(); }; qs('#vSeason').onclick = function () { st.view = 'season'; render(); };

    if (!N) { qs('#cards').innerHTML = ''; qs('#body').innerHTML = '<div class="notice warn"><h2>No picks loaded</h2><div>Import the pool’s picks on the Live page once they are public.</div></div>'; renderImport(games); renderFoot(); return; }
    if (!locked) { qs('#cards').innerHTML = ''; qs('#body').innerHTML = '<div class="notice"><h2>Picks show once every game’s picks are in</h2><div>Picks lock ' + esc(U.fmtDayTime(data.pool.deadline_utc)) + '.</div></div>'; renderImport(games); renderFoot(); return; }

    // Cards
    var leaderTotal = Math.max.apply(null, total), leaders = Pl.filter(function (p, i) { return total[i] === leaderTotal; }).map(function (p) { return p.name; });
    var maxWins = Math.max.apply(null, wins), winLeaders = Pl.filter(function (p, i) { return wins[i] === maxWins; }).map(function (p) { return p.name; });
    var youI = Pl.map(function (p) { return p.name; }).indexOf(st.you), beat = total.filter(function (t) { return t > mktTotal; }).length;
    qs('#cards').innerHTML =
      '<div class="card c4"><span class="l">Season leader</span><span class="v">' + leaders.map(esc).join(' & ') + '</span><span class="s">' + leaderTotal + ' correct picks</span></div>' +
      '<div class="card c4 wins"><span class="l">Most weeks won</span><span class="v">' + (maxWins ? winLeaders.map(esc).join(' & ') : 'No weeks done yet') + '</span><span class="s">' + (maxWins ? maxWins + ' weekly win' + (maxWins > 1 ? 's each' : '') : '') + '</span></div>' +
      (youI >= 0 ? '<div class="card c4 you"><span class="l">You</span><span class="v">' + ord(rankOf(total, youI)) + ' place</span><span class="s">' + (leaderTotal - total[youI]) + ' back of the lead · ' + (total[youI] - mktTotal >= 0 ? '+' : '−') + Math.abs(total[youI] - mktTotal) + ' vs the Market</span></div>' : '<div class="card c4"><span class="l">You</span><span class="v">Pick your name</span><span class="s">Use the You menu at the top.</span></div>') +
      '<div class="card c4 mkt"><span class="l">The Market (every favorite)</span><span class="v">' + mktTotal + ' pts</span><span class="s">' + beat + ' of ' + N + ' players are beating it</span></div>';

    qs('#body').innerHTML = st.view === 'week' ? weekGrid(games, Pl, wkPts, total, mkt, mktWk, mktTotal, youI) : seasonGrid(Pl, hist, weeksList, winners, wins, wkPts, prior, total, mktHist, mktWk, mktTotal, youI, usePrior);
    var sw = qs('#sortWeek'), stt = qs('#sortTotal'); if (sw) sw.onclick = function () { st.sort = 'week'; render(); }; if (stt) stt.onclick = function () { st.sort = 'total'; render(); };
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
  function weekGrid(games, Pl, wkPts, total, mkt, mktWk, mktTotal, youI) {
    var G = games.length, cols = '230px repeat(' + G + ', minmax(62px, 1fr)) 64px 64px 56px';
    var row = function (cls) { return '<div class="wgrid ' + cls + '" style="grid-template-columns:' + cols + '">'; };
    var heads = games.map(function (g) {
      var fin = g.status === 'final', pre = g.status === 'pre', w = fin ? winnerOf(g) : null;
      return '<span class="gh"><span class="s ' + (fin ? 'fin' : g.status === 'live' ? 'live' : 'pre') + '">' + esc(fin ? (g.clock || 'FINAL') : g.status === 'live' ? g.clock : g.slot) + '</span><span class="tl' + (fin && w === 'H' ? ' lost' : '') + '"><span>' + esc(g.away) + '</span><span>' + (pre ? '' : g.away_score) + '</span></span><span class="tl' + (fin && w === 'A' ? ' lost' : '') + '"><span>' + esc(g.home) + '</span><span>' + (pre ? '' : g.home_score) + '</span></span></span>';
    }).join('');
    var counts = games.map(function (g) { return { H: Pl.filter(function (p) { return p.picks[g.id] === 'H'; }).length, A: Pl.filter(function (p) { return p.picks[g.id] === 'A'; }).length }; });
    var cons = games.map(function (g, k) { var side = counts[k].H >= counts[k].A ? 'H' : 'A'; return '<span class="cc"><b>' + esc(teamOf(g, side)) + '</b><small>' + Math.round(100 * counts[k][side] / Pl.length) + '%</small></span>'; }).join('');
    var key = st.sort === 'week' ? wkPts : total, alt = st.sort === 'week' ? total : wkPts;
    var order = Pl.map(function (p, i) { return i; }).sort(function (a, b) { return key[b] - key[a] || alt[b] - alt[a] || Pl[a].name.localeCompare(Pl[b].name); });
    var topWeek = Math.max.apply(null, wkPts);
    var rows = order.map(function (i) {
      var p = Pl[i];
      return row(i === youI ? 'you' : '') + '<span class="sticky"><span class="rk">' + rankOf(key, i) + '</span><span class="nm"' + (i === youI ? ' style="color:var(--cyan)"' : '') + '>' + esc(p.name) + '</span>' + (i === youI ? '<span class="you">YOU</span>' : '') + '</span>' +
        games.map(function (g, k) { return cell(g, p.picks[g.id], counts[k][p.picks[g.id]] || 0); }).join('') +
        '<span class="ctr wk' + (wkPts[i] === topWeek ? ' top' : '') + '">' + wkPts[i] + '</span><span class="ctr tot">' + total[i] + '</span><span class="ctr mono" style="font-size:13px;color:rgba(240,238,232,0.7)">' + (p.tb == null ? '·' : p.tb) + '</span></div>';
    }).join('');
    var mrow = row('mkt') + '<span class="sticky"><span class="rk">·</span><span style="display:flex;flex-direction:column;line-height:1.25"><span style="font-size:15px;font-weight:700;color:var(--yellow)">The Market</span><span style="font-size:11px;color:var(--dim)">Every favorite · not eligible</span></span></span>' +
      games.map(function (g) { return cell(g, mkt[g.id], 99); }).join('') + '<span class="ctr wk" style="color:var(--yellow)">' + mktWk + '</span><span class="ctr tot">' + mktTotal + '</span><span class="ctr mono" style="font-size:13px;color:var(--dim)">' + (st.data.tiebreak.total == null ? '' : st.data.tiebreak.total) + '</span></div>';
    return '<section class="card" aria-label="Week picks" style="overflow:hidden"><div class="standings head" style="padding:14px 18px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid var(--border-soft)"><h2 style="font-family:var(--head);font-size:20px;margin:0">Week ' + st.data.week + ' picks</h2>' +
      '<div class="keys"><span><i class="right"></i>Right</span><span><i class="wrong"></i>Wrong</span><span><i class="lead"></i>Leading now</span><span><i class="pre"></i>Not started</span><span><i class="rare"></i>2 or fewer took it</span></div></div>' +
      '<div class="tscroll"><div style="min-width:' + (300 + 68 * G + 200) + 'px;padding-bottom:6px">' +
      row('th') + '<span class="sticky th">Player</span>' + heads + '<button type="button" class="sortb' + (st.sort === 'week' ? ' on' : '') + '" id="sortWeek" aria-pressed="' + (st.sort === 'week') + '">Week' + (st.sort === 'week' ? ' ▾' : '') + '</button><button type="button" class="sortb' + (st.sort === 'total' ? ' on' : '') + '" id="sortTotal" aria-pressed="' + (st.sort === 'total') + '">Total' + (st.sort === 'total' ? ' ▾' : '') + '</button><span class="thl" style="padding-bottom:12px" title="Tiebreak guess: ' + esc(st.data.tiebreak.label) + ' total">' + esc(st.data.tiebreak.label.split('@')[1] === undefined ? 'TB' : 'TB') + '</span></div>' +
      row('cons') + '<span class="sticky" style="font-size:13px;font-weight:700;color:rgba(240,238,232,0.75)">Pool consensus</span>' + cons + '<span></span><span></span><span></span></div>' +
      rows + mrow + '</div></div></section>';
  }
  function seasonGrid(Pl, hist, weeksList, winners, wins, wkPts, prior, total, mktHist, mktWk, mktTotal, youI, usePrior) {
    var W = weeksList.length + 1, cols = '230px 70px 70px repeat(' + W + ', minmax(46px, 1fr)) 64px 90px 72px 64px';
    var row = function (cls) { return '<div class="wgrid ' + cls + '" style="grid-template-columns:' + cols + '">'; };
    var leaderTotal = Math.max.apply(null, total);
    var sOrder = Pl.map(function (p, i) { return i; }).sort(function (a, b) { return total[b] - total[a] || wins[b] - wins[a] || Pl[a].name.localeCompare(Pl[b].name); });
    var rows = sOrder.map(function (i) {
      var p = Pl[i], h = hist[p.name] || {};
      var nowR = parseInt(rankOf(total, i).replace('T', ''), 10), thenR = parseInt(rankOf(prior, i).replace('T', ''), 10), mv = weeksList.length ? thenR - nowR : 0;
      var bestV = -1, bestW = null; weeksList.forEach(function (w) { if (h[w] != null && h[w] > bestV) { bestV = h[w]; bestW = w; } });
      if (wkPts[i] > bestV) { bestV = wkPts[i]; bestW = st.data.week; }
      var diff = total[i] - mktTotal;
      var cells = weeksList.map(function (w) { var v = h[w]; if (v == null) return '<span class="scell none">·</span>'; var won = winners[w].indexOf(p.name) >= 0; return '<span class="scell' + (won ? ' won' : '') + '">' + v + '</span>'; }).join('') + '<span class="scell cur">' + wkPts[i] + '</span>';
      return row(i === youI ? 'you' : '') + '<span class="sticky"><span class="rk">' + rankOf(total, i) + '</span><span class="nm"' + (i === youI ? ' style="color:var(--cyan)"' : '') + '>' + esc(p.name) + '</span>' + (i === youI ? '<span class="you">YOU</span>' : '') + '</span>' +
        '<span class="ctr num" style="font-size:20px">' + total[i] + '</span><span class="ctr mono" style="font-size:13px;color:rgba(240,238,232,0.7)">' + (total[i] === leaderTotal ? '·' : leaderTotal - total[i]) + '</span>' + cells +
        '<span class="ctr num" style="font-size:16px;color:' + (wins[i] ? 'var(--yellow)' : 'rgba(240,238,232,0.5)') + '">' + wins[i] + '</span><span class="ctr mono" style="font-size:13px">' + (bestW ? bestV + ' (W' + bestW + ')' : '·') + '</span>' +
        '<span class="ctr mono ' + (diff > 0 ? 'pos' : diff < 0 ? 'neg' : 'zero') + '" style="font-size:13px">' + (diff > 0 ? '+' + diff : diff < 0 ? '−' + Math.abs(diff) : 'even') + '</span>' +
        '<span class="ctr mono ' + (mv > 0 ? 'pos' : mv < 0 ? 'neg' : 'zero') + '" style="font-size:13px;font-weight:500">' + (mv > 0 ? '▲ ' + mv : mv < 0 ? '▼ ' + Math.abs(mv) : '–') + '</span></div>';
    }).join('');
    var mBest = -1, mBestW = null; weeksList.forEach(function (w) { if (mktHist[w] != null && mktHist[w] > mBest) { mBest = mktHist[w]; mBestW = w; } });
    var mrow = row('mkt') + '<span class="sticky"><span class="rk">·</span><span style="font-size:15px;font-weight:700;color:var(--yellow)">The Market</span></span><span class="ctr num" style="font-size:20px;color:var(--yellow)">' + mktTotal + '</span><span class="ctr mono" style="font-size:13px;color:var(--dim)">' + (leaderTotal - mktTotal) + '</span>' +
      weeksList.map(function (w) { return '<span class="scell" style="color:rgba(240,238,232,0.75)">' + (mktHist[w] == null ? '·' : mktHist[w]) + '</span>'; }).join('') + '<span class="scell cur">' + mktWk + '</span>' +
      '<span class="ctr" style="font-size:12px;color:var(--dim)">n/a</span><span class="ctr mono" style="font-size:13px;color:var(--dim)">' + (mBestW ? mBest + ' (W' + mBestW + ')' : '·') + '</span><span class="ctr mono" style="font-size:13px;color:var(--dim)">0</span><span></span></div>';
    return '<section class="card" aria-label="Season standings" style="overflow:hidden"><div style="padding:14px 18px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid var(--border-soft)"><h2 style="font-family:var(--head);font-size:20px;margin:0">Season</h2>' +
      '<div class="keys"><span><i class="won"></i>Won the week</span><span><i class="cur"></i>Week ' + st.data.week + ' so far</span><span>Move = rank change since Week ' + (weeksList.length ? weeksList[weeksList.length - 1] : 0) + '</span></div></div>' +
      (weeksList.length ? '' : '<div class="notice" style="margin:12px 18px"><div>' + (usePrior ? 'Season totals before Week ' + st.data.week + ' come from the PoolHost import (Total minus Week). Per-week columns need a season.csv (player,W1,W2,...).' : 'No earlier weeks yet. Import a season.csv (player,W1,W2,...) on the Live page, or finished weeks get saved here on their own.') + '</div></div>') +
      '<div class="tscroll"><div style="min-width:' + (520 + 52 * W + 300) + 'px;padding-bottom:6px">' +
      row('th') + '<span class="sticky th">Player</span><span class="thl">Total</span><span class="thl">Back</span>' + weeksList.map(function (w) { return '<span class="thl">W' + w + '</span>'; }).join('') + '<span class="thl" style="color:var(--cyan)">W' + st.data.week + '</span><span class="thl">Wins</span><span class="thl">Best</span><span class="thl">vs Mkt</span><span class="thl">Move</span></div>' +
      rows + mrow + '</div></div></section>';
  }
  function renderImport(games) {
    var el = qs('#import');
    if (st.demo) { el.innerHTML = '<div class="ihead"><h2>Mock data</h2><span class="srcnote">Design fixture with anonymized handles and made-up earlier weeks.</span></div>'; return; }
    if (el.getAttribute('data-key') === st.key) return;
    el.setAttribute('data-key', st.key);
    U.importPanel(el, { games: games, key: st.key, season: st.data.season, week: st.data.week }, function () { var m = S.get('picks:' + st.key, null); st.players = m && m.players ? m.players : []; st.season = S.get('season:' + st.data.season, null); st.weeks = S.get('weeks:' + st.data.season, {}); render(); });
  }
  function renderFoot() {
    qs('#foot').innerHTML = '<span><b>Math, not picks. Win % from betting markets, frozen at kickoff.</b></span><span>Weekly winner is most correct picks, closest ' + esc(st.data.tiebreak.label) + ' total breaks ties. Season is total correct picks. The Market row picks every de-vigged favorite as a benchmark and can’t win anything. A tied game scores nobody. A blank pick counts wrong.</span><span>Scores: ESPN scoreboard. Market favorites from the data build (' + esc(U.fmtDayTime(st.data.generated_at)) + '). Times shown in ' + esc(U.TZ || 'your local zone') + '.</span>';
  }
  init();
}());
