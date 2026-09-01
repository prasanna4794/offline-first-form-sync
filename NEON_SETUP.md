# Local + Vercel Sync Setup

## Local

No database installation is required.

```bash
npm install
npm run dev
```

Without `DATABASE_URL`, local development uses `data/server-db.json`.

## Vercel

Vercel cannot use the local JSON file as persistent storage. Add a Neon PostgreSQL database and set:

```text
DATABASE_URL=<your Neon connection string>
```

Set it for Production (and Preview if needed), then redeploy.

The application automatically creates the `offline_forms` table on the first server request.

## Verify

Open:

```text
/api/health
```

Expected production response:

```json
{
  "success": true,
  "storage": "neon"
}
```

Then create a form offline/online and confirm `/api/sync` returns `success: true` and `status: "SYNCED"`.
