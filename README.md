# Yotuna Web

Web version of **Yotuna** — a radio station aggregator that lets you discover stations worldwide, browse live playlist history, and find songs on streaming services (Spotify, Apple Music, Deezer, Tidal).

**Live**: [yotuna.mobulum.com](https://yotuna.mobulum.com)

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 7 | Build tool & dev server |
| TypeScript | 5.9 | Type safety |
| Tailwind CSS | 4 | Styling (utility-first) |
| Zustand | 5 | State management |
| Apollo Client | 3 | GraphQL data fetching |
| React Router | 7 | Client-side routing |
| i18next | 25 | Internationalization (9 languages) |
| lucide-react | — | Icons |
| date-fns | 4 | Date formatting |
| Vitest | 4 | Test runner |
| React Testing Library | 16 | Component testing |

## Getting Started

### Prerequisites

- Node.js **22+**
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start development server (accessible on LAN)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
# TypeScript check + production build
npm run build

# Preview production build locally
npm run preview
```

### Lint

```bash
npm run lint
```

### Test

```bash
# Run all tests (131 tests, 20 suites)
npm test

# Watch mode
npm run test:watch

# Run a specific test file
npx vitest run src/stores/__tests__/audioStore.test.ts
```

## Features

- **Live radio streaming** — HTML5 Audio API with play/pause/buffering states
- **Station discovery** — Search and browse stations with infinite scroll pagination
- **Playlist history** — View what was played on each station, day by day
- **Streaming deep links** — Open any track on Spotify, Apple Music, Deezer, or Tidal
- **Favorites** — Save stations for quick access (persisted in localStorage)
- **Dark/Light/System theme** — Class-based dark mode with Tailwind CSS v4
- **9 languages** — English, Polish, German, French, Spanish, Arabic (RTL), Chinese, Hindi, Japanese
- **Timezone support** — View playlist times in your preferred timezone
- **Responsive design** — Desktop-first layout that works on all screen sizes
- **GDPR consent** — Cookie/analytics consent modal

## Project Structure

```
src/
  App.tsx                    # Root: BrowserRouter + lazy-loaded routes
  main.tsx                   # Entry point: theme init, device ID, render
  index.css                  # Tailwind v4, custom theme, animations

  pages/                     # Route pages (lazy-loaded)
    HomePage.tsx             # Station list + search + favorites
    StationPage.tsx          # Station detail + playlist
    SettingsPage.tsx         # Theme, language, timezone, GDPR
    AboutPage.tsx            # App info, Discord, app stores
    PrivacyPage.tsx          # Privacy policy
    NotFoundPage.tsx         # 404

  components/
    layout/                  # Shell: Layout, Header, Footer, ThemeSwitcher, LanguageSwitcher
    common/                  # SearchBar, PlayButton, AudioPlayerBar, Toast, GDPRModal, PageLoader
    station/                 # StationCard, StationImage, StationList, FavoriteButton, SocialLinks
    playlist/                # PlaylistItem, PlaylistImage, DayTabs, StreamingButtons

  stores/                    # Zustand stores (6 stores, barrel in index.ts)
  graphql/                   # GraphQL query definitions
  services/                  # Apollo Client setup
  analytics/                 # Event tracking (console in dev, placeholder for production)
  hooks/                     # Custom hooks (useToast)
  i18n/                      # i18next config + 9 locale JSON files
  constants/                 # App settings (version, URLs, limits)
  types/                     # Shared TypeScript interfaces
  utils/                     # Date formatting utilities
```

## Routes

| Path | Page | Description |
|---|---|---|
| `/` | Home | Station list with search and favorites tabs |
| `/station/:id` | Station | Station detail with playlist history |
| `/settings` | Settings | Theme, language, timezone, GDPR consent |
| `/about` | About | Features, tech stack, Discord, mobile apps |
| `/privacy` | Privacy | Privacy policy |
| `*` | Not Found | 404 page |

## GraphQL API

Connects to `https://api.yotuna.com/graphql` with the following queries:

| Query | Purpose |
|---|---|
| `GetStations` | Search and paginate all stations |
| `GetFavoriteStations` | Fetch stations by IDs (for favorites) |
| `GetStationPlaylist` | Get playlist entries for a station and date range |
| `GetAppConfig` | Fetch app configuration (limits, URLs, feature flags) |

Custom headers sent with every request:
- `x-device-id` — Generated UUID, persisted in localStorage
- `x-app-version` — Current app version (`1.0.7`)

## Deployment

Automatically deployed to **GitHub Pages** on every push to `main`.

### How it works

1. GitHub Actions workflow (`.github/workflows/deploy.yml`) triggers on push to `main`
2. Installs dependencies (`npm ci`), builds (`npm run build`)
3. Uploads `dist/` to GitHub Pages
4. Custom domain `yotuna.mobulum.com` configured via `public/CNAME`

### DNS Setup

Point your custom domain to GitHub Pages:
- CNAME record: `yotuna.mobulum.com` -> `<username>.github.io`

### SPA Routing on GitHub Pages

GitHub Pages doesn't support client-side routing natively. The `public/404.html` file handles this by redirecting all 404s back to `index.html` with the original path preserved as a query parameter, which React Router then resolves.

### Manual Deploy

No manual steps needed — just push to `main`. To test the build locally:

```bash
npm run build
npm run preview
```

## State Management

All client-side state is managed with Zustand and persisted to localStorage:

| localStorage Key | Store | Data |
|---|---|---|
| `yotuna-theme` | settingsStore | `"light"` / `"dark"` / `"system"` |
| `yotuna-timezone` | settingsStore | Timezone string (e.g. `"Europe/Warsaw"`) |
| `yotuna-language` | i18n | Language code (e.g. `"en"`, `"pl"`) |
| `yotuna-favorites` | favoritesStore | Array of `{ id, timestamp }` |
| `yotuna-consent` | consentStore | `true` / `false` |
| `yotuna-config` | configStore | App config JSON from API |
| `yotuna-device-id` | deviceStore | UUID |

## Analytics

Full analytics infrastructure is built (events, tracker, hooks) but **not connected to a real service**.

- **Development**: Colored console logs for all tracked events
- **Production**: Console calls stripped by esbuild; `sendToAnalyticsService()` is a placeholder ready for Amplitude, Google Analytics, Plausible, or PostHog

## Internationalization

9 languages supported with automatic detection (localStorage > browser > HTML lang):

| Code | Language | Direction |
|---|---|---|
| `en` | English | LTR |
| `pl` | Polish | LTR |
| `de` | German | LTR |
| `fr` | French | LTR |
| `es` | Spanish | LTR |
| `ar` | Arabic | **RTL** |
| `zh` | Chinese | LTR |
| `hi` | Hindi | LTR |
| `ja` | Japanese | LTR |

## License

MIT — Copyright (c) 2026 mobulum.com. See [LICENSE](LICENSE).
