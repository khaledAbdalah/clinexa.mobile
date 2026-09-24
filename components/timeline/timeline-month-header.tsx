import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type TimelineMonthHeaderProps = {
  month: string;
  count: number;
  isFirst: boolean;
};

/** Month divider that sits on the timeline rail, so the line runs through it unbroken. */
export function TimelineMonthHeader({ month, count, isFirst }: TimelineMonthHeaderProps) {
  return (
    <View className="flex-row gap-3 px-6">
      <View className="w-8 items-center">
        <View className={cn('h-3 w-0.5', isFirst ? 'bg-transparent' : 'bg-border')} />
        <View className="border-border bg-background h-3 w-3 rounded-full border-2" />
        <View className="bg-border w-0.5 flex-1" />
      </View>

      <View className="flex-1 flex-row items-baseline gap-2 pt-1.5 pb-3">
        <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-bold' }}>
          {month}
        </Text>
        <Text className="text-muted-foreground text-xs" style={{ fontFamily: 'app-font-semibold' }}>
          {count === 1 ? 'حدث واحد' : `${count} أحداث`}
        </Text>
      </View>
    </View>
  );
}
