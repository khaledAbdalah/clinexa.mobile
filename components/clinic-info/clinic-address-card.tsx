import { MapPin } from 'lucide-react-native';
import { View } from 'react-native';

import { openExternalUrl } from '@/lib/open-url';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';

type ClinicAddressCardProps = {
  address: string;
  mapsUrl?: string;
};

export function ClinicAddressCard({ address, mapsUrl }: ClinicAddressCardProps) {
  return (
    <View className="bg-card border-border gap-3 rounded-2xl border p-5">
      <View className="flex-row items-center gap-3">
        <View className="bg-accent h-10 w-10 items-center justify-center rounded-full">
          <Icon as={MapPin} size={18} className="text-primary" />
        </View>
        <Text className="text-foreground flex-1 text-sm" style={{ fontFamily: 'app-font-bold' }}>
          عنوان العيادة
        </Text>
      </View>

      <Text
        className="text-muted-foreground text-sm leading-6"
        style={{ fontFamily: 'app-font-regular' }}
      >
        {address}
      </Text>

      {mapsUrl ? (
        <PillButton label="فتح الموقع على الخريطة" onPress={() => openExternalUrl(mapsUrl)} />
      ) : null}
    </View>
  );
}
