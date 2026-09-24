import { History } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type EmptyTimelineCardProps = {
  /** Shown when a filter is active and matches nothing, vs. a genuinely empty timeline. */
  isFiltered: boolean;
};

export function EmptyTimelineCard({ isFiltered }: EmptyTimelineCardProps) {
  return (
    <View className="bg-card border-border mx-6 gap-4 rounded-2xl border p-5">
      <View className="bg-accent h-20 w-20 items-center justify-center self-center rounded-full">
        <Icon as={History} size={36} className="text-primary" />
      </View>

      <View className="items-center gap-1.5">
        <Text className="text-foreground text-base" style={{ fontFamily: 'app-font-bold' }}>
          {isFiltered ? 'لا توجد بيانات في هذا التصنيف' : 'لا توجد بيانات بعد'}
        </Text>
        <Text
          className="text-muted-foreground text-center text-xs leading-5"
          style={{ fontFamily: 'app-font-semibold' }}
        >
          {isFiltered
            ? 'جرب اختيار تصنيف آخر لعرض بياناتك الطبية.'
            : 'هتظهر هنا كل زياراتك وروشتاتك وفواتيرك ومدفوعاتك ومواعيدك أول ما تبدأ.'}
        </Text>
      </View>
    </View>
  );
}
