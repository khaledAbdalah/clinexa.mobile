import * as z from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
  .max(32, 'كلمة المرور يجب ألا تتجاوز 32 حرفًا');

export const resetPasswordFieldsSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['passwordConfirmation'],
  });

export type ResetPasswordFieldsInput = z.infer<typeof resetPasswordFieldsSchema>;
