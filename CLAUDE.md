# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Expo version notice

This app targets **Expo SDK 57**, which changed significantly from earlier SDKs. Before writing any Expo-related code, consult the versioned docs at https://docs.expo.dev/versions/v57.0.0/ rather than relying on general Expo knowledge — see `AGENTS.md`.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`).

- `pnpm start` — start the Expo dev server
- `pnpm ios` / `pnpm android` / `pnpm web` — start on a specific platform
- `pnpm lint` / `pnpm lint:fix` — ESLint (flat config, `eslint-config-expo` + Prettier integration)
- `pnpm format` / `pnpm format:check` — Prettier
- No test suite is currently configured in this repo.

## Architecture

### Routing

File-based routing via **Expo Router**, but the router root is `src/app` (not the top-level `app/`) — check `expo-router` config in `package.json`/`app.json` if this changes. `experiments.typedRoutes` and `experiments.reactCompiler` are enabled in `app.json`.

Navigation shell: `src/app/_layout.tsx` wraps the app in `ThemeProvider` (light/dark from `useColorScheme`), waits on `useLoadFonts()` before hiding the splash screen, and renders `AppTabs` (`src/components/app-tabs.tsx`, with a `.web.tsx` platform variant) inside an `ErrorBoundary`. Portal host and toast renderer are mounted at this top level.

### Styling: NativeWind v5 + react-native-css

Tailwind v4 classes work directly in RN via `nativewind`/`react-native-css`, wired through `metro.config.js` (`withNativewind`, `inlineVariables: false` — required so `PlatformColor` works with CSS variables). Design tokens (colors, radii) live in `src/global.css` as CSS variables under `:root`, consumed via `@theme inline`.

**Do not import RN primitives (`View`, `Text`, `Pressable`, `ScrollView`, `TextInput`, `TouchableHighlight`) directly from `react-native`.** Import the CSS-aware wrappers from `src/tw/index.tsx` instead — they route props through `useCssElement` so `className` works. There's also a CSS-aware `Link` (wraps `expo-router`'s `Link`) and `AnimatedScrollView`/`animated.tsx` for Reanimated. `useCSSVariable` reads a CSS variable, branching by platform (native vs web).

### UI components (shadcn-style)

`src/components/ui/` holds shadcn/ui components ported to RN primitives (`@rn-primitives/*` + `class-variance-authority` + `src/lib/utils.ts`'s `cn()` for `clsx`+`tailwind-merge`). `components.json` configures the shadcn CLI (aliases: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`; base color `neutral`; style `new-york`). Add new primitives with the shadcn CLI rather than writing from scratch, and follow the same `cn()` + CVA variant pattern already in place.

### Data layer: React Query + Axios

- `src/config/api.ts` is a single Axios instance (`api`) with request/response interceptors: attaches the bearer token from `SecureStorage`, and on a 401 (excluding the refresh call itself) queues concurrent requests, refreshes tokens once, then retries. `setUnauthorizedHandler` exists to let `store/auth.ts` register a `forceLogout` callback without a require cycle (`api.ts` can't import `store/auth.ts` directly since auth imports `api`).
- `src/config/react-query.tsx` exports a **module-level** `queryClient` singleton (not created via `useState` in the provider) so non-React code (e.g. logout) can call `queryClient.clear()`/`invalidateQueries()` directly. 401s are not retried by React Query — the axios interceptor already owns retry-after-refresh.
- Data-fetching hooks in `src/hooks/queries/` are thin generic wrappers, never call `api` directly — callers pass a service-layer `queryFn`:
  - `useListQuery` — cursor-paginated lists. Syncs `items`/`nextCursor`/`hasMore` state **during render** (not in an effect) when `data` changes, specifically to avoid a one-frame flash of an empty list on stack screens that remount often — see the comment in `use-list-query.ts` before changing this pattern.
  - `useDetailQuery` — single-resource fetch.
  - `useApiMutation` — wraps `useMutation`, auto-shows toast on success/error, supports `invalidateQueryKeys` and a `setFieldErrors` hook for server-side validation errors.
- API paths are centralized in `src/constants/endpoints.ts`.

### Auth & storage

- `src/store/auth.ts` (Zustand) holds `user`/`isAuthenticated` plus `checkAuth`, `logout` (calls the server, revokes tokens), and `forceLogout` (local-only clear, used by the 401 interceptor path — never calls the auth-protected logout endpoint since the session is already dead).
- Tokens live in `SecureStorage` (`src/config/secure-storage.ts`, native secure storage), general key/value in `src/config/storage.ts` (MMKV via `react-native-mmkv`).
- `src/store/boot.ts` tracks whether the initial auth-redirect has resolved — needed because group-index routes (e.g. `(onboarding)/index`) resolve to `/`, so pathname alone can't tell you if the entry redirect ran yet.
- `src/store/push-token.ts` manages push notification token registration/unregistration against the backend (`expo-notifications`); unregister must run *before* clearing tokens on logout since it needs a valid bearer token.

### Path aliases

`@/*` → `src/*`, `@/assets/*` → `assets/*` (see `tsconfig.json`). Always use these instead of relative `../../` imports.

### Localization / RTL

User-facing strings observed in the codebase (toasts, etc.) are in Arabic — check `useToast()` / existing UI copy for tone/phrasing before adding new user-facing text, and consider RTL layout implications for new screens.
