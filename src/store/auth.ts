import { create } from 'zustand';
import { api, setUnauthorizedHandler } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { queryClient } from '@/config/react-query';
import { SecureStorage } from '@/config/secure-storage';
import { usePushTokenStore } from '@/store/push-token';
import { useToast } from '@/hooks/use-toast';
import type { AuthState } from '@/types/store.types';
import type { User } from '@/types/auth.types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: true });
    // Refetch everything currently mounted so screens picked up while browsing
    // as a guest (or as a previous account) reflect this user's data.
    queryClient.invalidateQueries();
  },

  // User-initiated logout: session is still valid, so the server call can succeed
  // and actually revoke the tokens.
  logout: async () => {
    try {
      // Must happen before SecureStorage.clearTokens() below — unregistering
      // needs a still-valid bearer token to authenticate the request.
      await usePushTokenStore.getState().unregister();
      await api.post(endpoints.account.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await SecureStorage.clearTokens();
      set({ user: null, isAuthenticated: false });
      // Drop cached server state (patients, appointments, ...) so the next
      // account to sign in on this device never sees data left over from this session.
      queryClient.clear();

      // Navigation is left to the caller / route guards so it doesn't compete with them.
      // eslint-disable-next-line react-hooks/rules-of-hooks -- useToast wraps Toast.show with no React hooks internally
      useToast().showSuccess('تم تسجيل الخروج بنجاح');
    }
  },

  // Forced logout from the 401/refresh-failure path: the session is already invalid,
  // so hitting the auth-protected /auth/logout endpoint would only fail every time
  // and spam the console — just clear local state instead (mirrors the desktop app).
  forceLogout: async () => {
    // Session's already invalid, so skip the authenticated unregister call —
    // just drop the local record (mirrors why /auth/logout is skipped above).
    usePushTokenStore.getState().clearLocal();
    await SecureStorage.clearTokens();
    set({ user: null, isAuthenticated: false });
    queryClient.clear();
  },

  checkAuth: async () => {
    try {
      const token = await SecureStorage.getAccessToken();
      if (!token) {
        set({ isAuthenticated: false, user: null });
        return;
      }

      const res = await api.get<{ data: User }>(endpoints.account.profile);
      set({ user: res.data.data, isAuthenticated: true });
    } catch (error) {
      console.error('Auth check failed:', error);
      await SecureStorage.clearTokens();
      set({ isAuthenticated: false, user: null });
    }
  },
}));

setUnauthorizedHandler(() => useAuthStore.getState().forceLogout());
