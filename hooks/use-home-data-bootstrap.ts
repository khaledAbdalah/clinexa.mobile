import { useEffect, useState } from 'react';

import { useAuthStore } from '@/store/auth';
import { useBootStore } from '@/store/boot';

const HOME_BOOTSTRAP_TIMEOUT_MS = 10000;

export function useHomeDataBootstrap(enabled: boolean) {
  const homeReady = useBootStore((state) => state.homeReady);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    // Re-runs when `homeReady` flips, so the cleanup below cancels the pending timeout.
    if (!enabled || homeReady) return;

    const { isAuthenticated, status } = useAuthStore.getState();
    const headedToHome =
      isAuthenticated && status !== 'needs_verification' && status !== 'needs_onboarding';

    if (!headedToHome) {
      setSkip(true);
      return;
    }

    // Safety net so a hung request can't trap the app on the splash.
    const timeoutId = setTimeout(() => {
      console.warn(`Home bootstrap timed out after ${HOME_BOOTSTRAP_TIMEOUT_MS}ms; continuing.`);
      setSkip(true);
    }, HOME_BOOTSTRAP_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
  }, [enabled, homeReady]);

  return homeReady || skip;
}
