import { MapPin } from 'lucide-react-native';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';
import { MONTHS } from '@/lib/birth-date';
import { BottomTabInset } from '@/constants/theme';
import { ALLERGY_OPTIONS, BLOOD_TYPES, useEditProfile } from '@/hooks/profile/use-edit-profile';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { BottomSheet } from '@/components/bottom-sheet';
import { FieldLabel, FieldRow } from '@/components/form-field';
import { TabHeader } from '@/components/shared/tab-header';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';

export default function EditProfileScreen() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const {
    isLoading,
    fullName,
    setFullName,
    gender,
    setGender,
    dayText,
    setDayText,
    monthIndex,
    yearText,
    setYearText,
    age,
    isMonthPickerOpen,
    setIsMonthPickerOpen,
    handleSelectMonth,
    address,
    setAddress,
    bloodType,
    setBloodType,
    selectedAllergies,
    toggleAllergy,
    otherAllergy,
    setOtherAllergy,
    chronicConditions,
    setChronicConditions,
    currentMedications,
    setCurrentMedications,
    notes,
    setNotes,
    handleSubmit,
    isSubmitting,
  } = useEditProfile();

  if (isLoading) {
    return (
      <View
        className="bg-background flex-1 items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="bg-background flex-1">
      <KeyboardAwareScrollView
        bottomOffset={120}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + BottomTabInset,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TabHeader title="المعلومات الشخصية" />

        <View className="gap-6 px-6">
          <View className="gap-2">
            <FieldLabel label="الاسم بالكامل" />
            <FieldRow>
              <Input
                className="text-foreground h-14 flex-1 border-0 bg-transparent text-right text-lg leading-7 shadow-none"
                placeholder="أدخل اسمك بالكامل"
                value={fullName}
                onChangeText={setFullName}
              />
            </FieldRow>
          </View>

          <View className="gap-2">
            <FieldLabel label="النوع" />
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setGender('female')}
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
                onPress={() => setGender('male')}
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
                  {MONTHS[monthIndex]}
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
                  setYearText(digits);
                }}
                placeholder="سنة"
              />
              <View className="bg-accent h-14 items-center justify-center rounded-full px-3">
                <Text className="text-primary text-xs" style={{ fontFamily: 'app-font-semibold' }}>
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
                onChangeText={setAddress}
              />
              <Icon as={MapPin} size={18} className="text-muted-foreground" />
            </FieldRow>
          </View>

          <View className="gap-2">
            <FieldLabel label="فصيلة الدم" />
            <View className="flex-row flex-wrap gap-2">
              {BLOOD_TYPES.map((type) => {
                const isSelected = bloodType === type;
                return (
                  <Pressable
                    key={type}
                    onPress={() => setBloodType(type)}
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
              {ALLERGY_OPTIONS.map(({ label, activeClassName }) => {
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
                onChangeText={setOtherAllergy}
              />
            </FieldRow>
          </View>

          <View className="gap-2">
            <FieldLabel label="أمراض مزمنة" />
            <Textarea
              className="text-right"
              placeholder="مثال: سكري، ضغط الدم"
              value={chronicConditions}
              onChangeText={setChronicConditions}
            />
          </View>

          <View className="gap-2">
            <FieldLabel label="أدوية تتناولها حاليًا" />
            <Textarea
              className="text-right"
              placeholder="مثال: أنسولين، أدوية ضغط"
              value={currentMedications}
              onChangeText={setCurrentMedications}
            />
          </View>

          <View className="gap-2">
            <FieldLabel label="ملاحظات إضافية" />
            <Textarea
              className="text-right"
              placeholder="أي معلومات تانية تحب تشاركها مع الطبيب"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        <PillButton
          label="حفظ التغييرات"
          variant="solid"
          className="mx-6 mt-2"
          isLoading={isSubmitting}
          onPress={handleSubmit}
        />
      </KeyboardAwareScrollView>

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
              className={cn('rounded-xl px-4 py-3', index === monthIndex && 'bg-accent')}
            >
              <Text
                className={cn(
                  'text-right text-base',
                  index === monthIndex ? 'text-primary' : 'text-foreground'
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
