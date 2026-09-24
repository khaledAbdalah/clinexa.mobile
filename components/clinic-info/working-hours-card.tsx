import { Clock } from 'lucide-react-native';
import { View } from 'react-native';

import type { WorkingHoursEntry } from '@/types/settings.types';
import { DAY_NAMES, formatTimeOfDay } from '@/lib/clinic-hours';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type WorkingHoursCardProps = {
  entries: WorkingHoursEntry[];
};

export function WorkingHoursCard({ entries }: WorkingHoursCardProps) {
  const byDay = new Map(entries.map((entry) => [entry.dayOfWeek, entry]));

  return (
    <View className="bg-card border-border gap-3 rounded-2xl border p-5">
      <View className="flex-row items-center gap-3">
        <View className="bg-accent h-10 w-10 items-center justify-center rounded-full">
          <Icon as={Clock} size={18} className="text-primary" />
        </View>
        <Text className="text-foreground flex-1 text-sm" style={{ fontFamily: 'app-font-bold' }}>
          مواعيد العمل
        </Text>
      </View>

      <View className="gap-2.5">
        {DAY_NAMES.map((dayName, dayOfWeek) => {
          const entry = byDay.get(dayOfWeek);
          return (
            <View key={dayOfWeek} className="flex-row items-center justify-between">
              <Text className="text-foreground text-xs" style={{ fontFamily: 'app-font-semibold' }}>
                {dayName}
              </Text>
              <Text
                className={
                  entry ? 'text-muted-foreground text-xs' : 'text-muted-foreground/60 text-xs'
                }
                style={{ fontFamily: 'app-font-regular' }}
              >
                {entry
                  ? `${formatTimeOfDay(entry.startsAt)} - ${formatTimeOfDay(entry.endsAt)}`
                  : 'مغلق'}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
