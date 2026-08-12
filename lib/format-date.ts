import { format } from 'date-fns';
import { arEG } from 'date-fns/locale';

export function formatDate(date: string) {
  return format(new Date(date), 'PPP', { locale: arEG });
}
