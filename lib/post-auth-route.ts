import type { Href } from 'expo-router';

import { routes } from '@/constants/routes';
import type { User } from '@/types/auth.types';
import type { AuthStatus } from '@/types/store.types';

/**
 * Where an authenticated user should land next, based on how far they've
 * gotten through the signup → verify → onboard funnel. `status: null` (auth
 * bootstrap timed out before resolving it) is treated the same as 'ready' so
 * a network blip doesn't trap an otherwise-legitimate session.
 */
export function getPostAuthRoute(status: AuthStatus | null, user: User | null): Href {
  if (status === 'needs_verification' && user) {
    return { pathname: routes.otpChannelExplainer, params: { phone: user.phone } };
  }

  if (status === 'needs_onboarding') {
    return routes.intro;
  }

  return routes.tabsHome;
}
