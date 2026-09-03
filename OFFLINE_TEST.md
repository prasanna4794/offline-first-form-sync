# Offline test — Local + Vercel

## Important
A browser can only open the application offline after that browser has visited the application successfully while online and the Service Worker has been installed/activated.

IndexedDB stores the offline form data. The Service Worker stores the application shell, Next.js assets, and App Router RSC responses needed for offline navigation.

## Local
1. Run `npm install`.
2. Run `npm run dev`.
3. Open `http://localhost:3000` while internet is ON.
4. Visit `/`, `/forms`, `/drafts`, `/sync-queue`, `/media`, `/conflicts`, `/activity`, and `/settings` once while online.
5. Refresh once after the Service Worker becomes active.
6. Open DevTools → Application → Service Workers and confirm `/sw.js` is activated.
7. Turn Wi-Fi/mobile hotspot OFF.
8. Refresh the site and navigate between the cached pages.
9. Create/save a form. It should remain local and be `PENDING` in the sync queue.
10. Turn internet ON. The online event should trigger sync and the item should become `SYNCED` after the server accepts it.

## Vercel
1. Deploy the current project.
2. Open the production URL while internet is ON.
3. Visit the main pages once and refresh.
4. DevTools → Application → Service Workers → confirm `/sw.js` is activated.
5. Turn internet OFF.
6. Refresh and test the pages/navigation.
7. Create/save a form offline; it should be stored in IndexedDB as `PENDING`.
8. Turn internet ON; the queued transaction should sync to Neon through `/api/sync`.
9. Verify the server side while online using `/api/health`.

## If an old Service Worker is still active
The cache name is versioned. Normally the new deployment replaces the old worker automatically.
If the browser still serves an old worker, DevTools → Application → Service Workers → update/reload the worker.

Only use "Unregister" / "Clear site data" if necessary, because clearing site data removes the browser's IndexedDB data and therefore local forms/queue items.
