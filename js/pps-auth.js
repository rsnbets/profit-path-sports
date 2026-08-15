/* ═══════════════════════════════════════════════════════════════
   PROFITPATH Sports — shared auth client (Supabase)
   Feature-flagged: with SUPABASE_URL empty, every helper no-ops and
   the site behaves exactly as before. Fill in the two public values
   below once the Supabase project exists (they are safe to ship —
   the anon key is designed to be public; row security does the work).
   Pages load this after the supabase-js CDN script:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
   <script src="/js/pps-auth.js"></script>
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var SUPABASE_URL = '';        // e.g. https://abcdefgh.supabase.co
  var SUPABASE_ANON_KEY = '';   // the "anon / public" key from Supabase → Settings → API

  var client = null;

  function enabled() {
    return !!(SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase);
  }

  function getClient() {
    if (!enabled()) return null;
    if (!client) client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return client;
  }

  /* Current session, or null. */
  async function session() {
    var c = getClient();
    if (!c) return null;
    var r = await c.auth.getSession();
    return (r && r.data && r.data.session) || null;
  }

  /* Send a magic sign-in link. */
  async function signIn(email) {
    var c = getClient();
    if (!c) throw new Error('auth not configured');
    var r = await c.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: window.location.origin + '/account.html' }
    });
    if (r.error) throw r.error;
    return true;
  }

  async function signOut() {
    var c = getClient();
    if (c) await c.auth.signOut();
  }

  /* Is the signed-in user on the Pro tier? Reads their own profile row (RLS). */
  async function isPro() {
    var c = getClient();
    if (!c) return false;
    var s = await session();
    if (!s) return false;
    var r = await c.from('profiles').select('is_pro').eq('id', s.user.id).single();
    return !!(r && r.data && r.data.is_pro);
  }

  /* Own profile row (RLS-guarded): { is_pro, paypal_subscription_id } or null. */
  async function profile() {
    var c = getClient();
    if (!c) return null;
    var s = await session();
    if (!s) return null;
    var r = await c.from('profiles')
      .select('is_pro,paypal_subscription_id').eq('id', s.user.id).single();
    return (r && r.data) || null;
  }

  /* The public slate chain (pointer -> blob -> committed fallback) — the
     pre-Pro behaviour, and still the whole story while auth is switched off. */
  var POINTER_URL = 'https://prop-zone.vercel.app/blob_url.txt';
  var FALLBACK_URL = 'https://prop-zone.vercel.app/master.json';
  async function publicSlate() {
    try {
      var p = await fetch(POINTER_URL + '?_=' + Date.now(), { cache: 'no-store' });
      if (!p.ok) throw new Error('pointer ' + p.status);
      var url = (await p.text()).trim();
      var r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) throw new Error('blob ' + r.status);
      return { slate: await r.json(), fallback: false };
    } catch (e) {
      var r2 = await fetch(FALLBACK_URL + '?_=' + Date.now(), { cache: 'no-store' });
      if (!r2.ok) throw e;
      return { slate: await r2.json(), fallback: true };
    }
  }

  /* THE odds loader for every tool. Resolves to:
       { slate, fallback, locked: null }         -> render odds as always
       { slate: null, locked: 'signedout' }      -> lock UI, ask to sign in
       { slate: null, locked: 'free' }           -> lock UI, pitch Pro
       { slate: null, locked: 'error' }          -> odds feed hiccup
     With auth switched off this is exactly the old public fetch, so the
     tools behave identically until the day the keys go in. */
  async function odds() {
    if (!enabled()) {
      var pub = await publicSlate();
      return { slate: pub.slate, fallback: pub.fallback, locked: null };
    }
    var s = await session();
    if (!s) return { slate: null, fallback: false, locked: 'signedout' };
    var res = await fetch('/api/slate', {
      headers: { Authorization: 'Bearer ' + s.access_token }
    });
    if (res.status === 402) return { slate: null, fallback: false, locked: 'free' };
    if (!res.ok) return { slate: null, fallback: false, locked: 'error' };
    return { slate: await res.json(), fallback: false, locked: null };
  }

  /* Standard lock card markup — one string so all three tools say the
     same thing. Pages style .odds-lock with their own CSS. */
  function lockHTML(reason) {
    var msg = reason === 'signedout'
      ? 'Live lines & vig-free fair prices are part of <strong>PPS Pro</strong> — $10/mo. Every stat on this page stays free.'
      : reason === 'free'
        ? 'Your account is on the free tier. <strong>PPS Pro</strong> ($10/mo) unlocks live lines & fair prices in every tool.'
        : 'The odds feed hit a snag — refresh in a minute. All stats still live.';
    var cta = reason === 'error' ? ''
      : '<a class="odds-lock-cta" href="/account.html">' +
        (reason === 'signedout' ? 'Sign in / Go Pro →' : 'Go Pro →') + '</a>';
    return '<div class="odds-lock"><span class="odds-lock-icon">🔒</span>' +
      '<span class="odds-lock-msg">' + msg + '</span>' + cta + '</div>';
  }

  window.PPSAuth = {
    enabled: enabled,
    client: getClient,
    session: session,
    signIn: signIn,
    signOut: signOut,
    isPro: isPro,
    profile: profile,
    publicSlate: publicSlate,
    odds: odds,
    lockHTML: lockHTML
  };
})();
