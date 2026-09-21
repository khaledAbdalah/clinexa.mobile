import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { useBootStore } from '@/store/boot';

/**
 * Marks the boot entry decision as resolved once the *actual* destination
 * screen (tab bar or welcome) gains focus — not the moment the redirect is
 * merely dispatched. `useEntryRedirect`'s `router.replace()` isn't awaitable,
 * so flipping this from the '/' gate itself races the navigation: the splash
 * can start fading before the destination has actually mounted, exposing the
 * blank gate screen underneath. Gating on the destination's own focus event
 * removes that race entirely, regardless of how long the navigation takes.
 */
export function useMarkEntryResolved() {
  useFocusEffect(
    useCallback(() => {
      useBootStore.getState().markEntryResolved();
    }, [])
  );
}
