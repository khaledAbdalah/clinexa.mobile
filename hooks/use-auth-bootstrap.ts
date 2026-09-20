import { useEffect, useState } from 'react';

import { useAuthStore } from '@/store/auth';

const AUTH_CHECK_TIMEOUT_MS = 8000;

export function useAuthBootstrap() {
  const [authChecked, setAuthChecked] = useState(false);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    let settled = false;
    const timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      console.warn(`Auth bootstrap timed out after ${AUTH_CHECK_TIMEOUT_MS}ms; continuing.`);
      setAuthChecked(true);
    }, AUTH_CHECK_TIMEOUT_MS);

    async function run() {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth bootstrap error:', error);
      } finally {
        clearTimeout(timeoutId);
        if (!settled) {
          settled = true;
          setAuthChecked(true);
        }
      }
    }

    run();

    return () => clearTimeout(timeoutId);
  }, [checkAuth]);

  return authChecked;
}
