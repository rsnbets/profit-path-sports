/* Creates a Stripe Checkout session for the Pro subscription.
   POST with Authorization: Bearer <supabase access token>.
   Env: STRIPE_SECRET_KEY, STRIPE_PRICE_ID, SITE_URL,
        SUPABASE_URL, SUPABASE_ANON_KEY */

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { STRIPE_SECRET_KEY, STRIPE_PRICE_ID, SITE_URL, SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) return res.status(503).json({ error: 'payments not configured' });

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'sign in required' });

  const userRes = await fetch(SUPABASE_URL + '/auth/v1/user', {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token }
  });
  if (!userRes.ok) return res.status(401).json({ error: 'invalid session' });
  const user = await userRes.json();

  const stripe = require('stripe')(STRIPE_SECRET_KEY);
  const site = SITE_URL || 'https://www.profitpathsports.com';
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    allow_promotion_codes: true,
    success_url: site + '/account.html?upgraded=1',
    cancel_url: site + '/account.html'
  });
  return res.status(200).json({ url: session.url });
};
