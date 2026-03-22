# AGENTS.md — Yotuna Web

## Project Overview

Web version of the Yotuna radio station aggregator, built with **React 19**, **Vite 7**, **Tailwind CSS v4**.
Hosted on GitHub Pages at `yotuna.mobulum.com`. 

Uses React Router for client-side routing, Apollo Client for GraphQL, Zustand for state management,
and i18next for internationalization (9 languages).

## Build & Run Commands

```bash
# Install dependencies
npm install

# Start dev server (accessible on LAN via --host)
npm run dev                  # vite --host

# Production build (TypeSc  ript check + Vite bundle)
npm run build                # tsc -b && vite build

# Preview production build locally
npm run preview              # vite preview

# Lint
npm run lint                 # eslint .

# Run all tests
npm test                     # vitest run

# Run tests in watch mode
npm run test:watch           # vitest
```

## Deployment

Auto-deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.

- **Custom domain**: `yotuna.mobulum.com` (configured via `public/CNAME`)
- **Base path**: `/` (configured in `vite.config.ts`)
- **SPA routing**: `public/404.html` handles GitHub Pages SPA redirect for client-side routes
- **Node version**: 22 (in CI)
- **Build artifact**: `dist/` directory uploaded to GitHub Pages

No environment variables or secrets are required for build/deploy.

## Project Structure

```
src/
  App.tsx                     # Root component: BrowserRouter + lazy-loaded routes
  main.tsx                    # Entry point: initializes theme, device ID, renders App
  index.css                   # Tailwind v4 imports, custom theme colors, animations
  vite-env.d.ts               # Vite client type declarations

  pages/                      # Route pages (lazy-loaded via React.lazy)
    HomePage.tsx              # Station list + search + favorites tabs + infinite scroll
    StationPage.tsx           # Station detail + playlist history with day tabs
    SettingsPage.tsx          # Theme, language, timezone, GDPR consent
    AboutPage.tsx             # Features, tech stack, Discord, app stores, device ID
    PrivacyPage.tsx           # Privacy policy sections
    NotFoundPage.tsx          # 404 page

  components/
    layout/                   # Layout shell
      Layout.tsx              # Header + <Outlet /> + Footer
      Header.tsx              # Navigation, ThemeSwitcher, LanguageSwitcher
      Footer.tsx              # Copyright, links
      ThemeSwitcher.tsx       # Light/dark/system toggle buttons
      LanguageSwitcher.tsx    # Language dropdown
      index.ts                # Barrel export
    common/                   # Reusable UI components
      SearchBar.tsx           # Search input with clear button
      PlayButton.tsx          # Audio play/pause/buffering button
      AudioPlayerBar.tsx      # Fixed bottom audio player bar
      Toast.tsx               # Toast notification overlay
      GDPRModal.tsx           # GDPR consent modal
      PageLoader.tsx          # Spinner loader
      index.ts                # Barrel export
    station/                  # Station-related components
      StationCard.tsx         # Station card with image, name, genres, play/favorite
      StationImage.tsx        # Station image with letter fallback
      StationList.tsx         # Grid of StationCards with loading/empty states
      FavoriteButton.tsx      # Heart toggle button
      SocialLinks.tsx         # Facebook/Twitter/Instagram/website links
      index.ts                # Barrel export
    playlist/                 # Playlist components
      PlaylistItem.tsx        # Single track row with copy-to-clipboard
      PlaylistImage.tsx       # Track image with music icon fallback
      DayTabs.tsx             # Horizontal scrollable day selector
      StreamingButtons.tsx    # Deezer/Spotify/Tidal/Apple Music buttons
      index.ts                # Barrel export

  stores/                     # Zustand state management
    settingsStore.ts          # Theme, timezone, language (persisted to localStorage)
    audioStore.ts             # Audio playback state (ephemeral, not persisted)
    favoritesStore.ts         # Favorite stations (persisted to localStorage)
    consentStore.ts           # GDPR consent (persisted to localStorage)
    configStore.ts            # App config from API (persisted to localStorage)
    deviceStore.ts            # Device UUID (persisted to localStorage)
    index.ts                  # Barrel export

  graphql/
    queries.ts                # GraphQL query definitions (gql tagged templates)

  services/
    apolloClient.ts           # Apollo Client setup with error/auth links, cache policies

  analytics/
    events.ts                 # AnalyticsEvents constants (SCREAMING_SNAKE)
    tracker.ts                # AnalyticsTracker class + useTracker hook
    index.ts                  # Barrel export

  hooks/
    useToast.ts               # Toast show/hide/auto-dismiss hook

  i18n/
    index.ts                  # i18next initialization, language detection, RTL support
    locales/                  # Translation JSON files
      en.json, pl.json, ar.json, zh.json, es.json,
      hi.json, ja.json, fr.json, de.json

  constants/
    app.ts                    # App settings (version, limits, URLs, store IDs)

  types/
    index.ts                  # Shared TypeScript interfaces (Station, PlaylistTrack, AppConfig, etc.)

  utils/
    dates.ts                  # Date formatting utilities (getDateLocale, formatPlaylistTime, etc.)

  test/
    setup.ts                  # Vitest setup: jest-dom matchers, jsdom mocks

  __tests__/App.test.tsx                         # App routing tests
  pages/__tests__/*.test.tsx                     # Page-level tests
  components/__tests__/*.test.tsx                # Component tests
  stores/__tests__/*.test.ts                     # Store tests
  hooks/__tests__/*.test.ts                      # Hook tests
  analytics/__tests__/*.test.ts                  # Analytics tests
  utils/__tests__/*.test.ts                      # Utility tests

public/
  CNAME                       # Custom domain for GitHub Pages
  404.html                    # SPA redirect for GitHub Pages
```

