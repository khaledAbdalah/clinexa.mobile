import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AppState } from 'react-native';
import { io } from 'socket.io-client';

import { SecureStorage } from '@/config/secure-storage';
import { useToast } from '@/hooks/use-toast';
import { resolveSocketOrigin } from '@/lib/chat-socket';
import { useAuthStore } from '@/store/auth';
import type { AppNotification } from '@/types/notification.types';

const NOTIFICATIONS_NAMESPACE = '/notifications';

export function useNotificationSocket(isReady: boolean) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const enabled = isReady && isAuthenticated;
  const queryClient = useQueryClient();
  const { showInfo } = useToast();

  useEffect(() => {
    if (!enabled) return;

    const socket = io(`${resolveSocketOrigin()}${NOTIFICATIONS_NAMESPACE}`, {
      transports: ['websocket'],
      auth: (callback) => {
        SecureStorage.getAccessToken().then((token) => callback({ token: token ?? '' }));
      },
    });

    const refreshNotifications = () =>
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

    const handleNewNotification = (notification: AppNotification) => {
      refreshNotifications();
      showInfo(notification.title, notification.body);
    };

    socket.on('new_notification', handleNewNotification);
    // Anything emitted while disconnected is lost, so catch up on every (re)connect.
    socket.on('connect', refreshNotifications);
    // Only an auth rejection (expired token) needs the REST-driven refresh; retrying while merely
    // offline would just fire failing requests on every backoff tick.
    socket.on('connect_error', (error) => {
      if (error.message.includes('الجلسة')) refreshNotifications();
    });

    const appStateSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshNotifications();
    });

    return () => {
      appStateSub.remove();
      socket.off('new_notification', handleNewNotification);
      socket.disconnect();
    };
    // `showInfo` is recreated each render; the socket must not reconnect for it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, queryClient]);
}
