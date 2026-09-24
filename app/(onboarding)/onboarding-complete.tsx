import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';

const ILLUSTRATION_ASPECT_RATIO = 1580 / 995;

export default function OnboardingCompleteScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const illustrationWidth = screenWidth * 0.7;
  const { patientNumber } = useLocalSearchParams<{ patientNumber: string }>();

  return (
    <View className="bg-background flex-1">
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

      <View className="flex-1" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View className="flex-1 items-center px-6 pt-10">
          <Image
            source={require('@/assets/images/onboarding-complete-check.png')}
            style={{
              width: illustrationWidth,
              height: illustrationWidth / ILLUSTRATION_ASPECT_RATIO,
            }}
            contentFit="contain"
          />

          <Text
            className="text-foreground mt-4 text-center text-4xl"
            style={{ fontFamily: 'app-font-bold' }}
          >
            تمام، ملفك جاهز
          </Text>

          <View className="bg-accent border-primary/15 mt-8 w-full items-center gap-2 rounded-3xl border p-6">
            <Text className="text-foreground text-base" style={{ fontFamily: 'app-font-semibold' }}>
              رقم ملفك
            </Text>
            <Text
              latinDigits
              className="text-foreground text-4xl"
              style={{ fontFamily: 'app-font-bold' }}
            >
              {patientNumber}
            </Text>
            <Text
              className="text-muted-foreground mt-1 text-center text-sm"
              style={{ fontFamily: 'app-font-semibold' }}
            >
              اذكره لما تتواصل مع العيادة
            </Text>
          </View>
        </View>

        <View className="px-6 mb-52">
          <PillButton
            label="ابدأ"
            variant="solid"
            size="lg"
            onPress={() => router.replace(routes.tabsHome)}
          />
        </View>
      </View>
    </View>
  );
}
