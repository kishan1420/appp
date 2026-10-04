# Kisaan Backend — REST API (Node.js + TypeScript + PostgreSQL)

Production-oriented API matching the mobile app's data model exactly.

## Run with Docker (recommended)

```bash
docker compose up --build
# PostgreSQL 16 (schema + seed auto-applied) on :5432, API on :4000
curl http://localhost:4000/api/v1/health
```

## Run locally

```bash
npm install
cp .env.example .env           # edit DATABASE_URL, JWT_SECRET
# create DB + apply sql/schema.sql and sql/seed.sql manually, then:
npm run dev                    # tsx watch on :4000
npm run build && npm start     # compiled
npm run typecheck
```

## Auth

- `POST /api/v1/auth/register` `{name, phone, password, village?, district?, state?, language?}` → `{token, profile}`
- `POST /api/v1/auth/login` `{phone, password}` → `{token, profile}`
- `GET /api/v1/auth/me`, `PATCH /api/v1/auth/profile` (Bearer token)

Passwords: bcrypt (10 rounds). Tokens: JWT, 30-day expiry (configurable).

## Farmer data (all require Bearer token, scoped per user)

- Farms: `GET/POST /api/v1/farms`, `GET/PATCH/DELETE /api/v1/farms/:id`
- Crops: `GET/POST /api/v1/crops?farmId=`, `GET/PATCH/DELETE /api/v1/crops/:id`
- Activities: `GET/POST /api/v1/crops/:id/activities`, `DELETE /api/v1/crops/:id/activities/:activityId`
- Transactions: `GET/POST /api/v1/transactions?month=&type=&cropId=`, `PATCH/DELETE /api/v1/transactions/:id`
- Summary: `GET /api/v1/transactions/summary?month=YYYY-MM` → `{income, expense, net, byCrop[]}`
- Reminders: `GET/POST /api/v1/reminders`, `PATCH/DELETE /api/v1/reminders/:id`

Deletes cascade like the mobile app (farm → crops → activities; transactions keep
history with `crop_id`/`farm_id` set null).

## Public data (no auth)

- `GET /api/v1/mandi/prices?state=&crop=` — Agmarknet-format prices (seeded sample)
- `GET /api/v1/schemes`, `GET /api/v1/schemes/:id` — government schemes (bilingual)
- `GET /api/v1/weather?lat=&lon=` — Open-Meteo proxy (server-side cache point)

## Production checklist (Phase 13 of your plan)

- [x] Schema + indexes (`sql/schema.sql`), seed reference data (`sql/seed.sql`)
- [x] JWT auth, bcrypt, zod validation, per-user scoping, error middleware
- [x] Dockerfile (multi-stage) + docker-compose with healthchecks
- [ ] Deploy (Fly.io / Render / EC2 + RDS), HTTPS at your proxy/CDN
- [ ] Monitoring (e.g. Sentry), rate limiting, DB backups
- [ ] Live mandi sync job (Agmarknet / data.gov.in) replacing sample seed
