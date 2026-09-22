import type { UseFormSetError } from 'react-hook-form';

import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import type { ChangePasswordRequest } from '@/types/auth.types';

/** Changes the current user's password. Session stays alive — no logout/redirect needed after success. */
export function useChangePassword(setError?: UseFormSetError<ChangePasswordRequest>) {
  return useApiMutation<{ message: string }, ChangePasswordRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post(endpoints.account.changePassword, body);
      return data;
    },
    successMessage: 'تم تغيير كلمة المرور بنجاح',
    setFieldErrors: setError
      ? (field, message) =>
          setError(field as keyof ChangePasswordRequest, { type: 'server', message })
      : undefined,
  });
}
