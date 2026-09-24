import { format, isValid } from 'date-fns';
import { arEG } from 'date-fns/locale';

// API dates are an external boundary - a null/malformed value from the server
// (seen in practice on chat messages) must not crash the screen rendering it.
function safeFormat(date: string, pattern: string): string {
  const parsed = new Date(date);
  if (!isValid(parsed)) return '—';
  return format(parsed, pattern, { locale: arEG });
}

export function formatDate(date: string) {
  return safeFormat(date, 'PPP');
}

export function formatDayMonth(date: string) {
  return safeFormat(date, 'd MMMM');
}

export function formatDayName(date: string) {
  return safeFormat(date, 'EEEE');
}

export function formatMonth(date: string) {
  return safeFormat(date, 'LLLL yyyy');
}

export function formatTime(date: string) {
  return safeFormat(date, 'p');
}
