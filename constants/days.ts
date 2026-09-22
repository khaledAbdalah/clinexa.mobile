/**
 * Arabic day-of-week names indexed 0=Sunday..6=Saturday, matching the backend's
 * `DoctorWorkingHour.dayOfWeek` convention (`api/app/transformers/doctor_transformer.ts`).
 * Unlike `lib/format-date.ts`'s `formatDayName` (which derives a name from a real
 * date via date-fns), working hours carry only a weekday index with no date attached.
 */
export const WEEKDAY_NAMES = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
] as const;
