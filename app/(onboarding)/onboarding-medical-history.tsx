import { router } from 'expo-router';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { useOnboardingStore } from '@/store/onboarding';
import { FieldLabel } from '@/components/form-field';
import { OnboardingStepIndicator } from '@/components/onboarding/step-indicator';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';

export default function OnboardingMedicalHistoryScreen() {
  const insets = useSafeAreaInsets();
  const onboarding = useOnboardingStore();

  return (
    <View className="bg-background flex-1">
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        <OnboardingStepIndicator step="onboardingMedicalHistory" />

        <KeyboardAwareScrollView
          bottomOffset={160}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-foreground mt-2 text-3xl" style={{ fontFamily: 'app-font-bold' }}>
            التاريخ المرضي
          </Text>
          <Text
            className="text-muted-foreground mt-2 text-base"
            style={{ fontFamily: 'app-font-regular' }}
          >
            معلومات إضافية تساعد الطبيب على متابعتك
          </Text>

          <View className="mt-8 gap-6">
            <View className="gap-2">
              <FieldLabel label="أمراض مزمنة" />
              <Textarea
                className="text-right"
                placeholder="مثال: سكري، ضغط الدم"
                value={onboarding.chronicConditions}
                onChangeText={(text) => onboarding.update({ chronicConditions: text })}
              />
            </View>

            <View className="gap-2">
              <FieldLabel label="أدوية تتناولها حاليًا" />
              <Textarea
                className="text-right"
                placeholder="مثال: أنسولين، أدوية ضغط"
                value={onboarding.currentMedications}
                onChangeText={(text) => onboarding.update({ currentMedications: text })}
              />
            </View>

            <View className="gap-2">
              <FieldLabel label="ملاحظات إضافية" />
              <Textarea
                className="text-right"
                placeholder="أي معلومات تانية تحب تشاركها مع الطبيب"
                value={onboarding.notes}
                onChangeText={(text) => onboarding.update({ notes: text })}
              />
            </View>
          </View>

          <PillButton
            label="التالي"
            variant="solid"
            className="mt-8"
            onPress={() => router.push(routes.onboardingConfirmation)}
          />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}
