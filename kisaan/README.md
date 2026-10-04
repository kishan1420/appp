# Kisaan 🌱 — Farmer App for Android & iOS

**Kisaan** is a farmer-first digital platform for Indian farmers: manage farms, crops,
money and reminders — with live weather, mandi (market) prices and government scheme
information in **Hindi and English**. One codebase ships to **Android + iOS** (Expo /
React Native), with a production-ready **Node.js + TypeScript + PostgreSQL** backend.

Built from your `TASKS.txt` plan and `MEMORY.txt` principles: *simple first, mobile
first, farmer first, useful information over decorative UI, easy Hindi/English.*

---

## What's in this repo

```
kisaan/
├── mobile/     # Expo (React Native + TypeScript) app — Android & iOS
└── backend/    # Node.js + TypeScript REST API + PostgreSQL (Docker-ready)
```

| Module (MVP P0) | Status | Where |
|---|---|---|
| Auth & farmer profile (offline-first) | ✅ | `mobile/src/app/auth/*`, `profile.tsx` |
| Farm management (area units, irrigation, soil) | ✅ | `mobile/src/app/(tabs)/farms.tsx`, `farm/*` |
| Crop management (stages, sowing→harvest, activities) | ✅ | `mobile/src/app/crop/*` |
| Dashboard (simple, few cards) | ✅ | `mobile/src/app/(tabs)/index.tsx` |
| Weather (live Open-Meteo, 7-day, cached, offline fallback) | ✅ | `mobile/src/app/weather.tsx`, `services/weather.ts` |
| Mandi prices (search + state filter, Agmarknet format) | ✅ | `mobile/src/app/(tabs)/market.tsx` |
| Government schemes (14 curated, bilingual, official links) | ✅ | `mobile/src/app/(tabs)/schemes.tsx`, `scheme/[id].tsx` |
| Reminders (+ local phone notifications where supported) | ✅ | `mobile/src/app/reminders.tsx`, `reminder/edit.tsx` |
| Farm finance (monthly + crop-wise summaries, Indian ₹ grouping) | ✅ | `mobile/src/app/finance*.tsx` |
| Hindi/English toggle everywhere | ✅ | `mobile/src/i18n/*` |
| REST API + PostgreSQL backend | ✅ scaffolded | `backend/` |

Verified: `tsc --noEmit` clean on both projects, Metro production bundle builds
(Hermes, Android), API boots and routes respond correctly.

---

## 1. Run the mobile app (5 minutes, no Android Studio / Xcode needed)

```bash
cd mobile
npm install
npx expo start
```

- **Android:** install the free **Expo Go** app, scan the QR code.
- **iOS:** scan the QR with the **Camera** app (opens Expo Go).
- Press `a` / `i` in the terminal if you have emulators installed.

Create an account inside the app — everything is stored on the phone
(offline-first), so it works fully without internet except live weather.

### Build real installable apps (APK / App Store)

```bash
cd mobile
npm install -g eas-cli && eas login
eas build -p android --profile preview      # → installable APK
eas build -p ios     --profile production   # → App Store build (needs Apple account)
```

`eas.json` already contains `development`, `preview` (APK) and `production` profiles.
Bundle ids: `com.kisaan.app` (set in `app.json`).

---

## 2. Run the backend (optional for now — the app is offline-first)

```bash
cd backend
docker compose up --build        # PostgreSQL + API on :4000
# or locally: cp .env.example .env, run Postgres, apply sql/schema.sql + sql/seed.sql
npm install && npm run dev
```

Health check: `GET http://localhost:4000/api/v1/health`

### API surface

| Area | Endpoints |
|---|---|
| Auth | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, `PATCH /api/v1/auth/profile` |
| Farms | `GET/POST /api/v1/farms`, `GET/PATCH/DELETE /api/v1/farms/:id` |
| Crops | `GET/POST /api/v1/crops`, `GET/PATCH/DELETE /api/v1/crops/:id`, `GET/POST /api/v1/crops/:id/activities`, `DELETE /api/v1/crops/:id/activities/:activityId` |
| Finance | `GET/POST /api/v1/transactions`, `GET /api/v1/transactions/summary?month=YYYY-MM`, `PATCH/DELETE /api/v1/transactions/:id` |
| Reminders | `GET/POST /api/v1/reminders`, `PATCH/DELETE /api/v1/reminders/:id` |
| Public | `GET /api/v1/mandi/prices?state=&crop=`, `GET /api/v1/schemes`, `GET /api/v1/schemes/:id`, `GET /api/v1/weather?lat=&lon=` |

Auth is JWT (`Authorization: Bearer <token>`). Passwords hashed with bcrypt.
Input validated with zod. Cascade deletes mirror the mobile app.

---

## 3. How the pieces fit

- **Offline-first:** all farmer-owned data (profile, farms, crops, activities,
  transactions, reminders) lives in on-device AsyncStorage today. The backend exposes
  the identical data model, so a sync layer can be added later *without touching screens*.
- **Weather:** Open-Meteo (free, no key), 30-min device cache, stale cache shown when offline.
- **Mandi & schemes:** curated bilingual datasets shipped in-app (labelled as Agmarknet-format
  sample data). The backend serves the same data from PostgreSQL for production sync.
- **Notifications:** local scheduled notifications via `expo-notifications`; degrades
  gracefully where unavailable (e.g. Expo Go on Android) — reminders still work in-app.

## 4. Project layout (mobile)

```
mobile/src/
├── app/            # expo-router screens: (tabs) dashboard/farms/mandi/schemes/more,
│                   #   auth, farm, crop, finance, reminders, scheme, weather, profile
├── components/     # design system: Button, Input, Select, DateField, ui primitives
├── data/           # crop catalog, mandi sample prices, govt schemes (bilingual)
├── hooks/          # useWeather
├── i18n/           # en + hi dictionaries (type-checked parity)
├── services/       # storage, weather (Open-Meteo), notifications
├── store/          # AppStore: local-first data + auth + i18n
├── theme/          # colors / spacing / typography tokens
├── types/          # shared data models
└── utils/          # dates, ₹ formatting, crop growth stages
```

## 5. Next steps (from your task plan)

1. **Sync layer** — wire screens to the backend when you deploy it (same models).
2. **Live mandi feed** — Agmarknet/data.gov.in adapter behind `GET /api/v1/mandi/prices`.
3. **Tests** — unit tests for finance summaries & crop stages; e2e with Maestro/Detox.
4. **More languages** — add Punjabi/Marathi etc. by adding a dictionary file.
5. **Store submission** — icons/splash already branded; add privacy policy + screenshots.
