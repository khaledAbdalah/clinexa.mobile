import type { routes } from '@/constants/routes';

/**
 * Single source of truth for onboarding step order/count. Screens render
 * their step indicator by their own key here (see
 * components/onboarding/step-indicator.tsx) instead of hardcoding their own
 * TOTAL_STEPS/CURRENT_STEP, so inserting, removing, or reordering a step
 * can't silently desync the number shown to the user — `satisfies` also
 * keeps this list in sync with `routes` at compile time.
 */
export const ONBOARDING_STEPS = [
  'onboardingPersonalDetails',
  'onboardingMedicalInfo',
  'onboardingMedicalHistory',
] as const satisfies readonly (keyof typeof routes)[];

export type OnboardingStepRoute = (typeof ONBOARDING_STEPS)[number];

export const ONBOARDING_TOTAL_STEPS = ONBOARDING_STEPS.length;

export function getOnboardingStepNumber(route: OnboardingStepRoute): number {
  return ONBOARDING_STEPS.indexOf(route) + 1;
}
