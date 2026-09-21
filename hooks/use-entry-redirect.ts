import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';

import { routes } from '@/constants/routes';
import { getPostAuthRoute } from '@/lib/post-auth-route';
import { useAuthStore } from '@/store/auth';

export function useEntryRedirect() {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const { isAuthenticated, user, status } = useAuthStore.getState();

      if (!isAuthenticated) {
        router.replace(routes.welcome);
        return;
      }

      router.replace(getPostAuthRoute(status, user));
    }, [router])
  );
}
