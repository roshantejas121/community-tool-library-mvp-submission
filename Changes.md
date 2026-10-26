# Community Tool Library — Changes

## MVP identification

The product's core value is neighborhood tool sharing. The MVP therefore needs three reliable capabilities:

1. List a tool with a name and description.
2. View all tools stored in the database.
3. Borrow an available tool and return it later by toggling its availability.

Ratings, reviews, uploads, categories, and badges are outside this focused MVP.

## Issues discovered and fixes

### 1. Infinite fetch loop in the React app

- **Symptom:** The browser repeatedly requested `GET /api/tools`, causing continuous loading and unnecessary backend traffic.
- **Cause:** `App.jsx` ran `useEffect` without a dependency array. Every state update caused another effect execution.
- **Fix:** The fetch function is memoized with `useCallback`, and the effect depends on that stable function, so the initial load runs once per mount. A retry action is available when loading fails.

### 2. New tools were not persisted

- **Symptom:** The interface reported a successful listing, but the new tool disappeared after refresh.
- **Cause:** `server/routes/tools.js` returned a timestamp-based in-memory object instead of calling Prisma.
- **Fix:** The POST route validates trimmed input and uses `prisma.tool.create`. The persisted record returned by the database is added directly to the UI.

### 3. Borrow/return used the wrong endpoint

- **Symptom:** Clicking Borrow or Return returned a 404 response.
- **Cause:** `ToolCard.jsx` called `/api/tool/:id`, while the backend route is `/api/tools/:id`.
- **Fix:** The client now uses the shared `toggleToolAvailability` API helper with the correct plural route.

### 4. The UI ignored the server's updated availability

- **Symptom:** A successful borrow/return request did not reliably change the card status.
- **Cause:** The client discarded the server response and constructed a local object whose `isAvailable` value never changed.
- **Fix:** The response from the PATCH route is passed to `onUpdate`, ensuring the UI reflects the database result.

### 5. React state was mutated directly

- **Symptom:** Tool cards could remain visually stale after an update.
- **Cause:** `App.jsx` changed an item inside the existing `tools` array without calling its setter.
- **Fix:** Updates now use `setTools` with a functional immutable `map` operation.

### 6. Tool list keys were unstable

- **Symptom:** React could not consistently associate a card with its data when the list changed.
- **Cause:** `ToolList.jsx` used `tool.index`, a property that does not exist.
- **Fix:** Cards now use the database primary key, `tool.id`, as their React key.

## Improvements

- Centralized GET, POST, and PATCH requests in `client/src/services/api.js`.
- Added `VITE_API_URL` support so the frontend can call a separately deployed backend; local development continues to use the Vite `/api` proxy.
- Added client-side error messages and a retry action.
- Added server-side input validation and a `/health` endpoint for deployment health checks.
- Made the server port configurable through `PORT` and load `.env` through `dotenv`.
- Kept the existing React, Express, Prisma, and PostgreSQL structure without introducing unnecessary application complexity.

## Verification

- Client production build: `npm run build` in `client/`
- Backend syntax check: `node --check index.js` and `node --check routes/tools.js` in `server/`
- API persistence requires a PostgreSQL `DATABASE_URL`; configure it in `server/.env` and run `npx prisma db push` before starting the server.

## Deployment links

- Frontend Deployment Link: `TBD — set VITE_API_URL to the deployed backend URL`
- Backend Deployment Link: `TBD — deploy the server with DATABASE_URL configured`
