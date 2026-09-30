/** User dismissed the Google/Apple sheet — not an error worth a toast. */
export class SocialLoginCancelledError extends Error {}

/** Client-side social sign-in failure with a message already fit to show the user (Arabic). */
export class SocialLoginError extends Error {}
