# Vercel + Neon Setup

The app supports both local and Vercel deployments.

## Local

No database setup is required.

```bash
npm install
npm run dev
```

Without `DATABASE_URL`, the server API uses `data/server-db.json` for local development. Browser form drafts and the sync queue remain in IndexedDB.

## Vercel

Vercel serverless functions must not use the local JSON file for persistent server data. Configure a Neon PostgreSQL database and add its connection string to the Vercel project as:

```text
DATABASE_URL=your-neon-connection-string
```

Then redeploy.

The application automatically creates the `forms` table on the first server request. No Prisma and no migration command are required.

## Verify

Open:

```text
https://YOUR-DOMAIN/api/health
```

A correctly configured Vercel deployment should return JSON containing:

```json
{
  "success": true,
  "environment": "vercel",
  "storage": "neon-postgres"
}
```

Then submit a form while online. The browser queue should move from `PENDING` → `SYNCING` → `SYNCED`, and `/api/forms` should show the server-side record.
