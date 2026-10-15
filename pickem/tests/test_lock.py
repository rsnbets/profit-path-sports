#!/usr/bin/env python3
"""Test 5: lock rule on real 2026 Week 6 kickoffs, plus DST on Oct 25 and Nov 1 (zoneinfo)."""
import datetime as dt, json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import build as B

fails = []
def check(ok, msg):
    if not ok: fails.append(msg)

pool = {'timezone': 'America/Denver', 'deadline': {'weekday': 'Sunday', 'time': '10:50'}}
rows = B.fetch_games_csv(os.environ.get('GAMES_CSV'))
wk = B.week_rows(rows, 2026, 6)
kicks = {r['game_id']: B.kickoff_utc(r) for r in wk}
deadline = B.weekly_deadline_utc(list(kicks.values()), pool)
check(deadline == dt.datetime(2026, 10, 18, 16, 50, tzinfo=dt.timezone.utc), f'deadline {deadline}')
locks = {gid: B.lock_at(k, deadline) for gid, k in kicks.items()}
U = dt.timezone.utc
check(locks['2026_06_SEA_DEN'] == dt.datetime(2026, 10, 16, 0, 15, tzinfo=U), f"SEA@DEN {locks['2026_06_SEA_DEN']}")
check(locks['2026_06_HOU_JAX'] == dt.datetime(2026, 10, 18, 13, 30, tzinfo=U), f"HOU@JAX {locks['2026_06_HOU_JAX']}")
for gid, k in kicks.items():
    if k >= deadline:
        check(locks[gid] == dt.datetime(2026, 10, 18, 16, 50, tzinfo=U), f'{gid} {locks[gid]}')
check(locks['2026_06_TEN_IND'] == dt.datetime(2026, 10, 18, 16, 50, tzinfo=U), 'TEN@IND')
check(locks['2026_06_WAS_SF'] == dt.datetime(2026, 10, 18, 16, 50, tzinfo=U), 'WAS@SF (MNF)')
# never after kickoff
for gid, k in kicks.items():
    check(locks[gid] <= k, f'{gid} locks after kickoff')
# DST: same 10:50 AM Denver deadline, Oct 25 and Nov 1 weeks
d25 = B.weekly_deadline_utc([dt.datetime(2026, 10, 23, 0, 15, tzinfo=U)], pool)
check(d25 == dt.datetime(2026, 10, 25, 16, 50, tzinfo=U), f'Oct 25 deadline {d25}')
d01 = B.weekly_deadline_utc([dt.datetime(2026, 10, 30, 0, 15, tzinfo=U)], pool)
check(d01 == dt.datetime(2026, 11, 1, 17, 50, tzinfo=U), f'Nov 1 deadline {d01}')
# de-vig sanity: power method on a -142/+120 pair, median across equal books
ph, pa = B.american_to_prob('-142'), B.american_to_prob('+120')
f = B.devig_power(ph, pa)
check(abs(f[0] + f[1] - 1) < 1e-9 and 0.55 < f[0] < 0.60, f'devig {f}')
p, n = B.p_home_from_ml({'a': ['-142', '+120'], 'b': ['-145', '+125'], 'unknown': ['-137', '-137']})
check(n == 2 and 0.55 < p < 0.60, f'median devig {p} n={n}')
if fails:
    print('FAIL lock rule (%d)' % len(fails)); [print('   - ' + f) for f in fails]; sys.exit(1)
print('ok   lock rule (2026 Week 6 kickoffs, DST Oct 25 / Nov 1) and de-vig')
