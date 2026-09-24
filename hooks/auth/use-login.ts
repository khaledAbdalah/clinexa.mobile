import type { UseFormSetError } from 'react-hook-form';

import { api } from '@/config/api';
import { SecureStorage } from '@/config/secure-storage';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';
import type { AuthResponse, LoginRequest } from '@/types/auth.types';

export function useLogin(setError?: UseFormSetError<LoginRequest>) {
  const { showSuccess } = useToast();

  return useApiMutation<AuthResponse['data'], LoginRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post<AuthResponse>(endpoints.auth.login, body);
      return data.data;
    },
    onSuccess: async ({ user, access, refresh, restored }) => {
      await SecureStorage.setAccessToken(access);
      await SecureStorage.setRefreshToken(refresh);
      await useAuthStore.getState().setUser(user);
      if (restored) {
        showSuccess('أهلاً بعودتك، تم استرجاع حسابك');
      }
    },
    setFieldErrors: setError
      ? (field, message) => setError(field as keyof LoginRequest, { type: 'server', message })
      : undefined,
  });
}
