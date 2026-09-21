import type { UseFormSetError } from 'react-hook-form';

import { api } from '@/config/api';
import { SecureStorage } from '@/config/secure-storage';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import { useAuthStore } from '@/store/auth';
import type { AuthResponse, SignupRequest } from '@/types/auth.types';

export function useSignup(setError?: UseFormSetError<SignupRequest>) {
  return useApiMutation<AuthResponse['data'], SignupRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post<AuthResponse>(endpoints.auth.signup, body);
      return data.data;
    },
    onSuccess: async ({ user, access, refresh }) => {
      await SecureStorage.setAccessToken(access);
      await SecureStorage.setRefreshToken(refresh);
      await useAuthStore.getState().setUser(user);
    },
    setFieldErrors: setError
      ? (field, message) => setError(field as keyof SignupRequest, { type: 'server', message })
      : undefined,
  });
}
