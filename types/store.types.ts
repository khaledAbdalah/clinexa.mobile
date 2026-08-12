import type { User } from './auth.types';

// Auth Store
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  logout: () => Promise<void>;
  forceLogout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
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
