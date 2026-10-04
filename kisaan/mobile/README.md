# Kisaan Mobile (Android + iOS)

Expo / React Native + TypeScript app. One codebase → both stores.

## Quick start

```bash
npm install
npx expo start        # scan QR with Expo Go (Android) or Camera (iOS)
```

Other scripts:

```bash
npm run android       # start + open Android emulator
npm run ios           # start + open iOS simulator
npm run web           # run in browser
npm run typecheck     # tsc --noEmit
npx expo export --platform android   # production bundle check
```

## Shipping builds

```bash
eas build -p android --profile preview       # APK for testing
eas build -p android --profile production    # Play Store (AAB)
eas build -p ios --profile production        # App Store
eas submit -p android | eas submit -p ios    # upload to stores
```

## Structure

- `src/app/` — screens (expo-router file routing). `(tabs)` = bottom tab bar.
- `src/store/AppStore.tsx` — local-first data + auth + language (AsyncStorage).
- `src/i18n/` — English & Hindi dictionaries; `hi.ts` is type-checked to have identical keys.
- `src/services/weather.ts` — Open-Meteo current + 7-day forecast with 30-min cache.
- `src/services/notifications.ts` — local reminder notifications (graceful fallback).
- `src/data/` — crop catalog, mandi sample prices, government schemes (bilingual).

## Notes

- App is **offline-first**: register/login and all farm data live on-device.
  The backend (`../backend`) exposes the same models for future sync.
- Notifications on Android require a development build (Expo Go limitation);
  iOS works in Expo Go. Reminders always work inside the app.
- Branding: icon/splash generated for Kisaan (`assets/images/`), theme green `#166534`.
