import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useDetailQuery } from '@/hooks/queries/use-detail-query';

export function useUnreadCount(enabled = true) {
  return useDetailQuery<number>({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const { data } = await api.get<{ data: { count: number } }>(
        endpoints.notifications.unreadCount
      );
      return data.data.count;
    },
    enabled,
    staleTime: 30 * 1000,
  });
}
