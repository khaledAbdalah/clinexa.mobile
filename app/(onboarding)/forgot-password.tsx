import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { SupportContactCard } from '@/components/onboarding/support-contact-card';
import { Icon } from '@/components/ui/icon';
import { PhoneField } from '@/components/ui/phone-field';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';
import { useRequestOtp } from '@/hooks/auth/use-request-otp';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/validation/auth.validation';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [isOtpDisabled, setIsOtpDisabled] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { phone: '' },
  });

  const { mutate, isPending } = useRequestOtp({
    setError: form.setError,
    onOtpDisabled: () => setIsOtpDisabled(true),
  });

  const onSubmit = form.handleSubmit((data) => {
    Keyboard.dismiss();
    mutate(
      { phone: data.phone, purpose: 'password_reset' },
      {
        onSuccess: () => {
          router.push({
            pathname: routes.otpVerification,
            params: { phone: data.phone, purpose: 'password_reset' },
          });
        },
      }
    );
  });

  return (
    <View className="flex-1 bg-background">
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

      <View className="flex-1" style={{ paddingTop: insets.top }}>
        <KeyboardAwareScrollView
          bottomOffset={24}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row items-center gap-3 pt-2 pb-2" style={{ direction: 'ltr' }}>
            <Pressable onPress={() => router.back()} hitSlop={12} className="p-2">
              <Icon as={ChevronLeft} size={24} className="text-primary" />
            </Pressable>
            <Text
              className="text-foreground flex-1 text-right text-3xl"
              style={{ fontFamily: 'app-font-bold' }}
            >
              نسيت كلمة المرور
            </Text>
          </View>
          <Text
            className="text-muted-foreground mt-2 text-lg"
            style={{ fontFamily: 'app-font-regular' }}
          >
            أدخل رقم هاتفك وهنبعتلك رمز التحقق لإعادة تعيين كلمة المرور
          </Text>

          {isOtpDisabled ? (
            <SupportContactCard />
          ) : (
            <>
              <View className="mt-8 gap-6">
                <Controller
                  control={form.control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value }, fieldState }) => (
                    <PhoneField
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />
              </View>

              <PillButton
                variant="solid"
                label="إرسال رمز التحقق"
                className="mt-8"
                isLoading={isPending}
                onPress={onSubmit}
              />
            </>
          )}

          <View className="mt-4 flex-row items-center justify-center gap-1">
            <Pressable onPress={() => router.replace(routes.login)}>
              <Text className="text-primary text-sm" style={{ fontFamily: 'app-font-bold' }}>
                العودة إلى تسجيل الدخول
              </Text>
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}
