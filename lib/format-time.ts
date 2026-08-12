import { format } from 'date-fns';
import { arEG } from 'date-fns/locale';

export function formatTime(date: string) {
  return format(new Date(date), 'p', { locale: arEG });
}
