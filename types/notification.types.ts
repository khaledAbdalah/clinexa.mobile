export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  data: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

export type NotificationFeedStatus = 'all' | 'unread' | 'read';
