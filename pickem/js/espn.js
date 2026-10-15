/* PPS Pick'em: live scores from the ESPN NFL scoreboard (CORS open, confirmed Oct 15 2026).
 * Joins on the ESPN event id carried in the week data (nflverse games.csv "espn" column). */
(function (root) {
  'use strict';
  var BASE = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
  // ESPN -> nflverse codes where they differ.
  var ABBR = { WSH: 'WAS', LAR: 'LA' };
  function code(a) { return ABBR[a] || a; }

  function url(season, week) { return BASE + '?week=' + week + '&seasontype=2&dates=' + season + '&_=' + Date.now(); }

  // Returns { [espnId]: { status: 'pre'|'live'|'final', away, home, away_score, home_score, period, clock, detail, start } }
  function parse(json) {
    var out = {};
    (json.events || []).forEach(function (e) {
      var c = (e.competitions || [])[0]; if (!c) return;
      var st = e.status && e.status.type ? e.status.type : {};
      var state = st.state || 'pre';
      var status = state === 'post' ? (st.completed === false ? 'live' : 'final') : state === 'in' ? 'live' : 'pre';
      if (st.name === 'STATUS_POSTPONED' || st.name === 'STATUS_CANCELED') status = 'pre';
      var row = { status: status, name: st.name, detail: st.detail || '', period: e.status.period || 0, clock: e.status.displayClock || '', start: e.date };
      (c.competitors || []).forEach(function (t) {
        var k = t.homeAway === 'home' ? 'home' : 'away';
        row[k] = code(t.team && t.team.abbreviation);
        row[k + '_score'] = t.score === undefined || t.score === null || t.score === '' ? null : Number(t.score);
      });
      out[String(e.id)] = row;
    });
    return out;
  }

  function fetchWeek(season, week) {
    return fetch(url(season, week), { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('ESPN ' + r.status);
      return r.json();
    }).then(parse);
  }

  // Short status text for a card: "Q3 2:15", "HALF", "FINAL", "FINAL/OT".
  function clockText(s) {
    if (!s) return '';
    if (s.status === 'final') return s.period > 4 ? 'FINAL/OT' : 'FINAL';
    if (s.status === 'live') {
      if (s.name === 'STATUS_HALFTIME') return 'HALF';
      if (s.name === 'STATUS_END_PERIOD') return 'END Q' + s.period;
      if (s.name === 'STATUS_DELAYED') return 'DELAY';
      var q = s.period > 4 ? 'OT' : 'Q' + s.period;
      return q + (s.clock ? ' ' + s.clock : '');
    }
    return '';
  }

  root.PickemESPN = { fetchWeek: fetchWeek, parse: parse, clockText: clockText, code: code };
}(typeof self !== 'undefined' ? self : this));
