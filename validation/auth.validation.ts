import * as z from 'zod';

const phoneSchema = z
  .string()
  .min(1, 'رقم الهاتف مطلوب')
  .regex(/^01[0125][0-9]{8}$/, 'رقم الهاتف غير صحيح');

const passwordSchema = z
  .string()
  .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
  .max(32, 'كلمة المرور يجب ألا تتجاوز 32 حرفًا');

export const signupSchema = z
  .object({
    fullName: z.string().min(1, 'الاسم بالكامل مطلوب'),
    phone: phoneSchema,
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['passwordConfirmation'],
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  phone: phoneSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
