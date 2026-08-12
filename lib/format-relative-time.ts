import { formatDistanceToNow } from 'date-fns';
import { arEG } from 'date-fns/locale';

export function formatRelativeTime(date: string) {
  return formatDistanceToNow(new Date(date), {
    locale: arEG,
    addSuffix: true,
  });
}
