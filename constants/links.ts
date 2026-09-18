/**
 * Public URLs for the legal pages, supplied per environment via `.env`.
 *
 * `EXPO_PUBLIC_*` variables are inlined into the bundle at build time rather than read
 * at runtime, so `process.env.EXPO_PUBLIC_X` must be written out in full — destructuring
 * or dynamic keys are not substituted. Changing a value needs Metro restarted with
 * `pnpm start --clear`.
 */
export const legalLinks = {
  terms: process.env.EXPO_PUBLIC_TERMS_URL ?? '',
  privacy: process.env.EXPO_PUBLIC_PRIVACY_URL ?? '',
} as const;
