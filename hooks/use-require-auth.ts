import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';

import { routes } from '@/constants/routes';
import { useAuthStore } from '@/store/auth';

/**
 * Guards a protected screen/layout: redirects to the welcome screen whenever
 * an unauthenticated user brings it into focus (initial mount, or navigating
 * back into it after logging out elsewhere) — unlike `useEntryRedirect`,
 * which only handles the already-authenticated case on the welcome screen.
 */
export function useRequireAuth() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        router.replace(routes.home);
      }
    }, [isAuthenticated, router])
  );
}
