import * as z from 'zod';

const MAX_IMAGES = 5;

export const reportProblemSchema = z.object({
  title: z
    .string()
    .min(1, 'عنوان المشكلة مطلوب')
    .max(255, 'عنوان المشكلة يجب ألا يتجاوز 255 حرفًا'),
  description: z
    .string()
    .min(10, 'وصف المشكلة يجب أن يكون 10 أحرف على الأقل')
    .min(1, 'وصف المشكلة مطلوب'),
  images: z
    .array(
      z.object({
        uri: z.string(),
        name: z.string(),
        type: z.string(),
      })
    )
    .max(MAX_IMAGES, 'يمكنك إرفاق 5 صور كحد أقصى'),
});

export type ReportProblemInput = z.infer<typeof reportProblemSchema>;
