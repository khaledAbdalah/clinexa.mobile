import { format } from 'date-fns';
import { arEG } from 'date-fns/locale';

export function formatDate(date: string) {
  return format(new Date(date), 'PPP', { locale: arEG });
}

export function formatDayName(date: string) {
  return format(new Date(date), 'EEEE', { locale: arEG });
}

export function formatMonth(date: string) {
  return format(new Date(date), 'LLLL yyyy', { locale: arEG });
}

export function formatTime(date: string) {
  return format(new Date(date), 'p', { locale: arEG });
}
