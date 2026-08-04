/* Stripe customer portal — self-serve cancel / card update.
   POST with Authorization: Bearer <supabase access token>.
   Env: STRIPE_SECRET_KEY, SITE_URL, SUPABASE_URL, SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY */

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { STRIPE_SECRET_KEY, SITE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!STRIPE_SECRET_KEY) return res.status(503).json({ error: 'payments not configured' });

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'sign in required' });

  const userRes = await fetch(SUPABASE_URL + '/auth/v1/user', {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token }
  });
  if (!userRes.ok) return res.status(401).json({ error: 'invalid session' });
  const user = await userRes.json();

  const profRes = await fetch(
    SUPABASE_URL + '/rest/v1/profiles?id=eq.' + user.id + '&select=stripe_customer_id',
    { headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY } }
  );
  const rows = profRes.ok ? await profRes.json() : [];
  const customerId = rows.length ? rows[0].stripe_customer_id : null;
  if (!customerId) return res.status(404).json({ error: 'no subscription on file' });

  const stripe = require('stripe')(STRIPE_SECRET_KEY);
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: (SITE_URL || 'https://www.profitpathsports.com') + '/account.html'
  });
  return res.status(200).json({ url: portal.url });
};
