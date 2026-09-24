import { MessageCircle, Phone } from 'lucide-react-native';
import { View } from 'react-native';

import { openExternalUrl } from '@/lib/open-url';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';

type ClinicContactCardProps = {
  phones: string[];
  whatsappNumbers: string[];
};

export function ClinicContactCard({ phones, whatsappNumbers }: ClinicContactCardProps) {
  if (phones.length === 0 && whatsappNumbers.length === 0) return null;

  return (
    <View className="bg-card border-border gap-3 rounded-2xl border p-5">
      <View className="flex-row items-center gap-3">
        <View className="bg-accent h-10 w-10 items-center justify-center rounded-full">
          <Icon as={Phone} size={18} className="text-primary" />
        </View>
        <Text className="text-foreground flex-1 text-sm" style={{ fontFamily: 'app-font-bold' }}>
          أرقام التواصل
        </Text>
      </View>

      <View className="gap-2">
        {whatsappNumbers.map((number) => (
          <PillButton
            key={`whatsapp-${number}`}
            variant="outline"
            size="sm"
            label={`واتساب - ${number}`}
            icon={MessageCircle}
            onPress={() => openExternalUrl(`https://wa.me/${number}`)}
          />
        ))}
        {phones.map((number) => (
          <PillButton
            key={`phone-${number}`}
            variant="outline"
            size="sm"
            label={`اتصال - ${number}`}
            icon={Phone}
            onPress={() => openExternalUrl(`tel:${number}`)}
          />
        ))}
      </View>
    </View>
  );
}
