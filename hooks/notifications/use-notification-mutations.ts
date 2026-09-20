import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';

// A single prefix key: react-query's invalidateQueries partial-matches on it, so this
// also invalidates ['notifications', 'all' | 'unread' | 'read'] and ['notifications', 'unread-count'].
const notificationQueryKeys = [['notifications']];

export function useMarkNotificationRead() {
  return useApiMutation<void, string>({
    mutationFn: async (id) => {
      await api.patch(endpoints.notifications.markRead(id));
    },
    invalidateQueryKeys: notificationQueryKeys,
  });
}

export function useMarkAllNotificationsRead() {
  return useApiMutation<void, void>({
    mutationFn: async () => {
      await api.patch(endpoints.notifications.markAllRead);
    },
    invalidateQueryKeys: notificationQueryKeys,
  });
}

export function useDeleteNotification() {
  return useApiMutation<void, string>({
    mutationFn: async (id) => {
      await api.delete(endpoints.notifications.delete(id));
    },
    invalidateQueryKeys: notificationQueryKeys,
  });
}
