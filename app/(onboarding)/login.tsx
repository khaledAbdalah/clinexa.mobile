import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { PasswordField } from '@/components/ui/password-field';
import { PhoneField } from '@/components/ui/phone-field';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';
import { useLogin } from '@/hooks/auth/use-login';
import { getPostAuthRoute } from '@/lib/post-auth-route';
import { useAuthStore } from '@/store/auth';
import { loginSchema, type LoginInput } from '@/validation/auth.validation';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

  const { mutate, isPending } = useLogin(form.setError);

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
              تسجيل الدخول
            </Text>
          </View>
          <Text
            className="text-muted-foreground mt-2 text-lg"
            style={{ fontFamily: 'app-font-regular' }}
          >
            أهلاً بعودتك! سجّل دخولك للمتابعة
          </Text>

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
                  showCountryCode={false}
                />
              )}
            />

            <View className="gap-2">
              <Controller
                control={form.control}
                name="password"
                render={({ field: { onChange, onBlur, value }, fieldState }) => (
                  <PasswordField
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
              <Pressable className="self-end" onPress={() => router.push(routes.forgotPassword)}>
                <Text className="text-primary text-sm" style={{ fontFamily: 'app-font-semibold' }}>
                  نسيت كلمة المرور؟
                </Text>
              </Pressable>
            </View>
          </View>

          <PillButton
            variant="solid"
            label="تسجيل الدخول"
            className="mt-8"
            isLoading={isPending}
            onPress={onSubmit}
          />

          <View className="mt-4 flex-row items-center justify-center gap-1">
            <Text
              className="text-muted-foreground text-sm"
              style={{ fontFamily: 'app-font-regular' }}
            >
              لسه معندكش حساب؟
            </Text>
            <Pressable onPress={() => router.replace(routes.register)}>
              <Text className="text-primary text-sm" style={{ fontFamily: 'app-font-bold' }}>
                إنشاء حساب جديد
              </Text>
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}
