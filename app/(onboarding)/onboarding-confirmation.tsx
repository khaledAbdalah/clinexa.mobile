import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { useOnboardingConfirmation } from '@/hooks/onboarding/use-onboarding-confirmation';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';

function SummarySection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <View className="border-border gap-3 rounded-2xl border p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-foreground text-lg" style={{ fontFamily: 'app-font-bold' }}>
          {title}
        </Text>
        <Pressable onPress={onEdit} hitSlop={8}>
          <Text className="text-primary text-sm" style={{ fontFamily: 'app-font-semibold' }}>
            تعديل
          </Text>
        </Pressable>
      </View>
      <View className="gap-2">{children}</View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-muted-foreground text-sm" style={{ fontFamily: 'app-font-regular' }}>
        {label}
      </Text>
      <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-semibold' }}>
        {value}
      </Text>
    </View>
  );
}

export default function OnboardingConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const {
    onboarding,
    age,
    birthDateLabel,
    genderLabel,
    allergiesLabel,
    handleConfirm,
    isSubmitting,
  } = useOnboardingConfirmation();

  return (
    <View className="bg-background flex-1">
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center gap-3 px-6 pt-2 pb-2" style={{ direction: 'ltr' }}>
          <Pressable onPress={() => router.back()} hitSlop={12} className="p-2">
            <Icon as={ChevronLeft} size={24} className="text-primary" />
          </Pressable>
          <Text
            className="text-foreground flex-1 text-right text-3xl"
            style={{ fontFamily: 'app-font-bold' }}
          >
            تأكيد المعلومات
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 32 }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            className="text-muted-foreground mt-2 text-base"
            style={{ fontFamily: 'app-font-regular' }}
          >
            راجع بياناتك قبل الإرسال
          </Text>

          <View className="mt-8 gap-4">
            <SummarySection
              title="بياناتك الشخصية"
              onEdit={() => router.push(routes.onboardingPersonalDetails)}
            >
              <SummaryRow label="النوع" value={genderLabel} />
              <SummaryRow label="تاريخ الميلاد" value={`${birthDateLabel} (العمر ${age} سنة)`} />
              <SummaryRow label="العنوان" value={onboarding.address || '—'} />
            </SummarySection>

            <SummarySection
              title="معلوماتك الطبية"
              onEdit={() => router.push(routes.onboardingMedicalInfo)}
            >
              <SummaryRow label="فصيلة الدم" value={onboarding.bloodType ?? '—'} />
              <SummaryRow label="الحساسية" value={allergiesLabel} />
            </SummarySection>

            <SummarySection
              title="التاريخ المرضي"
              onEdit={() => router.push(routes.onboardingMedicalHistory)}
            >
              <SummaryRow label="أمراض مزمنة" value={onboarding.chronicConditions || '—'} />
              <SummaryRow label="أدوية حالية" value={onboarding.currentMedications || '—'} />
              <SummaryRow label="ملاحظات" value={onboarding.notes || '—'} />
            </SummarySection>
          </View>

          <PillButton
            label="تأكيد"
            variant="solid"
            className="mt-8"
            isLoading={isSubmitting}
            onPress={handleConfirm}
          />
        </ScrollView>
      </View>
    </View>
  );
}
