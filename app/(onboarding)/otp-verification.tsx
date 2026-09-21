import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ChevronLeft, Clock } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';
import { formatCountdown, useOtpVerification } from '@/hooks/auth/use-otp-verification';
import { Icon } from '@/components/ui/icon';
import { OtpInput } from '@/components/ui/otp-input';
import { PasswordField } from '@/components/ui/password-field';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';

export default function OtpVerificationScreen() {
  const insets = useSafeAreaInsets();
  const {
    code,
    setCode,
    secondsLeft,
    canResend,
    handleResend,
    handleConfirm,
    isConfirmDisabled,
    isVerifying,
    isPasswordReset,
    passwordForm,
  } = useOtpVerification();

  return (
    <View className="bg-background flex-1">
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
          </View>

          <View className="items-center">
            <Image
              source={require('@/assets/images/whatsapp-icon.png')}
              style={{ width: 96, height: 96 }}
              contentFit="contain"
            />

            <Text
              className="text-foreground mt-6 text-center text-2xl"
              style={{ fontFamily: 'app-font-bold' }}
            >
              التحقق من رقم الهاتف
            </Text>
            <Text
              className="text-muted-foreground mt-2 text-center text-base"
              style={{ fontFamily: 'app-font-regular' }}
            >
              أدخل الكود المكون من 6 أرقام
            </Text>

            <View className="mt-8 w-full">
              <OtpInput value={code} onChangeText={setCode} autoFocus />
            </View>

            <View className="mt-6 items-center gap-2">
              <View className="flex-row items-center gap-1">
                <Text
                  className="text-muted-foreground text-sm"
                  style={{ fontFamily: 'app-font-regular' }}
                >
                  لم يتم استلام الكود؟
                </Text>
                <Pressable onPress={handleResend} disabled={!canResend}>
                  <Text
                    className={cn('text-sm', canResend ? 'text-primary' : 'text-muted-foreground')}
                    style={{ fontFamily: 'app-font-semibold' }}
                  >
                    إعادة إرسال الكود
                  </Text>
                </Pressable>
              </View>

              {!canResend ? (
                <View className="flex-row items-center gap-1.5">
                  <Icon as={Clock} size={14} className="text-muted-foreground" />
                  <Text
                    className="text-muted-foreground text-xs"
                    style={{ fontFamily: 'app-font-regular' }}
                  >
                    {formatCountdown(secondsLeft)}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {isPasswordReset ? (
            <View className="mt-8 gap-4">
              <Controller
                control={passwordForm.control}
                name="password"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <PasswordField
                    label="كلمة المرور الجديدة"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={error?.message}
                  />
                )}
              />
              <Controller
                control={passwordForm.control}
                name="passwordConfirmation"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <PasswordField
                    label="تأكيد كلمة المرور"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={error?.message}
                  />
                )}
              />
            </View>
          ) : null}

          <PillButton
            label="تأكيد"
            className="mt-8"
            variant="solid"
            disabled={isConfirmDisabled}
            isLoading={isVerifying}
            onPress={handleConfirm}
          />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}
