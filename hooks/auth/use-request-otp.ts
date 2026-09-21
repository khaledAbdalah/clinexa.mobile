import type { AxiosError } from 'axios';
import type { UseFormSetError } from 'react-hook-form';

import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/error-handler';
import type { ApiError, OtpRequestBody } from '@/types/auth.types';

/** Exact message OtpService.request() throws when a tenant's `otpEnabled` config is off. */
export const OTP_DISABLED_MESSAGE = 'إرسال رمز التحقق عبر واتساب غير مفعل لهذه العيادة';

interface UseRequestOtpOptions {
  setError?: UseFormSetError<OtpRequestBody>;
  /** Called instead of the default error toast when OTP is disabled for this clinic. */
  onOtpDisabled?: () => void;
}

/** Sends a WhatsApp OTP for either signup verification or password reset. */
export function useRequestOtp({ setError, onOtpDisabled }: UseRequestOtpOptions = {}) {
  const { showError } = useToast();

  return useApiMutation<{ message: string }, OtpRequestBody>({
    mutationFn: async (body) => {
      const { data } = await api.post(endpoints.auth.otpRequest, body);
      return data;
    },
    setFieldErrors: setError
      ? (field, message) => setError(field as keyof OtpRequestBody, { type: 'server', message })
      : undefined,
    onError: onOtpDisabled
      ? (error: AxiosError<ApiError>) => {
          if (error.response?.data?.message === OTP_DISABLED_MESSAGE) {
            onOtpDisabled();
            return;
          }
          showError(getErrorMessage(error));
        }
      : undefined,
  });
}
