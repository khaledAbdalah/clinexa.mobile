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
import { cn } from '@/lib/utils';

export function EmptyHomeContactCard() {
  const workingHours = useSettingsStore((state) => state.get(SettingKeys.WORKING_HOURS));
  const status = Array.isArray(workingHours)
    ? getClinicOpenStatus(workingHours as unknown as WorkingHoursEntry[])
    : null;

  return (
    <View className="bg-card border-border mx-6 gap-4 rounded-2xl border p-4">
      <View className="flex-row items-center gap-3">
        <View className="bg-accent h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
          <Icon as={MessageCircleQuestion} size={22} className="text-primary" />
        </View>
        <View className="flex-1 gap-0.5">
          <Text
            className="text-foreground text-base leading-6"
            style={{ fontFamily: 'app-font-bold' }}
          >
            عندك سؤال؟
          </Text>
          <Text
            className="text-muted-foreground text-xs leading-5"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            ابعت رسالة للعيادة من المحادثة
          </Text>
        </View>
      </View>

      {status ? (
        <View className="bg-muted flex-row items-center gap-2 rounded-xl px-3 py-2.5">
          <View
            className={cn(
              'h-2 w-2 shrink-0 rounded-full',
              status.isOpen ? 'bg-primary' : 'bg-slate-300'
            )}
          />
          <View className="flex-1 flex-row flex-wrap items-baseline gap-x-1.5">
            <Text
              className={cn('text-xs', status.isOpen ? 'text-primary' : 'text-foreground')}
              style={{ fontFamily: 'app-font-bold' }}
            >
              {status.state}
            </Text>
            <Text
              className="text-muted-foreground text-xs"
              style={{ fontFamily: 'app-font-semibold' }}
            >
              {status.detail}
            </Text>
          </View>
        </View>
      ) : null}

      <PillButton
        label="ابدأ محادثة مع العيادة"
        size="sm"
        onPress={() => router.push(routes.tabsChat)}
      />
    </View>
  );
}
