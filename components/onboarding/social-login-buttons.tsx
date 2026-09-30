import * as AppleAuthentication from 'expo-apple-authentication';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useAppleLogin, useGoogleLogin } from '@/hooks/auth/use-social-login';
import { getPostAuthRoute } from '@/lib/post-auth-route';
import { useAuthStore } from '@/store/auth';

function goToPostAuthRoute() {
  const { user, status } = useAuthStore.getState();
  router.replace(getPostAuthRoute(status, user));
}

/** Google's own button look (white, neutral border, multicolor "G") — deliberately off-brand per Google's guidelines. */
function GoogleButton({
  isLoading,
  disabled,
  onPress,
}: {
  isLoading: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      role="button"
      disabled={disabled}
      onPress={onPress}
      className="h-14 flex-row items-center justify-center gap-3 rounded-full border border-[#dadce0] bg-white active:bg-[#f6f8fa]"
      style={{ opacity: disabled && !isLoading ? 0.5 : 1 }}
    >
      {isLoading ? (
        <ActivityIndicator color="#3c4043" />
      ) : (
        <>
          <Image
            source={require('@/assets/images/google-g.svg')}
            style={{ width: 20, height: 20 }}
            contentFit="contain"
          />
          <Text className="text-base text-[#3c4043]" style={{ fontFamily: 'app-font-semibold' }}>
            المتابعة باستخدام جوجل
          </Text>
        </>
      )}
    </Pressable>
  );
}

/** "Continue with Google" (both platforms) and "Sign in with Apple" (iOS only). */
export function SocialLoginButtons({ showDivider = true }: { showDivider?: boolean }) {
  const google = useGoogleLogin();
  const apple = useAppleLogin();
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    AppleAuthentication.isAvailableAsync()
      .then(setAppleAvailable)
      .catch(() => setAppleAvailable(false));
  }, []);

  const busy = google.isPending || apple.isPending;

  return (
    <View className={showDivider ? 'mt-8 gap-4' : 'gap-3'}>
      {showDivider ? (
        <View className="flex-row items-center gap-3">
          <View className="bg-border h-px flex-1" />
          <Text
            className="text-muted-foreground text-sm"
            style={{ fontFamily: 'app-font-regular' }}
          >
            أو
          </Text>
          <View className="bg-border h-px flex-1" />
        </View>
      ) : null}

      <GoogleButton
        isLoading={google.isPending}
        disabled={busy}
        onPress={() => google.mutate(undefined, { onSuccess: goToPostAuthRoute })}
      />

      {appleAvailable ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={28}
          style={{ height: 56, opacity: busy ? 0.5 : 1 }}
          onPress={() => {
            if (busy) return;
            apple.mutate(undefined, { onSuccess: goToPostAuthRoute });
          }}
        />
      ) : null}
    </View>
  );
}
