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

  /* Fetch the gated odds slate. Returns parsed JSON, or null when the
     caller should fall back to a stats-only view (signed out / free tier). */
  async function fetchProSlate() {
    var s = await session();
    if (!s) return null;
    var res = await fetch('/api/slate', {
      headers: { Authorization: 'Bearer ' + s.access_token }
    });
    if (!res.ok) return null;
    return res.json();
  }

  window.PPSAuth = {
    enabled: enabled,
    client: getClient,
    session: session,
    signIn: signIn,
    signOut: signOut,
    isPro: isPro,
    fetchProSlate: fetchProSlate
  };
})();
