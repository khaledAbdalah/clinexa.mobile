import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { legalLinks } from '@/constants/links';
import { routes } from '@/constants/routes';
import { openExternalUrl } from '@/lib/open-url';
import { useMarkEntryResolved } from '@/hooks/use-mark-entry-resolved';
import { useToast } from '@/hooks/use-toast';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';

export default function WelcomeScreen() {
  useMarkEntryResolved();

  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { showError } = useToast();

  const openLegalLink = async (url: string) => {
    const opened = await openExternalUrl(url);
    if (!opened) {
      showError('تعذّر فتح الرابط', 'حاول مرة تانية بعدين');
    }
  };

  return (
    <View className="bg-background flex-1">
      {/* Mint wave pattern behind the lower half, matching the design's backdrop. */}
      <Image
        source={require('@/assets/images/splash-pattern.png')}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: screenHeight * 0.68,
        }}
        contentFit="cover"
      />

      {/* Hero is intentionally full-bleed under the status bar. */}
      <Image
        source={require('@/assets/images/doctor-consultation.png')}
        style={{ width: '100%', height: '42%' }}
        contentFit="cover"
      />

      {/* `paddingBottom` keeps the CTAs clear of the navigation bar under edge-to-edge. */}
      <View className="flex-1" style={{ paddingBottom: insets.bottom + 24 }}>
        <View className="items-center gap-3 px-6 pt-8">
          <Text
            className="text-foreground text-center text-3xl"
            style={{ fontFamily: 'app-font-bold' }}
          >
            عيادتك في جيبك
          </Text>
          <Text
            className="text-muted-foreground text-center text-base leading-7"
            style={{ fontFamily: 'app-font-regular' }}
          >
            مواعيدك، روشتاتك، وفواتيرك{'\n'}في مكان واحد
          </Text>
        </View>

        <View className="mt-12 gap-3 px-6">
          {/* Extra inset keeps the CTAs narrower than the legal copy below them. */}
          <View className="gap-3 px-4">
            <PillButton
              onPress={() => router.push(routes.register)}
              label="إنشاء حساب جديد"
              variant="solid"
            />

            <PillButton
              onPress={() => router.push(routes.login)}
              label="عندي حساب بالفعل"
              variant="outline"
            />
          </View>

          <View className="mt-3 flex-row items-center justify-center gap-1.5">
            <Icon as={Lock} size={12} className="text-muted-foreground" />
            <Text
              className="text-muted-foreground text-xs"
              style={{ fontFamily: 'app-font-regular' }}
            >
              باستخدامك للتطبيق، أنت توافق على
            </Text>
          </View>
          <Text
            className="text-muted-foreground -mt-1 text-center text-xs"
            style={{ fontFamily: 'app-font-regular' }}
          >
            <Text
              onPress={() => openLegalLink(legalLinks.terms)}
              className="text-primary text-xs underline"
              style={{ fontFamily: 'app-font-semibold' }}
            >
              الشروط والأحكام
            </Text>
            {' و '}
            <Text
              onPress={() => openLegalLink(legalLinks.privacy)}
              className="text-primary text-xs underline"
              style={{ fontFamily: 'app-font-semibold' }}
            >
              سياسة الخصوصية
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
