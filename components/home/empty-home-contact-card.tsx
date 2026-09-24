import { router } from 'expo-router';
import { MessageCircleQuestion } from 'lucide-react-native';
import { View } from 'react-native';

import { SettingKeys } from '@/constants/settings.constant';
import { getClinicOpenStatus } from '@/lib/clinic-hours';
import { useSettingsStore } from '@/store/settings';
import type { WorkingHoursEntry } from '@/types/settings.types';

import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';

export function EmptyHomeContactCard() {
  const workingHours = useSettingsStore((state) => state.get(SettingKeys.WORKING_HOURS));
  const status = Array.isArray(workingHours)
    ? getClinicOpenStatus(workingHours as unknown as WorkingHoursEntry[])
    : null;

  return (
    <View className="bg-card border-border mx-6 gap-4 rounded-2xl border p-5">
      <View className="flex-row items-center gap-4">
        <View className="bg-accent h-12 w-12 items-center justify-center rounded-full">
          <Icon as={MessageCircleQuestion} size={22} className="text-primary" />
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-bold' }}>
            عندك سؤال قبل ما تحجز؟
          </Text>
          {status ? (
            <View className="flex-row items-center gap-1.5">
              <View
                className={
                  status.isOpen
                    ? 'bg-primary h-2 w-2 rounded-full'
                    : 'bg-muted-foreground/50 h-2 w-2 rounded-full'
                }
              />
              <Text
                className="text-muted-foreground flex-1 text-xs"
                style={{ fontFamily: 'app-font-semibold' }}
              >
                {status.label}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <PillButton label="تواصل مع العيادة" onPress={() => router.push(routes.tabsChat)} />
    </View>
  );
}
