/* Stripe webhook — the single source of truth for who is Pro.
   Events: checkout.session.completed, customer.subscription.updated,
           customer.subscription.deleted.
   Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
        SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY */

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) return res.status(503).end();

  const stripe = require('stripe')(STRIPE_SECRET_KEY);

  // raw body needed for signature verification
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks);

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return res.status(400).json({ error: 'bad signature' });
  }

  async function setPro(userId, isPro, customerId) {
    const body = { is_pro: isPro, updated_at: new Date().toISOString() };
    if (customerId) body.stripe_customer_id = customerId;
    await fetch(SUPABASE_URL + '/rest/v1/profiles?id=eq.' + userId, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(body)
    });
  }

  async function userIdFromCustomer(customerId) {
    const r = await fetch(
      SUPABASE_URL + '/rest/v1/profiles?stripe_customer_id=eq.' + customerId + '&select=id',
      { headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY } }
    );
    const rows = r.ok ? await r.json() : [];
    return rows.length ? rows[0].id : null;
  }

  const obj = event.data.object;
  if (event.type === 'checkout.session.completed') {
    if (obj.client_reference_id) await setPro(obj.client_reference_id, true, obj.customer);
  } else if (event.type === 'customer.subscription.updated') {
    const active = obj.status === 'active' || obj.status === 'trialing';
    const uid = await userIdFromCustomer(obj.customer);
    if (uid) await setPro(uid, active, obj.customer);
  } else if (event.type === 'customer.subscription.deleted') {
    const uid = await userIdFromCustomer(obj.customer);
    if (uid) await setPro(uid, false, obj.customer);
  }

  return res.status(200).json({ received: true });
};

module.exports.config = { api: { bodyParser: false } };