## Testing

Uses **Vitest 4** + **React Testing Library 16** + **jsdom 28**.

```bash
# Run all tests (131 tests across 20 suites)
npm test                     # vitest run

# Run tests in watch mode
npm run test:watch           # vitest

# Run a specific test file
npx vitest run src/stores/__tests__/audioStore.test.ts

# Run tests matching a pattern
npx vitest run --grep "StationPage"
```

### Test file location

Tests are co-located in `__tests__/` directories next to the code they test:

```
src/stores/__tests__/audioStore.test.ts
src/components/__tests__/station.test.tsx
src/pages/__tests__/HomePage.test.tsx
```

### Test setup (`src/test/setup.ts`)

Mocks for jsdom-missing APIs:
- `window.matchMedia`
- `IntersectionObserver`
- `navigator.clipboard` (configurable, so `@testing-library/user-event` can override)
- `HTMLMediaElement.play/pause/load`
- `Element.prototype.scrollIntoView`

### Test configuration

- `vite.config.ts` contains the `test` block: `globals: true`, `environment: "jsdom"`, `css: false`
- `tsconfig.app.json` excludes test files from production builds: `"exclude": ["src/**/*.test.ts", "src/**/*.test.tsx", "src/test"]`
- Vitest resolves `@/` path alias via Vite's `resolve.alias` config

### Common test patterns

- **Mock `@/i18n`** to prevent real i18next initialization (which calls `initReactI18next`)
- **Mock `react-i18next`** with `useTranslation` returning `{ t: key => key, i18n: { language: "en" } }` and `initReactI18next` export
- **Mock `@/analytics`** with `tracker: { trackEvent: vi.fn(), trackPageView: vi.fn() }`
- **Mock `@apollo/client`** `useQuery` for page tests that fetch GraphQL data
- **Dynamic imports** for page tests: `const { default: Page } = await import("@/pages/Page")`
- **Zustand state reset** in `beforeEach` with `useStore.setState({ ... })`

## Code Style & Formatting

**Prettier** (`.prettierrc.json`):
- Print width: **180** (wide lines are intentional)
- Double quotes (`"singleQuote": false`)
- Semicolons: always
- Trailing commas: all (`"trailingComma": "all"`)
- Arrow parens: avoid (`"arrowParens": "avoid"`)
- Indent: 2 spaces

**ESLint**: TypeScript-ESLint + react-hooks + react-refresh plugins. Ignores `dist/`.

## TypeScript

- **Strict mode enabled** (`"strict": true`)
- Target: ES2022
- Module resolution: bundler
- Path alias: `@/` maps to `src/`
- Prefer `interface` for object shapes (props, state, API responses)
- Use `type` only for unions (e.g., `type Theme = "light" | "dark" | "system"`)
- No enums — use string union types or `as const` objects
- Shared types in `src/types/index.ts` (barrel export)
- Props interfaces defined in the same file as the component

## Naming Conventions

| Category           | Convention         | Example                                |
|--------------------|--------------------|----------------------------------------|
| Components         | `PascalCase.tsx`   | `StationCard.tsx`, `PlayButton.tsx`    |
| Pages              | `PascalCase.tsx`   | `HomePage.tsx`, `StationPage.tsx`      |
| Hooks              | `camelCase.ts`     | `useToast.ts`                          |
| Stores             | `camelCase.ts`     | `audioStore.ts`, `settingsStore.ts`    |
| GraphQL            | `camelCase.ts`     | `queries.ts`                           |
| Utilities          | `camelCase.ts`     | `dates.ts`                             |
| Constants          | `camelCase.ts`     | `app.ts`                               |
| Test files         | `*.test.{ts,tsx}`  | `audioStore.test.ts`, `station.test.tsx`|
| GraphQL constants  | `SCREAMING_SNAKE`  | `GET_STATIONS`, `GET_APP_CONFIG`       |
| Analytics events   | `SCREAMING_SNAKE`  | `AnalyticsEvents.AUDIO_PLAY`          |
| Store hooks        | `use[Domain]Store` | `useAudioStore`, `useSettingsStore`    |
| Components/types   | `PascalCase`       | `Station`, `PlaylistTrack`             |
| Functions/vars     | `camelCase`        | `playAudio`, `formatDayLabel`          |

