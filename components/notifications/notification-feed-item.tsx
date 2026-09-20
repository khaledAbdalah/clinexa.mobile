import { Trash2, Clock } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/format-relative-time';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { AppNotification } from '@/types/notification.types';

interface NotificationFeedItemProps {
  notification: AppNotification;
  onPress: () => void;
  onRemove: () => void;
}

export function NotificationFeedItem({
  notification,
  onPress,
  onRemove,
}: NotificationFeedItemProps) {
  const isRead = !!notification.readAt;

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'border-border bg-card mx-4 mb-3 gap-3 rounded-2xl border p-4 active:opacity-80',
        !isRead && 'border-primary/40 bg-primary/5'
      )}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-0.5">
          <Text
            numberOfLines={1}
            className="text-foreground text-[15px] leading-tight"
            style={{ fontFamily: 'app-font-bold' }}
          >
            {notification.title}
          </Text>
          <Text
            numberOfLines={2}
            className="text-muted-foreground text-xs"
            style={{ fontFamily: 'app-font-regular' }}
          >
            {notification.body}
          </Text>
        </View>
        <View className="items-end gap-2">
          {!isRead ? (
            <View className="bg-primary/10 shrink-0 rounded-full px-2.5 py-1">
              <Text className="text-primary text-xs" style={{ fontFamily: 'app-font-semibold' }}>
                جديد
              </Text>
            </View>
          ) : null}
          <Pressable onPress={onRemove} hitSlop={10} className="-m-1 shrink-0 p-1">
            <Icon as={Trash2} size={16} className="text-muted-foreground" />
          </Pressable>
        </View>
      </View>

      <View className="flex-row items-center gap-1.5">
        <Icon as={Clock} size={14} className="text-muted-foreground" />
        <Text className="text-muted-foreground text-xs" style={{ fontFamily: 'app-font-regular' }}>
          {formatRelativeTime(notification.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}
