#!/usr/bin/env python3
"""PPS Pick'em data build.

Writes pickem/data/<season>-w<week>.json:
  games: nflverse id, ESPN id, teams, kickoff UTC, lock time, frozen p_home + source
  tiebreak: the tiebreak game and its market total
  generated_at
No picks ever go in this file.

Win % per game: power de-vig per book, median across books (the house method
from js/keynum-math.js), taken from the last odds-store snapshot before kickoff.
The store is the git history of lines.json in rsnbets/nfl-ev. If the store has
no snapshot for a game, the nflverse moneyline is used and tagged "nflverse".
Games that have not kicked off yet get the latest snapshot and frozen = false;
the next run after kickoff freezes them for good.

Lock rule: a game locks at the earlier of its own kickoff and the pool's weekly
deadline (pool.json, zoneinfo, never a hardcoded offset).
"""
import argparse, csv, datetime as dt, io, json, os, statistics, subprocess, sys, urllib.request
from zoneinfo import ZoneInfo

HERE = os.path.dirname(os.path.abspath(__file__))
GAMES_URL = 'https://github.com/nflverse/nfldata/raw/master/data/games.csv'
ET = ZoneInfo('America/New_York')
UTC = dt.timezone.utc
WEEKDAYS = {'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3, 'friday': 4, 'saturday': 5, 'sunday': 6}


def log(msg):
    print(msg, file=sys.stderr)


# ---------- odds math (house method) ----------
def american_to_prob(s):
    s = str(s).strip().replace('−', '-')
    if not s or s.lower() in ('none', 'null'):
        return None
    v = float(s)
    if v == 0:
        return None
    return 100.0 / (v + 100.0) if v > 0 else -v / (-v + 100.0)


def devig_power(p1, p2):
    """Power method: find k with p1^k + p2^k = 1. Returns (q1, q2)."""
    if not p1 or not p2:
        return None
    lo, hi = 0.0, 10.0
    for _ in range(60):
        k = (lo + hi) / 2
        if p1 ** k + p2 ** k > 1:
            lo = k
        else:
            hi = k
    k = (lo + hi) / 2
    return p1 ** k, p2 ** k


def p_home_from_ml(ml):
    """ml: {book: [home_odds, away_odds]} (the store's order). Median of per-book power de-vig."""
    fair = []
    for book, pair in (ml or {}).items():
        if book == 'unknown' or not isinstance(pair, (list, tuple)) or len(pair) != 2:
            continue
        ph, pa = american_to_prob(pair[0]), american_to_prob(pair[1])
        f = devig_power(ph, pa)
        if f:
            fair.append(f[0])
    if not fair:
        return None, 0
    return statistics.median(fair), len(fair)


def market_total(total_ladder, hint=None):
    """Per book, the line with the tightest over/under price is its main line. Median across books."""
    mains = {}
    for line, books in (total_ladder or {}).items():
        try:
            ln = float(line)
        except ValueError:
            continue
        for book, pair in books.items():
            if book == 'unknown' or not isinstance(pair, (list, tuple)) or len(pair) != 2:
                continue
            try:
                dv = abs(float(str(pair[0]).replace('−', '-')) - float(str(pair[1]).replace('−', '-')))
            except ValueError:
                continue
            tie_break = abs(ln - hint) if hint is not None else 0
            key = (dv, tie_break)
            if book not in mains or key < mains[book][0]:
                mains[book] = (key, ln)
    if not mains:
        return None, 0
    return statistics.median(v[1] for v in mains.values()), len(mains)


# ---------- nflverse ----------
def fetch_games_csv(path=None):
    if path and os.path.exists(path):
        with open(path, newline='') as f:
            return list(csv.DictReader(f))
    with urllib.request.urlopen(GAMES_URL, timeout=60) as r:
        return list(csv.DictReader(io.StringIO(r.read().decode('utf-8'))))


def kickoff_utc(row):
    """nflverse gameday + gametime are Eastern. Convert with zoneinfo."""
    d = dt.date.fromisoformat(row['gameday'])
    hh, mm = row['gametime'].split(':')
    return dt.datetime(d.year, d.month, d.day, int(hh), int(mm), tzinfo=ET).astimezone(UTC)


def week_rows(rows, season, week):
    out = [r for r in rows if r['season'] == str(season) and r['week'] == str(week) and r['game_type'] == 'REG']
    return sorted(out, key=lambda r: (kickoff_utc(r), r['game_id']))


def current_week(rows, season, now):
    """The regular-season week whose games surround now: last kickoff + 36 h is still 'this week'."""
    weeks = sorted({int(r['week']) for r in rows if r['season'] == str(season) and r['game_type'] == 'REG'})
    for w in weeks:
        ks = [kickoff_utc(r) for r in week_rows(rows, season, w)]
        if ks and now <= max(ks) + dt.timedelta(hours=36):
            return w
    return weeks[-1] if weeks else None


# ---------- lock rule ----------
def weekly_deadline_utc(kickoffs_utc, pool):
    """The pool's deadline for this week: first <weekday> on or after the earliest kickoff, in the pool's zone."""
    tz = ZoneInfo(pool['timezone'])
    if pool['deadline'].get('mode') == 'first_sunday_kickoff':
        # PoolHost behaviour (confirmed Oct 18 2026): every pick locks, and becomes visible, when the
        # first Sunday game kicks off. Thursday games lock at their own kickoff via lock_at().
        sundays = [k for k in kickoffs_utc if k.astimezone(tz).weekday() == 6]
        return min(sundays) if sundays else min(kickoffs_utc)
    wd = WEEKDAYS[pool['deadline']['weekday'].lower()]
    hh, mm = (int(x) for x in pool['deadline']['time'].split(':'))
    first = min(kickoffs_utc).astimezone(tz)
    d = first.date()
    while d.weekday() != wd:
        d += dt.timedelta(days=1)
    local = dt.datetime(d.year, d.month, d.day, hh, mm, tzinfo=tz)
    return local.astimezone(UTC)


def lock_at(kick_utc, deadline_utc):
    """A game locks at the earlier of its kickoff and the weekly deadline. Never after kickoff."""
    return min(kick_utc, deadline_utc)


# ---------- odds store (git history of lines.json) ----------
class Store:
    def __init__(self, repo_dir):
        self.dir = repo_dir
        self.ok = bool(repo_dir) and os.path.isdir(os.path.join(repo_dir, '.git'))
        self.commits = []
        self.cache = {}
        if self.ok:
            out = subprocess.run(['git', '-C', repo_dir, 'log', '--format=%H %cI', '--', 'lines.json'], capture_output=True, text=True).stdout
            for line in out.splitlines():
                sha, ts = line.split()
                self.commits.append((sha, dt.datetime.fromisoformat(ts).astimezone(UTC)))
            self.commits.sort(key=lambda x: x[1])
        if not self.commits:
            self.ok = False

    def snapshot(self, sha):
        if sha not in self.cache:
            raw = subprocess.run(['git', '-C', self.dir, 'show', f'{sha}:lines.json'], capture_output=True, text=True).stdout
            try:
                self.cache[sha] = json.loads(raw)
            except json.JSONDecodeError:
                self.cache[sha] = None
        return self.cache[sha]

    def last_before(self, when):
        """Latest commit strictly before `when`. Returns (sha, ts) or None."""
        best = None
        for sha, ts in self.commits:
            if ts < when:
                best = (sha, ts)
            else:
                break
        return best

    def find_game(self, snap, away, home):
        for g in (snap or {}).get('games', []):
            if g.get('away') == away and g.get('home') == home:
                return g
        return None

    def freeze(self, away, home, kick_utc, now, max_lookback_commits=12):
        """Walk back from the last pre-kickoff commit until the game appears. Returns dict or None."""
        anchor = kick_utc if kick_utc <= now else now + dt.timedelta(seconds=1)
        idx = None
        for i, (sha, ts) in enumerate(self.commits):
            if ts < anchor:
                idx = i
        if idx is None:
            return None
        for i in range(idx, max(-1, idx - max_lookback_commits), -1):
            sha, ts = self.commits[i]
            g = self.find_game(self.snapshot(sha), away, home)
            if g:
                return {'game': g, 'sha': sha, 'at': ts}
        return None


# ---------- build ----------
def build(season, week, pool, rows, store, now, sd):
    wk = week_rows(rows, season, week)
    if not wk:
        raise SystemExit(f'no games for {season} week {week}')
    kicks = {r['game_id']: kickoff_utc(r) for r in wk}
    deadline = weekly_deadline_utc(list(kicks.values()), pool)
    games = []
    gaps = []
    for r in wk:
        kick = kicks[r['game_id']]
        g = {
            'id': r['game_id'], 'espn': r['espn'] or None, 'away': r['away_team'], 'home': r['home_team'],
            'kickoff': kick.isoformat().replace('+00:00', 'Z'),
            'lock_at': lock_at(kick, deadline).isoformat().replace('+00:00', 'Z'),
            'weekday': r['weekday'], 'gametime_et': r['gametime'],
        }
        frozen = kick <= now
        snap = store.freeze(r['away_team'], r['home_team'], kick, now) if store.ok else None
        p = None
        if snap:
            p, n = p_home_from_ml(snap['game'].get('ml'))
            if p is not None and n >= 2:
                gap = (kick - snap['at']).total_seconds() / 60.0
                g.update({'p_home': round(p, 4), 'p_source': 'store', 'n_books': n,
                          'snapshot_at': snap['at'].isoformat().replace('+00:00', 'Z'), 'gap_minutes': round(gap)})
                tot, nt = market_total(snap['game'].get('total'), hint=_float(snap['game'].get('sgo', {}).get('total')))
                g['market_total'] = tot
                g['market_total_books'] = nt
                if frozen:
                    gaps.append(gap)
            else:
                p = None
        if p is None:
            am, hm = r.get('away_moneyline'), r.get('home_moneyline')
            f = devig_power(american_to_prob(hm), american_to_prob(am)) if am and hm else None
            if f:
                g.update({'p_home': round(f[0], 4), 'p_source': 'nflverse', 'n_books': 1, 'snapshot_at': None, 'gap_minutes': None})
            else:
                g.update({'p_home': 0.5, 'p_source': 'none', 'n_books': 0, 'snapshot_at': None, 'gap_minutes': None})
            g['market_total'] = _float(r.get('total_line'))
            g['market_total_books'] = 1 if g['market_total'] is not None else 0
            if g['market_total'] is not None:
                g['market_total_source'] = 'nflverse'
        else:
            g['market_total_source'] = 'store'
        g['frozen'] = frozen
        g['nflverse_moneyline'] = {'away': _float(r.get('away_moneyline')), 'home': _float(r.get('home_moneyline'))}
        g['nflverse_total'] = _float(r.get('total_line'))
        games.append(g)
        log(f"{g['id']:<18} kick {g['kickoff']}  lock {g['lock_at']}  p_home {g['p_home']:.4f} ({g['p_source']}, {g['n_books']} books, gap {g['gap_minutes']} min, frozen={frozen})")

    # Tiebreak game: the last kickoff. Two Monday games -> the later one, logged (open question 2).
    last = games[-1]
    mondays = [g for g in games if g['weekday'] == 'Monday']
    note = None
    if len(mondays) > 1:
        note = f"{len(mondays)} Monday games this week; using the later one ({last['id']}) as the tiebreak game. Confirm with the pool rules."
        log('NOTE ' + note)
    tiebreak = {
        'game_id': last['id'], 'label': f"{last['away']}@{last['home']}",
        'total': last.get('market_total'), 'total_source': last.get('market_total_source'), 'total_books': last.get('market_total_books'),
        'sd': sd, 'note': note,
    }
    out = {
        'season': season, 'week': week,
        'generated_at': now.isoformat().replace('+00:00', 'Z'),
        'pool': {'timezone': pool['timezone'], 'deadline': pool['deadline'], 'deadline_utc': deadline.isoformat().replace('+00:00', 'Z'), 'rules': pool.get('rules', {})},
        'tiebreak': tiebreak,
        'store': {'available': store.ok, 'last_commit': (store.commits[-1][1].isoformat().replace('+00:00', 'Z') if store.ok else None), 'commits': len(store.commits)},
        'games': games,
    }
    if gaps:
        log(f'freeze gap over {len(gaps)} kicked-off games: median {statistics.median(gaps):.0f} min, min {min(gaps):.0f}, max {max(gaps):.0f}')
    return out


def _float(x):
    try:
        return float(x) if x not in (None, '') else None
    except (TypeError, ValueError):
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--season', type=int, default=2026)
    ap.add_argument('--week', default='auto', help='week number or "auto"')
    ap.add_argument('--store', default=os.environ.get('NFL_EV_DIR', os.path.join(HERE, '..', 'NFL_EV')), help='local clone of rsnbets/nfl-ev')
    ap.add_argument('--games-csv', default=None, help='local games.csv (else fetched from nflverse)')
    ap.add_argument('--pool', default=os.path.join(HERE, 'pool.json'))
    ap.add_argument('--out', default=os.path.join(HERE, 'data'))
    ap.add_argument('--now', default=None, help='ISO time override for tests')
    a = ap.parse_args()
    now = dt.datetime.fromisoformat(a.now.replace('Z', '+00:00')).astimezone(UTC) if a.now else dt.datetime.now(UTC)
    with open(a.pool) as f:
        pool = json.load(f)
    rows = fetch_games_csv(a.games_csv)
    week = current_week(rows, a.season, now) if a.week == 'auto' else int(a.week)
    store = Store(os.path.abspath(a.store) if a.store else None)
    log(f'store: {"ok, " + str(len(store.commits)) + " lines.json commits" if store.ok else "unavailable, nflverse fallback"}')
    data = build(a.season, week, pool, rows, store, now, float(pool.get('tiebreak_sd', 13.1)))
    os.makedirs(a.out, exist_ok=True)
    path = os.path.join(a.out, f'{a.season}-w{week:02d}.json')
    with open(path, 'w') as f:
        json.dump(data, f, indent=1)
    log(f'wrote {path} ({len(data["games"])} games, tiebreak {data["tiebreak"]["label"]} total {data["tiebreak"]["total"]})')
    latest = os.path.join(a.out, 'latest.json')
    prev = {}
    if os.path.exists(latest):
        with open(latest) as f:
            try:
                prev = json.load(f)
            except json.JSONDecodeError:
                prev = {}
    # Only move "latest" forward, never back to an older week.
    if not prev or (prev.get('season'), prev.get('week')) <= (a.season, week):
        with open(latest, 'w') as f:
            json.dump({'season': a.season, 'week': week, 'file': os.path.basename(path), 'generated_at': data['generated_at']}, f, indent=1)


if __name__ == '__main__':
    main()
