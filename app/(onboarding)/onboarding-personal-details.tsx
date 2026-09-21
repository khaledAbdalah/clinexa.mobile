import { router } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';
import { calculateAge, MONTHS } from '@/lib/birth-date';
import { routes } from '@/constants/routes';
import { useMarkEntryResolved } from '@/hooks/use-mark-entry-resolved';
import { useOnboardingStore } from '@/store/onboarding';
import { FieldLabel, FieldRow } from '@/components/form-field';
import { BottomSheet } from '@/components/bottom-sheet';
import { OnboardingStepIndicator } from '@/components/onboarding/step-indicator';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';

const CURRENT_YEAR = new Date().getFullYear();

export default function OnboardingPersonalDetailsScreen() {
  // Reachable straight from the '/' entry gate (onboarded-incomplete user
  // reopening the app), not just from otp-verification — see
  // useMarkEntryResolved's docblock.
  useMarkEntryResolved();

  const insets = useSafeAreaInsets();
  const onboarding = useOnboardingStore();

  const [dayText, setDayText] = useState(String(onboarding.birthDay).padStart(2, '0'));
  const [yearText, setYearText] = useState(String(onboarding.birthYear));
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  const gender = onboarding.gender;
  const birthMonthIndex = onboarding.birthMonthIndex;
  const address = onboarding.address;

  const birthDay = Math.min(Math.max(Number(dayText) || 1, 1), 31);
  const birthYear = Math.min(Math.max(Number(yearText) || CURRENT_YEAR, 1900), CURRENT_YEAR);
  const age = calculateAge(birthDay, birthMonthIndex, birthYear);

  const handleSelectMonth = (value: number) => {
    onboarding.update({ birthMonthIndex: value });
    setIsMonthPickerOpen(false);
  };

  return (
    <View className="bg-background flex-1">
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        <OnboardingStepIndicator step="onboardingPersonalDetails" />

        <KeyboardAwareScrollView
          bottomOffset={120}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-foreground mt-2 text-3xl" style={{ fontFamily: 'app-font-bold' }}>
            بياناتك الشخصية
          </Text>
          <Text
            className="text-muted-foreground mt-2 text-base"
            style={{ fontFamily: 'app-font-regular' }}
          >
            معلومات أساسية تساعدنا في تقديم أفضل رعاية
          </Text>

          <View className="mt-8 gap-6">
            <View className="gap-2">
              <FieldLabel label="النوع" />
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => onboarding.update({ gender: 'female' })}
                  className={cn(
                    'h-14 flex-1 items-center justify-center rounded-xl border',
                    gender === 'female' ? 'bg-primary border-primary' : 'border-input bg-background'
                  )}
                >
                  <Text
                    className={gender === 'female' ? 'text-primary-foreground' : 'text-foreground'}
                    style={{ fontFamily: 'app-font-semibold' }}
                  >
                    أنثى
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => onboarding.update({ gender: 'male' })}
                  className={cn(
                    'h-14 flex-1 items-center justify-center rounded-xl border',
                    gender === 'male' ? 'bg-primary border-primary' : 'border-input bg-background'
                  )}
                >
                  <Text
                    className={gender === 'male' ? 'text-primary-foreground' : 'text-foreground'}
                    style={{ fontFamily: 'app-font-semibold' }}
                  >
                    ذكر
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="gap-2">
              <FieldLabel label="تاريخ الميلاد" />
              <View className="flex-row items-center gap-2">
                <Input
                  className="text-foreground h-14 flex-1 rounded-xl border-input bg-background text-center text-base"
                  style={{ fontFamily: 'app-font-semibold' }}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={dayText}
                  onChangeText={(text) => {
                    const digits = text.replace(/[^0-9]/g, '').slice(0, 2);
                    const clamped = digits === '' ? '' : String(Math.min(Number(digits), 31));
                    setDayText(clamped);
                    if (clamped !== '') onboarding.update({ birthDay: Number(clamped) });
                  }}
                  placeholder="يوم"
                />
                <Pressable
                  onPress={() => setIsMonthPickerOpen(true)}
                  className="border-input bg-background h-14 flex-[1.4] items-center justify-center rounded-xl border"
                >
                  <Text
                    className="text-foreground text-base"
                    style={{ fontFamily: 'app-font-semibold' }}
                  >
                    {MONTHS[birthMonthIndex]}
                  </Text>
                </Pressable>
                <Input
                  className="text-foreground h-14 flex-1 rounded-xl border-input bg-background text-center text-base"
                  style={{ fontFamily: 'app-font-semibold' }}
                  keyboardType="number-pad"
                  maxLength={4}
                  value={yearText}
                  onChangeText={(text) => {
                    const digits = text.replace(/[^0-9]/g, '').slice(0, 4);
                    const clamped =
                      digits === '' ? '' : String(Math.min(Number(digits), CURRENT_YEAR));
                    setYearText(clamped);
                    if (clamped !== '') onboarding.update({ birthYear: Number(clamped) });
                  }}
                  placeholder="سنة"
                />
                <View className="bg-accent h-14 items-center justify-center rounded-full px-3">
                  <Text
                    className="text-primary text-xs"
                    style={{ fontFamily: 'app-font-semibold' }}
                  >
                    العمر {age} سنة
                  </Text>
                </View>
              </View>
            </View>

            <View className="gap-2">
              <FieldLabel label="العنوان" />
              <FieldRow>
                <Input
                  className="text-foreground h-14 flex-1 border-0 bg-transparent text-right text-lg leading-7 shadow-none"
                  placeholder="أدخل عنوانك"
                  value={address}
                  onChangeText={(text) => onboarding.update({ address: text })}
                />
                <Icon as={MapPin} size={18} className="text-muted-foreground" />
              </FieldRow>
            </View>
          </View>

          <PillButton
            label="التالي"
            variant="solid"
            className="mt-8"
            onPress={() => router.push(routes.onboardingMedicalInfo)}
          />
        </KeyboardAwareScrollView>
      </View>

      <BottomSheet
        visible={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
        title="الشهر"
      >
        <View className="px-2">
          {MONTHS.map((label, index) => (
            <Pressable
              key={label}
              onPress={() => handleSelectMonth(index)}
              className={cn('rounded-xl px-4 py-3', index === birthMonthIndex && 'bg-accent')}
            >
              <Text
                className={cn(
                  'text-right text-base',
                  index === birthMonthIndex ? 'text-primary' : 'text-foreground'
                )}
                style={{ fontFamily: 'app-font-semibold' }}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}
