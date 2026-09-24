import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

import { routes } from '@/constants/routes';
import { useBootStore } from '@/store/boot';

type PushNotificationData = {
  /** e.g. 'appointment.reminder' — see api's `dispatch_appointment_reminders.ts`. */
  type?: string;
  appointmentId?: string;
};

/**
 * Broadcast pushes (`send_notification_broadcast.ts`) only carry a
 * `broadcastId` with no `type` and aren't backed by any in-app detail
 * screen today — opening the app (already achieved by the OS launching it)
 * is all there is to do for those, so only the reminder type gets a
 * navigation target here rather than fabricating one.
 */
function navigateForNotificationData(data: PushNotificationData) {
  if (data.type === 'appointment.reminder') {
    router.push(routes.tabsAppointments);
  }
}

/**
 * Handles taps on push notifications, both cold-start (the tap launched the
 * app from killed) and warm (app already running) — useLastNotificationResponse
 * covers both internally. Waits for the entry redirect (app/index.tsx) to
 * resolve first so this navigation lands on top of it instead of racing with
 * its router.replace().
 */
export function usePushNotificationResponse(isReady: boolean) {
  const entryResolved = useBootStore((state) => state.entryResolved);
  const lastResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!isReady || !entryResolved || !lastResponse) return;
    navigateForNotificationData(
      lastResponse.notification.request.content.data as PushNotificationData
    );
  }, [isReady, entryResolved, lastResponse]);
}
