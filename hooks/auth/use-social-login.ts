import * as AppleAuthentication from 'expo-apple-authentication';

import { api } from '@/config/api';
import { SecureStorage } from '@/config/secure-storage';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import { useToast } from '@/hooks/use-toast';
import { getGoogleAccessToken } from '@/lib/auth/google';
import { SocialLoginCancelledError, SocialLoginError } from '@/lib/auth/social-errors';
import { getErrorMessage } from '@/lib/error-handler';
import { useAuthStore } from '@/store/auth';
import type { AppleLoginRequest, AuthResponse } from '@/types/auth.types';

type AuthData = AuthResponse['data'];

async function persistSession({ user, access, refresh }: AuthData) {
  await SecureStorage.setAccessToken(access);
  await SecureStorage.setRefreshToken(refresh);
  await useAuthStore.getState().setUser(user);
}

/** Cancelling the native sheet is silent; client errors carry their own Arabic copy; API errors use the server message. */
function useSocialErrorHandler() {
  const { showError } = useToast();
  return (error: unknown) => {
    if (error instanceof SocialLoginCancelledError) return;
    if (error instanceof SocialLoginError) {
      showError(error.message);
      return;
    }
    showError(getErrorMessage(error));
  };
}

export function useGoogleLogin() {
  const handleError = useSocialErrorHandler();

  return useApiMutation<AuthData, void>({
    mutationFn: async () => {
      const token = await getGoogleAccessToken();
      const { data } = await api.post<AuthResponse>(endpoints.auth.google, { token });
      return data.data;
    },
    onSuccess: persistSession,
    onError: handleError,
  });
}

export function useAppleLogin() {
  const handleError = useSocialErrorHandler();

  return useApiMutation<AuthData, void>({
    mutationFn: async () => {
      let credential: AppleAuthentication.AppleAuthenticationCredential;
      try {
        credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
      } catch (error) {
        if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') {
          throw new SocialLoginCancelledError();
        }
        throw new SocialLoginError('تعذّر تسجيل الدخول بآبل، حاول مرة أخرى');
      }
      if (!credential.identityToken) {
        throw new SocialLoginError('تعذّر تسجيل الدخول بآبل، حاول مرة أخرى');
      }

      // Apple only returns the name on the first authorization, separately from the token.
      const name = [credential.fullName?.givenName, credential.fullName?.familyName]
        .filter(Boolean)
        .join(' ');
      const body: AppleLoginRequest = {
        identityToken: credential.identityToken,
        ...(name ? { fullName: name } : {}),
      };
      const { data } = await api.post<AuthResponse>(endpoints.auth.apple, body);
      return data.data;
    },
    onSuccess: persistSession,
    onError: handleError,
  });
}
