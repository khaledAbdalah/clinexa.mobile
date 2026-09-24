import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import { useAuthStore } from '@/store/auth';
import { usePushTokenStore } from '@/store/push-token';

// Without this, a notification that arrives while the app is in the
// foreground is delivered silently — no banner, no sound — on both platforms.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Unlike the socket connection hooks, there's no "else: unregister()" branch here —
 * unregistering needs a still-valid bearer token, so it's done synchronously inside
 * store/auth.ts's `logout` (before tokens are cleared) instead of reactively here.
 */
export function usePushTokenRegistration(isReady: boolean) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const register = usePushTokenStore((state) => state.register);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      register();
    }
  }, [isReady, isAuthenticated, register]);
}
