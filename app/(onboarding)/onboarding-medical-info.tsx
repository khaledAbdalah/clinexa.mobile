import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';
import { routes } from '@/constants/routes';
import { useOnboardingStore } from '@/store/onboarding';
import { FieldLabel, FieldRow } from '@/components/form-field';
import { OnboardingStepIndicator } from '@/components/onboarding/step-indicator';
import { Input } from '@/components/ui/input';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const NO_ALLERGIES = 'لا يوجد';

const ALLERGIES: { label: string; activeClassName: string }[] = [
  { label: 'بنسلين', activeClassName: 'bg-amber-100 border-amber-400' },
  { label: 'لاكتوز', activeClassName: 'bg-cyan-100 border-cyan-400' },
  { label: 'مكسرات', activeClassName: 'bg-lime-100 border-lime-400' },
  { label: 'أسبرين', activeClassName: 'bg-sky-100 border-sky-400' },
  { label: 'غبار', activeClassName: 'bg-rose-100 border-rose-400' },
  { label: NO_ALLERGIES, activeClassName: 'bg-muted border-muted-foreground/40' },
];

export default function OnboardingMedicalInfoScreen() {
  const insets = useSafeAreaInsets();
  const onboarding = useOnboardingStore();

  const bloodType = onboarding.bloodType;
  const selectedAllergies = onboarding.allergies;
  const otherAllergy = onboarding.otherAllergy;

  const toggleAllergy = (label: string) => {
    const current = onboarding.allergies;
    if (label === NO_ALLERGIES) {
      onboarding.update({ allergies: current.includes(NO_ALLERGIES) ? [] : [NO_ALLERGIES] });
      return;
    }
    const withoutNoAllergies = current.filter((item) => item !== NO_ALLERGIES);
    onboarding.update({
      allergies: withoutNoAllergies.includes(label)
        ? withoutNoAllergies.filter((item) => item !== label)
        : [...withoutNoAllergies, label],
    });
  };

  return (
    <View className="bg-background flex-1">
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        <OnboardingStepIndicator step="onboardingMedicalInfo" />

        <KeyboardAwareScrollView
          bottomOffset={120}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-foreground mt-2 text-3xl" style={{ fontFamily: 'app-font-bold' }}>
            معلوماتك الطبية
          </Text>
          <Text
            className="text-muted-foreground mt-2 text-base"
            style={{ fontFamily: 'app-font-regular' }}
          >
            معلومات تساعد في تقييم حالتك الصحية
          </Text>

          <View className="mt-8 gap-6">
            <View className="gap-2">
              <FieldLabel label="فصيلة الدم" />
              <View className="flex-row flex-wrap gap-2">
                {BLOOD_TYPES.map((type) => {
                  const isSelected = bloodType === type;
                  return (
                    <Pressable
                      key={type}
                      onPress={() => onboarding.update({ bloodType: type })}
                      className={cn(
                        'h-12 items-center justify-center rounded-xl border',
                        isSelected ? 'bg-primary border-primary' : 'border-input bg-background'
                      )}
                      style={{ width: '23%' }}
                    >
                      <Text
                        className={isSelected ? 'text-primary-foreground' : 'text-foreground'}
                        style={{ fontFamily: 'app-font-semibold' }}
                      >
                        {type}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="gap-3">
              <FieldLabel label="الحساسية" />
              <View className="flex-row flex-wrap gap-2">
                {ALLERGIES.map(({ label, activeClassName }) => {
                  const isSelected = selectedAllergies.includes(label);
                  return (
                    <Pressable
                      key={label}
                      onPress={() => toggleAllergy(label)}
                      className={cn(
                        'rounded-full border px-4 py-2',
                        isSelected ? activeClassName : 'border-input bg-background'
                      )}
                    >
                      <Text
                        className="text-foreground text-sm"
                        style={{ fontFamily: 'app-font-semibold' }}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <FieldRow>
                <Input
                  className="text-foreground h-14 flex-1 border-0 bg-transparent text-right text-lg leading-7 shadow-none"
                  placeholder="أضف حساسية أخرى"
                  value={otherAllergy}
                  onChangeText={(text) => onboarding.update({ otherAllergy: text })}
                />
              </FieldRow>
            </View>
          </View>

          <PillButton
            label="التالي"
            variant="solid"
            className="mt-8"
            onPress={() => router.push(routes.onboardingMedicalHistory)}
          />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}
