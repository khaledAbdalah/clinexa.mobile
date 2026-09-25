import { router } from 'expo-router';
import { Calendar, ChevronLeft, Stethoscope } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type LastVisitCardProps = {
  date: string;
  doctorName: string;
  doctorSpecialty?: string | null;
};

export function LastVisitCard({ date, doctorName, doctorSpecialty }: LastVisitCardProps) {
  return (
    <Pressable
      onPress={() => router.push(routes.medicalTimeline)}
      className="bg-card border-border mx-6 gap-3 rounded-2xl border p-4 active:opacity-80"
    >
      <View className="flex-row items-center gap-3">
        <View className="bg-accent h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
          <Icon as={Stethoscope} size={22} className="text-primary" />
        </View>

        <View className="flex-1 gap-0.5">
          <Text
            className="text-muted-foreground text-xs"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            آخر زيارة لك
          </Text>
          <Text
            className="text-foreground text-base leading-6"
            style={{ fontFamily: 'app-font-bold' }}
          >
            {doctorName}
          </Text>
          {doctorSpecialty ? (
            <Text
              className="text-muted-foreground text-xs leading-5"
              style={{ fontFamily: 'app-font-semibold' }}
            >
              {doctorSpecialty}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="border-border flex-row flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t pt-3">
        <View className="flex-row items-center gap-1.5">
          <Icon as={Calendar} size={13} className="text-muted-foreground" />
          <Text
            className="text-muted-foreground text-xs"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            {date}
          </Text>
        </View>
        <View className="flex-row items-center gap-0.5">
          <Text className="text-primary text-xs" style={{ fontFamily: 'app-font-bold' }}>
            عرض السجل المرضي
          </Text>
          <Icon as={ChevronLeft} size={14} className="text-primary" />
        </View>
      </View>
    </Pressable>
  );
}
