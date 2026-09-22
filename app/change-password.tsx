import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { TabHeader } from '@/components/shared/tab-header';
import { PasswordField } from '@/components/ui/password-field';
import { PillButton } from '@/components/ui/pill-button';
import { useChangePasswordForm } from '@/hooks/profile/use-change-password-form';
import { useRequireAuth } from '@/hooks/use-require-auth';

export default function ChangePasswordScreen() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const { form, handleSubmit, isSubmitting } = useChangePasswordForm();

  return (
    <View className="bg-background flex-1">
      <KeyboardAwareScrollView
        bottomOffset={24}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + BottomTabInset,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TabHeader title="تغيير كلمة المرور" />

        <View className="gap-6 px-6">
          <Controller
            control={form.control}
            name="currentPassword"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <PasswordField
                label="كلمة المرور الحالية"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={fieldState.error?.message}
                autoComplete="current-password"
              />
            )}
          />

          <Controller
            control={form.control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <PasswordField
                label="كلمة المرور الجديدة"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={fieldState.error?.message}
                autoComplete="new-password"
              />
            )}
          />

          <Controller
            control={form.control}
            name="newPasswordConfirmation"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <PasswordField
                label="تأكيد كلمة المرور الجديدة"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={fieldState.error?.message}
                autoComplete="new-password"
              />
            )}
          />
        </View>

        <PillButton
          label="حفظ التغييرات"
          variant="solid"
          className="mx-6 mt-2"
          isLoading={isSubmitting}
          onPress={handleSubmit}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}
