/* Cancel the signed-in user's PayPal subscription (their own only —
   the sub id comes from their profile row, never from the request).
   is_pro flips off when PayPal sends the CANCELLED webhook, keeping the
   webhook as the single writer of tier state. */

const pp = require('./_paypal');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!pp.configured()) return res.status(503).json({ error: 'paypal not configured' });

  const user = await pp.supabaseUser(req);
  if (!user) return res.status(401).json({ error: 'sign in required' });

  const profile = await pp.getProfile(user.id);
  if (!profile || !profile.paypal_subscription_id) {
    return res.status(404).json({ error: 'no paypal subscription on file' });
  }

  try {
    const token = await pp.accessToken();
    const r = await fetch(
      pp.API + '/v1/billing/subscriptions/' + profile.paypal_subscription_id + '/cancel',
      {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Cancelled from account page' })
      }
    );
    if (r.status !== 204) {
      console.error('paypal cancel failed', r.status, await r.text());
      return res.status(502).json({ error: 'cancel failed — contact support' });
    }
    return res.status(200).json({ cancelled: true });
  } catch (e) {
    console.error('paypal cancel', e);
    return res.status(502).json({ error: 'paypal unavailable' });
  }
};
