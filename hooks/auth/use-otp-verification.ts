import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRequestOtp } from '@/hooks/auth/use-request-otp';
import { useVerifyOtp } from '@/hooks/auth/use-verify-otp';
import { getPostAuthRoute } from '@/lib/post-auth-route';
import { useAuthStore } from '@/store/auth';
import type { OtpChannel, OtpPurpose } from '@/types/auth.types';
import {
  resetPasswordFieldsSchema,
  type ResetPasswordFieldsInput,
} from '@/validation/otp.validation';

const RESEND_COOLDOWN_SECONDS = 45;

export function formatCountdown(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

/** Countdown, resend, and code-verification logic for the OTP screen (signup or password reset). */
export function useOtpVerification() {
  const params = useLocalSearchParams<{
    phone: string;
    purpose: OtpPurpose;
    channel?: OtpChannel;
    maskedEmail?: string;
  }>();
  const { phone, purpose } = params;
  // Seeded from the request that opened this screen; refreshed on resend in case the clinic switched channels.
  const [delivery, setDelivery] = useState<{ channel?: OtpChannel; maskedEmail?: string | null }>({
    channel: params.channel,
    maskedEmail: params.maskedEmail,
  });
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  const isPasswordReset = purpose === 'password_reset';

  const {
    control,
    handleSubmit,
    formState: { isValid: isPasswordFormValid },
  } = useForm<ResetPasswordFieldsInput>({
    resolver: zodResolver(resetPasswordFieldsSchema),
    mode: 'onChange',
    defaultValues: { password: '', passwordConfirmation: '' },
  });

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setInterval(() => setSecondsLeft((seconds) => seconds - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const canResend = secondsLeft === 0;

  const handleResend = () => {
    if (!canResend) return;
    requestOtp.mutate(
      { phone, purpose },
      {
        onSuccess: (response) =>
          setDelivery({ channel: response.channel, maskedEmail: response.maskedEmail }),
      }
    );
    setSecondsLeft(RESEND_COOLDOWN_SECONDS);
  };

  const submitVerify = (passwordFields?: ResetPasswordFieldsInput) => {
    verifyOtp.mutate(
      {
        phone,
        otp: code,
        purpose,
        ...(isPasswordReset && passwordFields
          ? {
              password: passwordFields.password,
              passwordConfirmation: passwordFields.passwordConfirmation,
            }
          : {}),
      },
      {
        onSuccess: () => {
          const { user, status } = useAuthStore.getState();
          const destination = getPostAuthRoute(status, user);

          if (purpose === 'password_reset') {
            router.replace(destination);
          } else {
            router.push(destination);
          }
        },
      }
    );
  };

  const handleConfirm = () => {
    if (isPasswordReset) {
      handleSubmit((values) => submitVerify(values))();
    } else {
      submitVerify();
    }
  };

  const isConfirmDisabled =
    code.length < 6 || (isPasswordReset && !isPasswordFormValid) || verifyOtp.isPending;

  return {
    code,
    setCode,
    secondsLeft,
    canResend,
    handleResend,
    handleConfirm,
    isConfirmDisabled,
    isVerifying: verifyOtp.isPending,
    isPasswordReset,
    channel: delivery.channel,
    maskedEmail: delivery.maskedEmail,
    passwordForm: { control },
  };
}
