/* Create a PayPal subscription for the signed-in user and return the
   approval URL. Mirrors api/stripe-checkout.js — whichever processor has
   keys wins; both can coexist.
   custom_id carries the Supabase user id so the webhook can flip is_pro. */

const pp = require('./_paypal');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!pp.configured() || !process.env.PAYPAL_PLAN_ID) {
    return res.status(503).json({ error: 'paypal not configured' });
  }
  const user = await pp.supabaseUser(req);
  if (!user) return res.status(401).json({ error: 'sign in required' });

  const site = process.env.SITE_URL || 'https://www.profitpathsports.com';
  try {
    const token = await pp.accessToken();
    const r = await fetch(pp.API + '/v1/billing/subscriptions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan_id: process.env.PAYPAL_PLAN_ID,
        custom_id: user.id,
        application_context: {
          brand_name: 'PROFITPATH Sports',
          user_action: 'SUBSCRIBE_NOW',
          return_url: site + '/account.html?paypal=success',
          cancel_url: site + '/account.html?paypal=cancelled'
        }
      })
    });
    const sub = await r.json();
    if (!r.ok) {
      console.error('paypal create sub failed', sub);
      return res.status(502).json({ error: 'paypal error' });
    }
    const approve = (sub.links || []).find(l => l.rel === 'approve');
    if (!approve) return res.status(502).json({ error: 'no approval link' });
    return res.status(200).json({ url: approve.href });
  } catch (e) {
    console.error('paypal checkout', e);
    return res.status(502).json({ error: 'paypal unavailable' });
  }
};
