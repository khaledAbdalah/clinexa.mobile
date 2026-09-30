import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PhoneField } from '@/components/ui/phone-field';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';
import { useAddPhone } from '@/hooks/auth/use-add-phone';
import { useMarkEntryResolved } from '@/hooks/use-mark-entry-resolved';
import { getPostAuthRoute } from '@/lib/post-auth-route';
import { useAuthStore } from '@/store/auth';
import { addPhoneSchema, type AddPhoneInput } from '@/validation/auth.validation';

/** Social (Google/Apple) accounts have no phone; the OTP and appointment flows need one. */
export default function AddPhoneScreen() {
  // Reachable straight from the '/' entry gate when a phone-less user reopens the app.
  useMarkEntryResolved();

  const insets = useSafeAreaInsets();

  const form = useForm<AddPhoneInput>({
    resolver: zodResolver(addPhoneSchema),
    defaultValues: { phone: '' },
  });

  const { mutate, isPending } = useAddPhone(form.setError);

  const onSubmit = form.handleSubmit((data) => {
    Keyboard.dismiss();
    mutate(data, {
      onSuccess: () => {
        const { user, status } = useAuthStore.getState();
        router.replace(getPostAuthRoute(status, user));
      },
    });
  });

  return (
    <View className="flex-1 bg-background">
      <Image
        source={require('@/assets/images/splash-pattern.png')}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 270 }}
        contentFit="cover"
      />

      <View className="flex-1" style={{ paddingTop: insets.top }}>
        <KeyboardAwareScrollView
          bottomOffset={24}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            className="text-foreground mt-6 text-right text-3xl"
            style={{ fontFamily: 'app-font-bold' }}
          >
            أضف رقم هاتفك
          </Text>
          <Text
            className="text-muted-foreground mt-2 text-lg"
            style={{ fontFamily: 'app-font-regular' }}
          >
            نحتاج رقم هاتفك لتأكيد حسابك وإرسال تنبيهات مواعيدك
          </Text>

          <View className="mt-8">
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
            label="متابعة"
            className="mt-8"
            isLoading={isPending}
            onPress={onSubmit}
          />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}
