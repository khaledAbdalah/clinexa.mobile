import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingKeys } from '@/constants/settings.constant';
import { BottomTabInset } from '@/constants/theme';
import { ClinicAddressCard } from '@/components/clinic-info/clinic-address-card';
import { ClinicContactCard } from '@/components/clinic-info/clinic-contact-card';
import { WorkingHoursCard } from '@/components/clinic-info/working-hours-card';
import { TabHeader } from '@/components/shared/tab-header';
import { usePullToRefresh } from '@/hooks/queries/use-pull-to-refresh';
import { useSettingsStore } from '@/store/settings';
import type { WorkingHoursEntry } from '@/types/settings.types';

export default function ClinicInfoScreen() {
  const insets = useSafeAreaInsets();

  const address = useSettingsStore((state) => state.get(SettingKeys.CLINIC_ADDRESS));
  const mapsUrl = useSettingsStore((state) => state.get(SettingKeys.CLINIC_MAPS_URL));
  const clinicPhone = useSettingsStore((state) => state.get(SettingKeys.CLINIC_PHONE));
  const clinicWhatsapp = useSettingsStore((state) => state.get(SettingKeys.CLINIC_WHATSAPP_NUMBER));
  const workingHours = useSettingsStore((state) => state.get(SettingKeys.WORKING_HOURS));
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);
  const { refreshing, onRefresh } = usePullToRefresh(fetchSettings);

  const phones = Array.isArray(clinicPhone) ? clinicPhone : [];
  const whatsappNumbers = Array.isArray(clinicWhatsapp) ? clinicWhatsapp : [];
  const workingHoursEntries = Array.isArray(workingHours)
    ? (workingHours as unknown as WorkingHoursEntry[])
    : [];

  return (
    <ScrollView
      className="bg-background flex-1"
      style={{ paddingTop: insets.top }}
      contentContainerStyle={{
        paddingBottom: insets.bottom + BottomTabInset,
        gap: 16,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0d9488" />
      }
    >
      <TabHeader title="معلومات العيادة" />

      <View className="mt-2 gap-4 px-6">
        {typeof address === 'string' && address ? (
          <ClinicAddressCard
            address={address}
            mapsUrl={typeof mapsUrl === 'string' ? mapsUrl : undefined}
          />
        ) : null}

        <ClinicContactCard phones={phones} whatsappNumbers={whatsappNumbers} />

        {workingHoursEntries.length > 0 ? <WorkingHoursCard entries={workingHoursEntries} /> : null}
      </View>
    </ScrollView>
  );
}
