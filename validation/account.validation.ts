import * as z from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
  .max(32, 'كلمة المرور يجب ألا تتجاوز 32 حرفًا');

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
    newPassword: passwordSchema,
    newPasswordConfirmation: passwordSchema,
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['newPasswordConfirmation'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const deleteAccountSchema = z.object({
  type: z.enum(['temporary', 'permanent']),
  password: z.string().min(1, 'كلمة المرور مطلوبة لتأكيد الحذف'),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
