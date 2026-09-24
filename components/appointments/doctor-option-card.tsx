import { Pressable, View } from 'react-native';

import { WEEKDAY_NAMES } from '@/constants/days';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { initials } from '@/lib/initials';
import { cn } from '@/lib/utils';
import type { Doctor } from '@/types/appointment.types';

/** Doctor selection card for step 1 of `app/book-appointment.tsx` — shows name,
 * specialty, and which weekdays the doctor works (as Arabic chips) so the patient
 * can tell before picking a date whether the doctor is available soon at all. */
export function DoctorOptionCard({
  doctor,
  selected,
  onPress,
}: {
  doctor: Doctor;
  selected: boolean;
  onPress: () => void;
}) {
  const workingDays = new Set(doctor.workingHours?.map((entry) => entry.dayOfWeek) ?? []);

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'mx-6 gap-3 rounded-2xl border p-4',
        selected ? 'border-primary bg-accent' : 'border-border bg-card'
      )}
    >
      <View className="flex-row items-center gap-3">
        <Avatar alt={doctor.fullName} className="h-12 w-12">
          <AvatarFallback className="bg-accent">
            <Text className="text-primary text-sm" style={{ fontFamily: 'app-font-bold' }}>
              {initials(doctor.fullName) ?? '؟'}
            </Text>
          </AvatarFallback>
        </Avatar>
        <View className="flex-1 items-start">
          <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-bold' }}>
            {doctor.fullName}
          </Text>
          <Text
            className="text-muted-foreground text-xs"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            {doctor.specialty ?? 'طبيب عام'}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-1.5">
        {WEEKDAY_NAMES.map((name, dayOfWeek) => {
          const worksThisDay = workingDays.has(dayOfWeek);
          return (
            <View
              key={dayOfWeek}
              className={cn(
                'rounded-full px-2.5 py-1',
                worksThisDay ? 'bg-primary/10' : 'bg-muted'
              )}
            >
              <Text
                className={cn(
                  'text-[11px]',
                  worksThisDay ? 'text-primary' : 'text-muted-foreground'
                )}
                style={{ fontFamily: 'app-font-semibold' }}
              >
                {name}
              </Text>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}
