# Offline-First Form Sync

This version removes Prisma completely so the project can run on another laptop with only `npm install` and `npm run dev`.

## Run on any laptop

```bash
npm install
npm run dev
```

No `prisma dev`, `prisma generate`, `prisma db push`, or external database server is required.

## Sync architecture

1. Form data is saved locally in IndexedDB (`offline-form-sync`).
2. A sync item is added to the local `syncQueue` store.
3. When the browser is online, `syncProcessor.js` sends `POST /api/sync`.
4. The server API stores the synced form in `data/server-db.json` using Node's built-in `fs` APIs.
5. Only after a successful API response do the client records become `SYNCED`.
6. `syncAuditLogs` records `SYNC_STARTED`, `SYNC_COMPLETED`, or `SYNC_FAILED`.
7. Stale `SYNCING` queue items can recover back to `PENDING`.

## Important

`data/server-db.json` is local to the laptop. This is intentionally a portable local development server store. If you later deploy the app and need multiple devices/laptops to share the same server data, replace this file store with a hosted database/API.

## Local + Vercel Sync Storage

The app uses IndexedDB in the browser for offline forms, queue, and audit logs. The `/api/sync` endpoint persists synced forms using:

- Local development: `data/server-db.json` when `DATABASE_URL` is not set.
- Vercel: Neon PostgreSQL when `DATABASE_URL` is set.

No Prisma is required.

For Vercel, configure `DATABASE_URL` and redeploy. Verify the backend with `/api/health`, which should report `storage: "neon"`.
