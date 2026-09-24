import { CalendarClock } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export function NoMoreAppointmentsCard() {
  return (
    <View className="bg-card border-border mx-6 gap-3 rounded-2xl border p-5">
      <View className="bg-accent h-16 w-16 items-center justify-center self-center rounded-full">
        <Icon as={CalendarClock} size={28} className="text-primary" />
      </View>

      <View className="items-center gap-1.5">
        <Text className="text-foreground text-base" style={{ fontFamily: 'app-font-bold' }}>
          ما عندكش مواعيد سابقة أكتر
        </Text>
        <Text
          className="text-muted-foreground text-center text-xs leading-5"
          style={{ fontFamily: 'app-font-semibold' }}
        >
          مواعيدك السابقة هتظهر هنا
        </Text>
      </View>
    </View>
  );
}
