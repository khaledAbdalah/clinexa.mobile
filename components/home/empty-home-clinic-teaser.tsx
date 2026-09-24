import { router } from 'expo-router';
import { Building2, ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { SettingKeys } from '@/constants/settings.constant';
import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useSettingsStore } from '@/store/settings';

/**
 * Light teaser linking to the clinic-info screen. Sources the clinic name
 * from `useSettingsStore` (same store `app/clinic-info.tsx` reads) when it's
 * already been fetched, otherwise falls back to generic copy — never invents
 * a name/address/hours that isn't actually loaded anywhere.
 */
export function EmptyHomeClinicTeaser() {
  const clinicName = useSettingsStore((state) => state.get(SettingKeys.CLINIC_NAME));
  const subtitle =
    typeof clinicName === 'string' && clinicName
      ? clinicName
      : 'العنوان، أرقام التواصل، ومواعيد العمل';

  return (
    <Pressable
      onPress={() => router.push(routes.clinicInfo)}
      className="bg-card border-border mx-6 flex-row items-center gap-3 rounded-2xl border p-4"
    >
      <View className="bg-accent h-11 w-11 items-center justify-center rounded-full">
        <Icon as={Building2} size={20} className="text-primary" />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-bold' }}>
          تعرف على العيادة
        </Text>
        <Text
          className="text-muted-foreground text-xs"
          style={{ fontFamily: 'app-font-semibold' }}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>

      <Icon as={ChevronLeft} size={16} className="text-muted-foreground" />
    </Pressable>
  );
}
