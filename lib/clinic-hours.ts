import type { WorkingHoursEntry } from '@/types/settings.types';

// dayOfWeek: 0 (Sunday) through 6 (Saturday) — matches api/app/validators/admin/setting.ts's dayOfWeek().
export const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function formatTimeOfDay(time: string) {
  const [hoursStr, minutesStr] = time.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time;

  const period = hours >= 12 ? 'م' : 'ص';
  const twelveHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${twelveHour}:${String(minutes).padStart(2, '0')} ${period}`;
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export interface ClinicOpenStatus {
  isOpen: boolean;
  label: string;
}

/** Open/closed status for "now" derived from the clinic's working hours, or
 * `null` when no hours are configured (so callers can hide the badge). */
export function getClinicOpenStatus(
  entries: WorkingHoursEntry[],
  now: Date = new Date()
): ClinicOpenStatus | null {
  if (entries.length === 0) return null;

  const byDay = new Map(entries.map((entry) => [entry.dayOfWeek, entry]));
  const today = now.getDay();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const todayEntry = byDay.get(today);
  if (todayEntry) {
    if (nowMinutes >= toMinutes(todayEntry.startsAt) && nowMinutes < toMinutes(todayEntry.endsAt)) {
      return {
        isOpen: true,
        label: `مفتوح دلوقتي · لحد ${formatTimeOfDay(todayEntry.endsAt)}`,
      };
    }
    if (nowMinutes < toMinutes(todayEntry.startsAt)) {
      return {
        isOpen: false,
        label: `مقفول دلوقتي · بنفتح النهارده ${formatTimeOfDay(todayEntry.startsAt)}`,
      };
    }
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const day = (today + offset) % 7;
    const entry = byDay.get(day);
    if (!entry) continue;
    const when = offset === 1 ? 'بكرة' : `يوم ${DAY_NAMES[day]}`;
    return {
      isOpen: false,
      label: `مقفول دلوقتي · بنفتح ${when} ${formatTimeOfDay(entry.startsAt)}`,
    };
  }

  return null;
}
