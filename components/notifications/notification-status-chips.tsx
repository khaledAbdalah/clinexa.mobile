import { Pressable, ScrollView, View } from 'react-native';

import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import type { NotificationFeedStatus } from '@/types/notification.types';

const FILTER_LABELS: Record<NotificationFeedStatus, string> = {
  all: 'الكل',
  unread: 'غير مقروءة',
  read: 'مقروءة',
};

const FILTERS: NotificationFeedStatus[] = ['all', 'unread', 'read'];

interface NotificationStatusChipsProps {
  active: NotificationFeedStatus;
  onChange: (status: NotificationFeedStatus) => void;
  unreadCount: number;
}

export function NotificationStatusChips({
  active,
  onChange,
  unreadCount,
}: NotificationStatusChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="shrink-0 grow-0"
      contentContainerClassName="items-center px-4 gap-2 py-1"
    >
      {FILTERS.map((filter) => {
        const isActive = filter === active;
        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            className={cn(
              'flex-row items-center gap-1.5 rounded-full border py-1.5 ps-3 pe-3',
              isActive ? 'bg-primary border-primary' : 'border-border bg-transparent'
            )}
          >
            {filter === 'unread' && unreadCount > 0 ? (
              <View
                className={cn(
                  'h-6 min-w-6 items-center justify-center rounded-full px-1',
                  isActive ? 'bg-primary-foreground/20' : 'bg-muted'
                )}
              >
                <Text
                  className={cn(
                    'text-xs',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                  )}
                  style={{ fontFamily: 'app-font-semibold' }}
                >
                  {unreadCount}
                </Text>
              </View>
            ) : null}
            <Text
              className={cn('text-sm', isActive ? 'text-primary-foreground' : 'text-foreground')}
              style={{ fontFamily: 'app-font-semibold' }}
            >
              {FILTER_LABELS[filter]}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
