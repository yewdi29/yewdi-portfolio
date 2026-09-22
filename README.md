# Yewdiel Venzor — Dossier

Personal work archive. Chronological, oldest first.

## Local

```bash
npm install
npm run dev
```

The public site reads three seed entries from `lib/seed.ts` until Supabase is connected.

## Supabase (optional, for uploading)

1. Create a project.
2. Run `supabase/migrations/001_projects.sql`.
3. Optionally run `supabase/seed.sql`.
4. Copy `.env.example` to `.env.local` and fill:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

5. Create one Auth user (email/password).
6. Open `/admin` to add entries.

## Deploy

Connect the repo to Vercel. Add the same env vars if you want the studio. Without them, the site ships with the seed dossier.
