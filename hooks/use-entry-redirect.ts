import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { routes } from '@/constants/routes';
import { useAuthStore } from '@/store/auth';
import { useBootStore } from '@/store/boot';

/**
 * Runs once the welcome screen ('/') mounts. By then `useAppBootstrap`'s
 * `checkAuth()` has already resolved, so an already-authenticated user is
 * bounced straight to the tab bar instead of seeing the welcome screen flash.
 */
export function useEntryRedirect() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(routes.tabsHome);
    }
    useBootStore.getState().markEntryResolved();
  }, [isAuthenticated, router]);
}
