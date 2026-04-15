# VAULT — Private Archive System

Improved private notes app with server-side password auth, cookie sessions, autosave status, and Supabase-backed persistence.

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Then fill `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VAULT_PASSWORD`
- `VAULT_SESSION_SECRET`

## Security improvements
- Password is checked **server-side** via `/api/auth`
- Session stored in **httpOnly cookie**
- Notes are fetched and mutated **through protected API routes**
- Vault password is **not exposed to the browser**
- Removed misleading “demo mode” fallback

## Still recommended
- Keep this app for personal use only
- If you want multi-user auth later, migrate to real Supabase Auth
