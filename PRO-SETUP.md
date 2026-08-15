# Pro tier setup — one-time checklist

The code for auth + payments + the gated odds feed is already in the repo and
**inert**: until the env vars below exist, /account.html shows "coming soon"
and every tool behaves exactly as today.

## 1. Supabase (auth + who-is-Pro)

1. supabase.com → New project (name: `profitpath`). Free tier.
2. SQL Editor → run:

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_pro boolean not null default false,
  stripe_customer_id text,
  paypal_subscription_id text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

3. Authentication → URL Configuration → Site URL: `https://www.profitpathsports.com`
   and add `https://www.profitpathsports.com/account.html` to Redirect URLs.
4. Settings → API: copy the **Project URL** and **anon public key** →
   paste them into the two constants at the top of `js/pps-auth.js` (safe to commit).
5. Same page: copy the **service_role key** (SECRET — never commit) for step 3 below.

## 2a. PayPal (payments — primary)

1. developer.paypal.com → Apps & Credentials → **Live** → Create App
   (name: `PPS Pro`). Copy **Client ID** and **Secret**.
2. Create the product + plan (once, via the dashboard: PayPal → Pay & Get Paid
   → Subscriptions → Create plan): name **PPS Pro**, **$10.00 USD monthly**.
   Copy the **plan id** (`P-…`).
3. Back in the developer app page → Webhooks → Add webhook:
   `https://www.profitpathsports.com/api/paypal-webhook`
   Events: `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`,
   `BILLING.SUBSCRIPTION.SUSPENDED`, `BILLING.SUBSCRIPTION.EXPIRED`.
   Copy the **Webhook ID**.
4. Sandbox first: the same steps under **Sandbox** creds, with
   `PAYPAL_API=https://api-m.sandbox.paypal.com` set in Vercel; remove that
   var (or set the live host) when going live.

## 2b. Stripe (payments — optional fallback)

1. stripe.com → activate account.
2. Products → Add product: name **PPS Pro**, recurring price (monthly).
   Copy the **price id** (`price_…`).
3. Developers → API keys: copy the **secret key** (`sk_live_…`).
4. Developers → Webhooks → Add endpoint:
   `https://www.profitpathsports.com/api/stripe-webhook`
   Events: `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`. Copy the **signing secret** (`whsec_…`).

## 3. Vercel

1. Upgrade the project to **Pro** (Hobby forbids commercial use).
2. Project → Settings → Environment Variables (Production):

| Name | Value |
|---|---|
| `SUPABASE_URL` | Project URL from 1.4 |
| `SUPABASE_ANON_KEY` | anon key from 1.4 |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key from 1.5 |
| `STRIPE_SECRET_KEY` | sk from 2.3 |
| `STRIPE_PRICE_ID` | price id from 2.2 |
| `STRIPE_WEBHOOK_SECRET` | whsec from 2.4 |
| `PAYPAL_CLIENT_ID` | from 2a.1 |
| `PAYPAL_CLIENT_SECRET` | from 2a.1 |
| `PAYPAL_PLAN_ID` | `P-…` from 2a.2 |
| `PAYPAL_WEBHOOK_ID` | from 2a.3 |
| `PAYPAL_API` | sandbox host while testing; unset for live |
| `SITE_URL` | `https://www.profitpathsports.com` |

3. Redeploy.

## 4. Test before flipping any tool

1. /account.html → sign in with a magic link (your own email).
2. Upgrade → PayPal sandbox checkout (sandbox buyer account), or Stripe
   test-mode (`4242 4242 4242 4242`) if going the Stripe route.
3. Confirm the badge flips to **Pro** (webhook worked). For PayPal also
   confirm cancel from /account.html flips it back.
4. `curl /api/slate` with and without the token — 200 with, 401/402 without.
5. The three tools (hot-streaks, starting-pitchers, player) already run
   their odds through PPSAuth.odds() — the gate turns on by itself the
   moment js/pps-auth.js gets the Supabase config. No further page edits.

## Notes

- The anon key and Supabase URL are public by design; RLS is the guard.
- The raw prop-zone slate stays public (Bonus Finder depends on it). The Pro
  gate covers the joined odds inside our tools; moving the slate fully private
  is a later step if Pro takes off.
