import { router } from 'expo-router';
import { ChevronLeft, Clock, Stethoscope, User } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type LastVisitCardProps = {
  date: string;
  doctorName: string;
  doctorSpecialty: string;
  diagnosis: string;
};

export function LastVisitCard({
  date,
  doctorName,
  doctorSpecialty,
  diagnosis,
}: LastVisitCardProps) {
  return (
    <View className="bg-card border-border mx-6 gap-3 rounded-2xl border p-5">
      <View className="flex-row items-center gap-1.5">
        <Icon as={Clock} size={15} className="text-muted-foreground" />
        <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-semibold' }}>
          آخر زيارة لك
        </Text>
      </View>

      <Text className="text-muted-foreground text-xs" style={{ fontFamily: 'app-font-semibold' }}>
        {date}
      </Text>

      <View className="flex-row items-center gap-1.5">
        <Icon as={User} size={15} className="text-muted-foreground" />
        <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-semibold' }}>
          {doctorName}
        </Text>
      </View>

      <View className="flex-row items-center gap-1.5">
        <Icon as={Stethoscope} size={15} className="text-muted-foreground" />
        <Text className="text-muted-foreground text-xs" style={{ fontFamily: 'app-font-semibold' }}>
          {doctorSpecialty}
        </Text>
      </View>

      <Text className="text-foreground text-xs" style={{ fontFamily: 'app-font-semibold' }}>
        التشخيص: {diagnosis}
      </Text>

      <Pressable
        onPress={() => router.push(routes.tabsAppointments)}
        className="flex-row items-center gap-1"
        hitSlop={8}
      >
        <Icon as={ChevronLeft} size={14} className="text-primary" />
        <Text className="text-primary text-xs" style={{ fontFamily: 'app-font-semibold' }}>
          عرض التفاصيل
        </Text>
      </Pressable>
    </View>
  );
}
