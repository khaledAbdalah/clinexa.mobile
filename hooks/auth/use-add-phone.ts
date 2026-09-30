import type { UseFormSetError } from 'react-hook-form';

import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/error-handler';
import { useAuthStore } from '@/store/auth';
import type { AddPhoneRequest, User } from '@/types/auth.types';

/**
 * Saves a phone number on a social account (single step, no OTP) and refreshes
 * the stored user, which re-resolves the auth status (verify / onboard / ready).
 */
export function useAddPhone(setError?: UseFormSetError<AddPhoneRequest>) {
  const { showError } = useToast();

  return useApiMutation<User, AddPhoneRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post<{ data: User }>(endpoints.account.phone, body);
      return data.data;
    },
    onSuccess: async (user) => {
      await useAuthStore.getState().setUser(user);
    },
    // 422 with `errors.phone` is routed to the field by useApiMutation; everything else lands here.
    onError: (error) => {
      if (error.response?.status === 409) {
        showError(error.response.data?.message ?? 'الحساب لديه رقم هاتف بالفعل');
        return;
      }
      showError(getErrorMessage(error));
    },
    setFieldErrors: setError
      ? (field, message) => setError(field as keyof AddPhoneRequest, { type: 'server', message })
      : undefined,
  });
}
