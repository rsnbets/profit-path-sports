/* Shared PayPal helpers for the api/paypal-* functions.
   Env: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_PLAN_ID,
        PAYPAL_WEBHOOK_ID, PAYPAL_API (optional; defaults to live). */

const API = process.env.PAYPAL_API || 'https://api-m.paypal.com';

function configured() {
  return !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

async function accessToken() {
  const basic = Buffer.from(
    process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_CLIENT_SECRET
  ).toString('base64');
  const r = await fetch(API + '/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + basic,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  if (!r.ok) throw new Error('paypal oauth ' + r.status);
  return (await r.json()).access_token;
}

/* Resolve the Supabase user for a Bearer token; null if invalid. */
async function supabaseUser(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  const r = await fetch(process.env.SUPABASE_URL + '/auth/v1/user', {
    headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token }
  });
  return r.ok ? r.json() : null;
}

/* Service-role read/write on profiles (server-side only). */
async function getProfile(userId) {
  const r = await fetch(
    process.env.SUPABASE_URL + '/rest/v1/profiles?id=eq.' + userId +
      '&select=is_pro,paypal_subscription_id',
    { headers: srHeaders() }
  );
  const rows = r.ok ? await r.json() : [];
  return rows[0] || null;
}

async function setProfile(userId, patch) {
  await fetch(process.env.SUPABASE_URL + '/rest/v1/profiles?id=eq.' + userId, {
    method: 'PATCH',
    headers: { ...srHeaders(), 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() })
  });
}

function srHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { apikey: key, Authorization: 'Bearer ' + key };
}

module.exports = { API, configured, accessToken, supabaseUser, getProfile, setProfile, srHeaders };
