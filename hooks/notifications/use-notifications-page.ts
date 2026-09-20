import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useNotifications } from './use-notifications';
import { useUnreadCount } from './use-unread-count';
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from './use-notification-mutations';
import type { AppNotification, NotificationFeedStatus } from '@/types/notification.types';

const UNREAD_COUNT_KEY = ['notifications', 'unread-count'];

/**
 * Composes the notifications list + unread count + mutations into optimistic
 * open/mark-all/delete handlers: local state updates immediately, then rolls
 * back if the request fails.
 */
export function useNotificationsPage() {
  const [status, setStatus] = useState<NotificationFeedStatus>('all');
  const {
    items: notifications,
    setItems: setNotifications,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    refetch,
  } = useNotifications(status);
  const queryClient = useQueryClient();
  const { data: unreadCount = 0 } = useUnreadCount();
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['notifications'] }),
        refetch(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, refetch]);

  const setUnreadCount = (value: number) => {
    queryClient.setQueryData<number>(UNREAD_COUNT_KEY, Math.max(value, 0));
  };

  const handleOpenNotification = (notification: AppNotification) => {
    if (notification.readAt) return;

    // Snapshot current state so a failed request can be rolled back.
    const notificationsSnapshot = notifications;
    const unreadCountSnapshot = unreadCount;

    // Apply the change optimistically before the request resolves.
    const readAt = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((item) => (item.id === notification.id ? { ...item, readAt } : item))
    );
    setUnreadCount(unreadCountSnapshot - 1);

    markAsRead.mutate(notification.id, {
      onError: () => {
        setNotifications(notificationsSnapshot);
        setUnreadCount(unreadCountSnapshot);
      },
    });
  };

  const handleMarkAllAsRead = () => {
    const notificationsSnapshot = notifications;
    const unreadCountSnapshot = unreadCount;

    const readAt = new Date().toISOString();
    setNotifications((prev) => prev.map((item) => (item.readAt ? item : { ...item, readAt })));
    setUnreadCount(0);

    markAllAsRead.mutate(undefined, {
      onError: () => {
        setNotifications(notificationsSnapshot);
        setUnreadCount(unreadCountSnapshot);
      },
    });
  };

  const handleDeleteNotification = (id: string) => {
    const notificationsSnapshot = notifications;
    const unreadCountSnapshot = unreadCount;
    const target = notifications.find((item) => item.id === id);

    setNotifications((prev) => prev.filter((item) => item.id !== id));
    if (target && !target.readAt) {
      setUnreadCount(unreadCountSnapshot - 1);
    }

    deleteNotificationMutation.mutate(id, {
      onError: () => {
        setNotifications(notificationsSnapshot);
        setUnreadCount(unreadCountSnapshot);
      },
    });
  };

  return {
    status,
    setStatus,
    notifications,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    refetch,
    refreshing,
    onRefresh,
    unreadCount,
    handleOpenNotification,
    markAllAsRead: handleMarkAllAsRead,
    isMarkingAllRead: markAllAsRead.isPending,
    deleteNotification: handleDeleteNotification,
  };
}
