import { api } from '@/config/api';
import { SecureStorage } from '@/config/secure-storage';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';
import type { AuthResponse, OtpVerifyBody } from '@/types/auth.types';

/**
 * Verifies a WhatsApp OTP for either `signup_verify` or `password_reset`. Both purposes
 * return a fresh token pair on success, so this always logs the user in.
 */
export function useVerifyOtp() {
  const { showSuccess } = useToast();

  return useApiMutation<AuthResponse['data'], OtpVerifyBody>({
    mutationFn: async (body) => {
      const { data } = await api.post<AuthResponse>(endpoints.auth.otpVerify, body);
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
  });
}
