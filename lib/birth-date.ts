export const MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export function calculateAge(day: number, monthIndex: number, year: number) {
  const today = new Date();
  let age = today.getFullYear() - year;
  const hasHadBirthdayThisYear =
    today.getMonth() > monthIndex || (today.getMonth() === monthIndex && today.getDate() >= day);
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}
