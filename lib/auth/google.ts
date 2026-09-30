import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { SocialLoginCancelledError, SocialLoginError } from '@/lib/auth/social-errors';

// Same env var names as the LMS app.
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '';
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';

export const isGoogleConfigured = GOOGLE_WEB_CLIENT_ID.length > 0;

/**
 * Runs the native Google sign-in sheet and returns a Google *access token* —
 * that's what the API's `POST /auth/google` verifies (ally `userFromToken`).
 */
export async function getGoogleAccessToken(): Promise<string> {
  if (!isGoogleConfigured) {
    throw new SocialLoginError('تسجيل الدخول بجوجل غير مُفعّل حالياً');
  }

  try {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID || GOOGLE_WEB_CLIENT_ID,
    });
    await GoogleSignin.hasPlayServices();
    // Clears the cached session so the account picker shows up instead of auto-selecting the last account.
    await GoogleSignin.signOut();
    const response = await GoogleSignin.signIn();
    if (response.type === 'cancelled' || !response.data?.idToken) {
      throw new SocialLoginCancelledError();
    }
    const { accessToken } = await GoogleSignin.getTokens();
    return accessToken;
  } catch (error) {
    if (error instanceof SocialLoginCancelledError || error instanceof SocialLoginError) {
      throw error;
    }
    if (isErrorWithCode(error)) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) throw new SocialLoginCancelledError();
      if (error.code === statusCodes.IN_PROGRESS) throw new SocialLoginCancelledError();
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new SocialLoginError('خدمات جوجل بلاي غير متوفرة على هذا الجهاز');
      }
    }
    throw new SocialLoginError('تعذّر تسجيل الدخول بجوجل، حاول مرة أخرى');
  }
}