## Component Patterns

- **Functional components only** with `export default function` declarations (not arrow functions):
  ```tsx
  export default function StationCard({ station }: StationCardProps) { ... }
  ```
- Styles via Tailwind CSS v4 utility classes — no CSS modules, no styled-components
- Dark mode via `@custom-variant dark (&:where(.dark, .dark *))` — class-based toggling on `<html>`
- Custom theme colors defined in `src/index.css` under `@theme { }` (primary, accent palettes)
- Icons from `lucide-react`
- `testID` not used (web project uses standard DOM queries in tests)

## Import Patterns

- **Path alias**: `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`)
- Import stores from barrel: `import { useAudioStore } from "@/stores"`
- Import components directly by file path or from barrel: `import StationCard from "@/components/station/StationCard"`
- Import GraphQL queries directly: `import { GET_STATIONS } from "@/graphql/queries"`
- Import types from barrel: `import type { Station } from "@/types"`

## State Management (Zustand 5)

- Stores in `src/stores/` with manual `localStorage` persistence (no middleware)
- Created with `create<StateInterface>()`
- State and actions co-located in a single store object
- Ephemeral stores (no persistence): `audioStore`
- Persisted stores: `settingsStore`, `favoritesStore`, `consentStore`, `configStore`, `deviceStore`
- Cross-store access: `useConfigStore.getState()` for non-reactive reads outside React
- All stores re-exported from `src/stores/index.ts` barrel

### localStorage keys

| Key                | Store           | Data                           |
|--------------------|-----------------|--------------------------------|
| `yotuna-theme`     | settingsStore   | `"light"` / `"dark"` / `"system"` |
| `yotuna-timezone`  | settingsStore   | Timezone string                |
| `yotuna-language`  | i18n detector   | Language code                  |
| `yotuna-favorites` | favoritesStore  | JSON array of `{ id, timestamp }` |
| `yotuna-consent`   | consentStore    | `true` / `false` / removed     |
| `yotuna-config`    | configStore     | JSON `AppConfig` object        |
| `yotuna-device-id` | deviceStore     | UUID string                    |

## GraphQL

- API endpoint: `https://api.yotuna.com/graphql`
- 4 queries: `GetStations`, `GetFavoriteStations`, `GetStationPlaylist`, `GetAppConfig`
- No mutations, no subscriptions (on web)
- Custom headers: `x-device-id` (UUID), `x-app-version` (currently `"1.0.7"`)
- `InMemoryCache` with merge policy for `getStations` (offset-based pagination)
- No codegen — types are manually maintained in `src/types/index.ts`

## Analytics

Full analytics infrastructure built but **not connected to a real service yet**.

- `AnalyticsEvents` constants in `src/analytics/events.ts`
- `AnalyticsTracker` class in `src/analytics/tracker.ts`
- In development: verbose `console.log` with colored prefixes
- In production: `console.log/info/debug/trace` stripped by esbuild `pure` config
- `sendToAnalyticsService()` is a placeholder for Amplitude/GA4/Plausible/PostHog

## i18n

- 9 languages: en, pl, ar, zh, es, hi, ja, fr, de
- Arabic (`ar`) is RTL — handled by `updateDocumentDirection()` setting `dir` attribute on `<html>`
- Uses `i18next` + `react-i18next` + `i18next-browser-languagedetector`
- Detection order: `localStorage` > `navigator` > `htmlTag`
- Translations in `src/i18n/locales/*.json`
- Date formatting via `date-fns` with locale support (`src/utils/dates.ts`)

## Web Routes

| Path            | Component      | Description                              |
|-----------------|----------------|------------------------------------------|
| `/`             | `HomePage`     | Station list + search + favorites tabs   |
| `/station/:id`  | `StationPage`  | Station detail + playlist history        |
| `/settings`     | `SettingsPage` | Theme, language, timezone, GDPR consent  |
| `/about`        | `AboutPage`    | Features, tech stack, Discord, app stores|
| `/privacy`      | `PrivacyPage`  | Privacy policy                           |
| `*`             | `NotFoundPage` | 404                                      |

## Streaming Service Deep Links

- **Deezer**: `https://www.deezer.com/track/${deezerTrackId}` (brand color: `#EF5466`)
- **Tidal**: `https://tidal.com/browse/track/${tidalTrackId}` (brand color: `#000000`)
- **Spotify**: `https://open.spotify.com/track/${spotifyTrackId}` (brand color: `#1DB954`)
- **Apple Music**: `https://music.apple.com/song/${appleTrackId}` (brand color: `#FA243C`)

## Error Handling

- Apollo error link: global GraphQL/network error logging
- Component-level try/catch for async operations (audio playback, clipboard)
- Console errors in development, stripped in production
- GDPR modal blocks interaction until consent is given
