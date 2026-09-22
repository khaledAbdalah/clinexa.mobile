import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Keyboard } from 'react-native';
import { useForm } from 'react-hook-form';

import { useChangePassword } from '@/hooks/auth/use-change-password';
import { changePasswordSchema, type ChangePasswordInput } from '@/validation/account.validation';

/** Form state + submit handler for the change-password screen. */
export function useChangePasswordForm() {
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', newPasswordConfirmation: '' },
  });

  const { mutate, isPending } = useChangePassword(form.setError);

  const handleSubmit = form.handleSubmit((data) => {
    Keyboard.dismiss();
    mutate(data, {
      onSuccess: () => {
        router.back();
      },
    });
  });

  return {
    form,
    handleSubmit,
    isSubmitting: isPending,
  };
}
