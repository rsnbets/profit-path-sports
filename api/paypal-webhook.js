/* PayPal webhook — the only writer of is_pro on the PayPal path.
   Signature is verified through PayPal's own verify-webhook-signature API
   (PayPal accepts the parsed event object, so no raw-body dance like Stripe).

   ACTIVATED  -> is_pro = true   (custom_id = Supabase user id)
   CANCELLED / SUSPENDED / EXPIRED -> is_pro = false
   Unknown users or event types are acknowledged and ignored. */

const pp = require('./_paypal');

async function verify(req, event) {
  const token = await pp.accessToken();
  const r = await fetch(pp.API + '/v1/notification/verify-webhook-signature', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_algo: req.headers['paypal-auth-algo'],
      cert_url: req.headers['paypal-cert-url'],
      transmission_id: req.headers['paypal-transmission-id'],
      transmission_sig: req.headers['paypal-transmission-sig'],
      transmission_time: req.headers['paypal-transmission-time'],
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: event
    })
  });
  const body = r.ok ? await r.json() : {};
  return body.verification_status === 'SUCCESS';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!pp.configured() || !process.env.PAYPAL_WEBHOOK_ID) return res.status(503).end();

  const event = req.body;
  if (!event || !event.event_type) return res.status(400).end();
  if (!(await verify(req, event))) {
    console.error('paypal webhook signature failed');
    return res.status(400).end();
  }

  const type = event.event_type;
  const sub = event.resource || {};
  try {
    if (type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      if (sub.custom_id) {
        await pp.setProfile(sub.custom_id, { is_pro: true, paypal_subscription_id: sub.id });
      }
    } else if (type === 'BILLING.SUBSCRIPTION.CANCELLED' ||
               type === 'BILLING.SUBSCRIPTION.SUSPENDED' ||
               type === 'BILLING.SUBSCRIPTION.EXPIRED') {
      if (sub.custom_id) {
        await pp.setProfile(sub.custom_id, { is_pro: false });
      }
    }
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('paypal webhook', e);
    return res.status(500).end();
  }
};
