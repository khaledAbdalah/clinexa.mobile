import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useListQuery } from '@/hooks/queries/use-list-query';
import type { CursorPage } from '@/hooks/queries/types';
import type { AppNotification, NotificationFeedStatus } from '@/types/notification.types';

interface RawNotificationsResponse {
  data: {
    items: AppNotification[];
    pagination: { total: number; nextCursor: string | null; hasMore: boolean };
  };
}

export function useNotifications(status: NotificationFeedStatus = 'all', limit = 20) {
  return useListQuery<AppNotification>({
    queryKey: ['notifications', status],
    queryFn: async (cursor) => {
      const { data } = await api.get<RawNotificationsResponse>(endpoints.notifications.list, {
        params: { status, limit, cursor },
      });
      const page: CursorPage<AppNotification> = {
        data: data.data.items,
        total: data.data.pagination.total,
        nextCursor: data.data.pagination.nextCursor,
        hasMore: data.data.pagination.hasMore,
      };
      return page;
    },
  });
}
