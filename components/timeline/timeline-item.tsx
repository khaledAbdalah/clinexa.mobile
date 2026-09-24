import { View } from 'react-native';

import {
  TimelineEventCard,
  TIMELINE_CATEGORY_CONFIG,
  type TimelineEvent,
} from '@/components/timeline/timeline-event-card';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type TimelineItemProps = {
  event: TimelineEvent;
  isLast: boolean;
};

export function TimelineItem({ event, isLast }: TimelineItemProps) {
  const config = TIMELINE_CATEGORY_CONFIG[event.category];

  return (
    <View className="flex-row gap-3 px-6">
      {/* Node sits level with the card's meta/title rows rather than its vertical
          center, so the eye lands on the icon and the title in one line. */}
      <View className="w-8 items-center">
        <View className="bg-border h-4 w-0.5" />
        <View
          className={cn('h-8 w-8 items-center justify-center rounded-full', config.nodeClassName)}
        >
          <Icon as={config.icon} size={14} className="text-white" />
        </View>
        <View className={cn('w-0.5 flex-1', isLast ? 'bg-transparent' : 'bg-border')} />
      </View>

      <View className="flex-1 pb-3">
        <TimelineEventCard {...event} />
      </View>
    </View>
  );
}
