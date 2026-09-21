import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { useRequestOtp } from '@/hooks/auth/use-request-otp';
import { useMarkEntryResolved } from '@/hooks/use-mark-entry-resolved';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';

const ILLUSTRATION_ASPECT_RATIO = 1;

export default function OtpChannelExplainerScreen() {
  // Reachable straight from the '/' entry gate (unverified user reopening the
  // app), not just from register.tsx — see useMarkEntryResolved's docblock.
  useMarkEntryResolved();

  const { width: screenWidth } = useWindowDimensions();
  const illustrationWidth = screenWidth * 0.8;
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const requestOtp = useRequestOtp();

  const handleContinue = () => {
    requestOtp.mutate(
      { phone, purpose: 'signup_verify' },
      {
        onSuccess: () => {
          router.push({
            pathname: routes.otpVerification,
            params: { phone, purpose: 'signup_verify' },
          });
        },
      }
    );
  };

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
          height: 340,
        }}
        contentFit="cover"
      />

      <View className="flex-1 items-center justify-start px-6 mt-8">
        <Image
          source={require('@/assets/images/otp-channel-explainer.png')}
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
          هنتأكد من رقمك
        </Text>
        <Text
          className="text-muted-foreground mt-3 text-center text-base leading-7"
          style={{ fontFamily: 'app-font-regular' }}
        >
          هنبعتلك كود التحقق على واتساب
        </Text>
      </View>

      <View className="mb-48 px-6">
        <PillButton
          variant="solid"
          label="متابعة"
          isLoading={requestOtp.isPending}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}
