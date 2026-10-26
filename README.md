# Community Tool Library MVP

A focused neighborhood tool-sharing application. The MVP lets residents list tools, browse the shared inventory, and borrow or return tools with state persisted in PostgreSQL through Prisma.

## Stack

React + Vite client, Express API, Prisma ORM, and PostgreSQL.

## Local setup

1. Create a PostgreSQL database and copy `server/.env.example` to `server/.env`.
2. In `server/`, run `npm install`, `npx prisma db push`, and `npm start`.
3. In `client/`, run `npm install` and `npm run dev`.
4. Open `http://localhost:3000`.

The Vite development server proxies `/api` to `http://localhost:5000`. For a separately deployed backend, set the client environment variable `VITE_API_URL` to its public URL before building.

The backend exposes `GET /health` for deployment health checks.

## Engineering notes

See [Changes.md](./Changes.md) for the investigation, root causes, fixes, and verification performed for the MVP restoration.
