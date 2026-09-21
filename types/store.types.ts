import type { User } from './auth.types';

// Auth Store

/**
 * Where an authenticated user stands relative to the signup → verify →
 * onboard funnel. `null` while this hasn't been resolved yet (or resolution
 * failed) — callers should treat that the same as 'ready' to avoid trapping
 * a legitimately authenticated user behind a network blip.
 */
export type AuthStatus = 'needs_verification' | 'needs_onboarding' | 'ready';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: AuthStatus | null;

  // Actions
  logout: () => Promise<void>;
  forceLogout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
}

// Push Token Store
export interface PushTokenState {
  token: string | null;
  register: () => Promise<void>;
  /** Unregisters the token from the backend (needs a still-valid bearer token). */
  unregister: () => Promise<void>;
  /** Drops the locally-remembered token without calling the backend. */
  clearLocal: () => void;
}

// Settings Store
export type SettingType = 'BOOLEAN' | 'TEXT' | 'LONG_TEXT' | 'JSON';

export interface Setting {
  id: string;
  title: string;
  key: string;
  group: string;
  type: SettingType;
  value: string | boolean | string[] | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface SettingsState {
  settings: Record<string, string | boolean | string[] | null>;
  loading: boolean;
  get: (key: string) => string | boolean | string[] | null | undefined;
  /** A setting is considered enabled unless its value is explicitly `false`. */
  isEnabled: (key: string) => boolean;
  fetchSettings: () => Promise<void>;
}
