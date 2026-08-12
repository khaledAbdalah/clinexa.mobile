import { AxiosError } from 'axios';

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // 422s carry the real reason under `errors.<field>[0]` — `data.message` for
    // those is just the generic "Validation failed", so prefer the field error.
    const fieldErrors = error.response?.data?.errors;
    const firstFieldError = fieldErrors && Object.values(fieldErrors).flat()[0];
    if (firstFieldError) return firstFieldError;

    const message = error.response?.data?.message;
    if (message) return message;

    switch (error.response?.status) {
      case 400:
        return 'البيانات المدخلة غير صحيحة';
      case 401:
        return 'انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى';
      case 403:
        return 'غير مصرح لك بهذا الإجراء';
      case 404:
        return 'العنصر غير موجود';
      case 409:
        return 'تعارض في البيانات';
      case 500:
        return 'حدث خطأ في الخادم';
      default:
        return 'حدث خطأ غير متوقع';
    }
  }

  return 'تحقق من اتصالك بالإنترنت';
}
