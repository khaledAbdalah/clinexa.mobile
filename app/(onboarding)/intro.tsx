import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { useMarkEntryResolved } from '@/hooks/use-mark-entry-resolved';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';

const ILLUSTRATION_ASPECT_RATIO = 1401 / 1123;

export default function IntroScreen() {
  // Reachable straight from the '/' entry gate (needs_onboarding), not just
  // forward from otp-verification.tsx — see useMarkEntryResolved's docblock.
  useMarkEntryResolved();

  const { width: screenWidth } = useWindowDimensions();
  const illustrationWidth = screenWidth * 0.8;
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-background flex-1"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Image
        source={require('@/assets/images/splash-pattern.png')}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: 270,
        }}
        contentFit="cover"
      />

      <View className="flex-1 items-center px-6">
        <Image
          source={require('@/assets/images/onboarding-medical-file.png')}
          style={{
            width: illustrationWidth,
            height: illustrationWidth / ILLUSTRATION_ASPECT_RATIO,
          }}
          contentFit="contain"
        />

        <Text
          className="text-foreground mt-8 text-center text-3xl"
          style={{ fontFamily: 'app-font-bold' }}
        >
          خلينا نكمل ملفك الطببي
        </Text>
        <Text
          className="text-muted-foreground mt-3 text-center text-base leading-7"
          style={{ fontFamily: 'app-font-semibold' }}
        >
          معلوماتك دي هتساعد الدكتور يتابع حالتك بدقة
        </Text>

        <View className="bg-accent border-primary/15 mt-8 w-full flex-row items-center gap-3 rounded-2xl border p-4">
          <View className="bg-primary h-9 w-9 items-center justify-center rounded-full">
            <Icon as={Lock} size={16} className="text-primary-foreground" />
          </View>
          <Text
            className="text-foreground flex-1 text-sm leading-6"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            بياناتك سرية ومحمية، ومتاحة لدكتورك بس
          </Text>
        </View>
      </View>

      <View className="px-6 mb-56">
        <PillButton
          variant="solid"
          label="ابدأ الآن"
          onPress={() => router.push(routes.onboardingPersonalDetails)}
        />
      </View>
    </View>
  );
}
