import type { UseFormSetError } from 'react-hook-form';

import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import type { OtpRequestBody, OtpRequestResponse } from '@/types/auth.types';

interface UseRequestOtpOptions {
  setError?: UseFormSetError<OtpRequestBody>;
}

/** Requests an OTP (signup verification or password reset) over whichever channel the tenant has configured. */
export function useRequestOtp({ setError }: UseRequestOtpOptions = {}) {
  return useApiMutation<OtpRequestResponse, OtpRequestBody>({
    mutationFn: async (body) => {
      const { data } = await api.post(endpoints.auth.otpRequest, body);
      return data;
    },
    setFieldErrors: setError
      ? (field, message) => setError(field as keyof OtpRequestBody, { type: 'server', message })
      : undefined,
  });
}
