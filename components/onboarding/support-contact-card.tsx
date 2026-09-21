import { MessageCircle, Phone } from 'lucide-react-native';
import { View } from 'react-native';

import { SettingKeys } from '@/constants/settings.constant';
import { openExternalUrl } from '@/lib/open-url';
import { useSettingsStore } from '@/store/settings';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';

/** Shown when OTP delivery is disabled for the clinic and the user has no way to reset via the app. */
export function SupportContactCard() {
  const clinicPhone = useSettingsStore((state) => state.get(SettingKeys.CLINIC_PHONE));
  const clinicWhatsapp = useSettingsStore((state) => state.get(SettingKeys.CLINIC_WHATSAPP_NUMBER));
  // clinic_phone / clinic_whatsapp_number are stored as JSON arrays — a clinic can list more than one number.
  const phones = Array.isArray(clinicPhone) ? clinicPhone : [];
  const whatsappNumbers = Array.isArray(clinicWhatsapp) ? clinicWhatsapp : [];

  return (
    <View className="bg-accent border-primary/15 mt-8 items-center gap-2 rounded-3xl border p-6">
      <Text className="text-foreground text-center text-lg" style={{ fontFamily: 'app-font-bold' }}>
        رمز التحقق غير متاح حاليًا
      </Text>
      <Text
        className="text-muted-foreground mt-1 text-center text-sm"
        style={{ fontFamily: 'app-font-regular' }}
      >
        تواصل مع خدمة العملاء لمساعدتك في إعادة تعيين كلمة المرور
      </Text>

      <View className="mt-4 w-full gap-3">
        {whatsappNumbers.map((number) => (
          <PillButton
            key={`whatsapp-${number}`}
            variant="solid"
            label={`تواصل عبر واتساب - ${number}`}
            icon={MessageCircle}
            onPress={() => openExternalUrl(`https://wa.me/${number}`)}
          />
        ))}
        {phones.map((number) => (
          <PillButton
            key={`phone-${number}`}
            variant="outline"
            label={`اتصل بنا - ${number}`}
            icon={Phone}
            onPress={() => openExternalUrl(`tel:${number}`)}
          />
        ))}
      </View>
    </View>
  );
}
