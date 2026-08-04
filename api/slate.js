/* Gated odds slate — Pro tier only.
   Validates the caller's Supabase session, checks profiles.is_pro, then
   proxies the live slate (pointer → blob) server-side. Free users never
   receive the odds payload from this site's tools.
   Env: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY */

const POINTER_URL = 'https://prop-zone.vercel.app/blob_url.txt';
const FALLBACK_URL = 'https://prop-zone.vercel.app/master.json';

module.exports = async function handler(req, res) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'pro tier not configured' });
  }

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'sign in required' });

  // 1) Who is this token?
  const userRes = await fetch(SUPABASE_URL + '/auth/v1/user', {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token }
  });
  if (!userRes.ok) return res.status(401).json({ error: 'invalid session' });
  const user = await userRes.json();

  // 2) Are they Pro? (service role read — bypasses RLS, server-side only)
  const profRes = await fetch(
    SUPABASE_URL + '/rest/v1/profiles?id=eq.' + user.id + '&select=is_pro',
    { headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY } }
  );
  const rows = profRes.ok ? await profRes.json() : [];
  if (!rows.length || !rows[0].is_pro) {
    return res.status(402).json({ error: 'pro tier required' });
  }

  // 3) Proxy the slate (pointer first, committed fallback second)
  try {
    let url = FALLBACK_URL;
    try {
      const p = await fetch(POINTER_URL + '?_=' + Date.now(), { cache: 'no-store' });
      if (p.ok) {
        const candidate = (await p.text()).trim();
        if (candidate.startsWith('http')) url = candidate;
      }
    } catch (e) { /* fall back */ }
    let r = await fetch(url, { cache: 'no-store' });
    if (!r.ok && url !== FALLBACK_URL) r = await fetch(FALLBACK_URL, { cache: 'no-store' });
    if (!r.ok) return res.status(502).json({ error: 'slate unavailable' });
    const slate = await r.json();
    res.setHeader('Cache-Control', 'private, max-age=120');
    return res.status(200).json(slate);
  } catch (e) {
    return res.status(502).json({ error: 'slate fetch failed' });
  }
};
