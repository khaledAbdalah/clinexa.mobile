import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, CircleCheck, HeartPulse, Stethoscope, User, Users } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type QueueCardProps = {
  queueNumber: string;
  isReserved: boolean;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  patientsAhead: number;
  /** Snapshot of the booked service, if one was picked at booking time (it's optional there). */
  serviceName?: string | null;
};

export function QueueCard({
  queueNumber,
  isReserved,
  doctorName,
  doctorSpecialty,
  date,
  patientsAhead,
  serviceName,
}: QueueCardProps) {
  return (
    <View className="mx-6 overflow-hidden rounded-3xl">
      <LinearGradient
        colors={['#2dd4bf', '#0d9488', '#0f766e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24, gap: 20 }}
      >
        <View className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10" />
        <Icon
          as={HeartPulse}
          size={64}
          className="pointer-events-none absolute -bottom-3 left-2 text-white/10"
        />

        <View className="flex-row items-start justify-between">
          <View className="items-start gap-1">
            <Text className="text-sm text-white/80" style={{ fontFamily: 'app-font-semibold' }}>
              الدور رقم
            </Text>
            <Text className="text-6xl text-white" style={{ fontFamily: 'app-font-bold' }}>
              {queueNumber}
            </Text>
          </View>

          {isReserved ? (
            <View className="flex-row items-center gap-1 rounded-full bg-white/15 px-3 py-1.5">
              <Icon as={CircleCheck} size={14} className="text-white" />
              <Text className="text-xs text-white" style={{ fontFamily: 'app-font-semibold' }}>
                محجوز
              </Text>
            </View>
          ) : null}
        </View>

        <View className="gap-3.5 rounded-2xl bg-white/10 px-4 py-3.5">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Icon as={User} size={18} className="text-white" />
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-base text-white" style={{ fontFamily: 'app-font-bold' }}>
                {doctorName}
              </Text>
              <Text className="text-xs text-white/70" style={{ fontFamily: 'app-font-semibold' }}>
                {doctorSpecialty}
              </Text>
            </View>
          </View>

          {serviceName ? (
            <View className="flex-row items-center gap-1.5 self-start rounded-full bg-white/15 px-3 py-1">
              <Icon as={Stethoscope} size={12} className="text-white" />
              <Text className="text-xs text-white" style={{ fontFamily: 'app-font-semibold' }}>
                {serviceName}
              </Text>
            </View>
          ) : null}

          <View className="flex-row items-center justify-between border-t border-white/15 pt-3.5">
            <View className="flex-row items-center gap-1.5">
              <Icon as={Calendar} size={14} className="text-white/80" />
              <Text className="text-xs text-white" style={{ fontFamily: 'app-font-semibold' }}>
                {date}
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Icon as={Users} size={14} className="text-white/80" />
              <Text className="text-xs text-white" style={{ fontFamily: 'app-font-semibold' }}>
                أمامك {patientsAhead} مرضى
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
