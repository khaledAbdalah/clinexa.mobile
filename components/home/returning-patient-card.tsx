import { differenceInCalendarDays } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CalendarPlus } from 'lucide-react-native';
import { View } from 'react-native';

import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';
import type { PatientHomeLastVisit } from '@/types/patient.types';

/** Visits older than this get the gentler "time has passed" nudge. */
const STALE_VISIT_DAYS = 60;

function describeSince(days: number) {
  if (days < 1) return 'النهارده';
  if (days < 30) return days === 1 ? 'من يوم' : `من ${days} أيام`;
  const months = Math.floor(days / 30);
  if (months === 1) return 'من شهر';
  return months === 2 ? 'من شهرين' : `من ${months} شهور`;
}

/**
 * Booking nudge for a returning patient with no upcoming appointment — the
 * counterpart of `EmptyHomeHeroCard`, which is for patients who have never
 * booked. References the last visit so the prompt feels personal.
 */
export function ReturningPatientCard({ lastVisit }: { lastVisit: PatientHomeLastVisit }) {
  const daysSince = differenceInCalendarDays(new Date(), new Date(lastVisit.date));
  const isStale = Number.isFinite(daysSince) && daysSince >= STALE_VISIT_DAYS;

  const subtitle = Number.isFinite(daysSince)
    ? isStale
      ? `عدّى وقت من آخر زيارة (${describeSince(daysSince)}) مع ${lastVisit.doctorName}، تحب تطمن على حالتك؟`
      : `آخر زيارة لك كانت ${describeSince(daysSince)} مع ${lastVisit.doctorName}`
    : `آخر زيارة لك كانت مع ${lastVisit.doctorName}`;

  return (
    <View className="mx-6 overflow-hidden rounded-3xl">
      <LinearGradient
        colors={['#2dd4bf', '#0d9488', '#0f766e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24, gap: 16 }}
      >
        <View className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/10" />

        <View className="flex-row items-center gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <Icon as={CalendarPlus} size={26} className="text-white" />
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-lg text-white" style={{ fontFamily: 'app-font-bold' }}>
              جاهز لموعدك الجاي؟
            </Text>
            <Text
              className="text-sm leading-6 text-white/85"
              style={{ fontFamily: 'app-font-semibold' }}
            >
              {subtitle}
            </Text>
          </View>
        </View>

        <PillButton
          label="احجز موعد جديد"
          onPress={() => router.push(routes.bookAppointment)}
          className="bg-white active:bg-white/90"
          labelClassName="text-primary"
          iconClassName="text-primary"
        />
      </LinearGradient>
    </View>
  );
}
