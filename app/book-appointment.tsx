import { Ban } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { BookingCalendar } from '@/components/appointments/booking-calendar';
import { DoctorOptionCard } from '@/components/appointments/doctor-option-card';
import { ServiceOptionCard } from '@/components/appointments/service-option-card';
import { TabHeader } from '@/components/shared/tab-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FieldLabel } from '@/components/form-field';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { useBookAppointmentForm } from '@/hooks/appointments/use-book-appointment-form';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { initials } from '@/lib/initials';
import { cn } from '@/lib/utils';

export default function BookAppointmentScreen() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const {
    doctors,
    isLoadingDoctors,
    selectedDoctor,
    selectDoctor,
    changeDoctor,
    services,
    isLoadingServices,
    selectedService,
    selectService,
    clearService,
    workingDays,
    minDate,
    maxDate,
    disabledDates,
    selectedDate,
    setSelectedDate,
    notes,
    setNotes,
    canSubmit,
    isSubmitting,
    handleSubmit,
  } = useBookAppointmentForm();

  return (
    <View className="bg-background flex-1">
      <KeyboardAwareScrollView
        bottomOffset={120}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + BottomTabInset,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TabHeader title="حجز موعد جديد" />

        {/* Step 1: doctor selection */}
        <View className="gap-3">
          <View className="px-6">
            <FieldLabel label="اختر الطبيب" />
          </View>

          {isLoadingDoctors ? (
            <ActivityIndicator className="py-8" color="#0d9488" />
          ) : !doctors?.length ? (
            <View className="mx-6">
              <Text
                className="text-muted-foreground text-center text-sm"
                style={{ fontFamily: 'app-font-semibold' }}
              >
                لا يوجد أطباء متاحين حاليًا
              </Text>
            </View>
          ) : selectedDoctor ? (
            <Pressable
              onPress={changeDoctor}
              className="border-primary bg-accent mx-6 flex-row items-center gap-3 rounded-2xl border p-4"
            >
              <Avatar alt={selectedDoctor.fullName} className="h-11 w-11">
                <AvatarFallback className="bg-primary/10">
                  <Text className="text-primary text-sm" style={{ fontFamily: 'app-font-bold' }}>
                    {initials(selectedDoctor.fullName) ?? '؟'}
                  </Text>
                </AvatarFallback>
              </Avatar>
              <View className="flex-1 items-start">
                <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-bold' }}>
                  {selectedDoctor.fullName}
                </Text>
                <Text
                  className="text-muted-foreground text-xs"
                  style={{ fontFamily: 'app-font-semibold' }}
                >
                  {selectedDoctor.specialty ?? 'طبيب عام'}
                </Text>
              </View>
              <Text className="text-primary text-xs" style={{ fontFamily: 'app-font-bold' }}>
                تغيير
              </Text>
            </Pressable>
          ) : (
            <View className="gap-3">
              {doctors.map((doctor) => (
                <DoctorOptionCard
                  key={doctor.id}
                  doctor={doctor}
                  selected={false}
                  onPress={() => selectDoctor(doctor)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Step 2: service selection — optional, only once a doctor is picked */}
        {selectedDoctor ? (
          <View className="gap-3">
            <View className="px-6">
              <FieldLabel label="اختر الخدمة" optionalHint="اختياري" />
            </View>

            {isLoadingServices ? (
              <ActivityIndicator className="py-8" color="#0d9488" />
            ) : !services?.length ? null : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
              >
                <Pressable
                  onPress={clearService}
                  className={cn(
                    'w-40 gap-3 rounded-2xl border p-4',
                    selectedService ? 'border-border bg-card' : 'border-primary bg-accent'
                  )}
                >
                  <View
                    className={cn(
                      'h-10 w-10 items-center justify-center rounded-full',
                      selectedService ? 'bg-accent' : 'bg-primary'
                    )}
                  >
                    <Icon
                      as={Ban}
                      size={18}
                      className={selectedService ? 'text-primary' : 'text-primary-foreground'}
                    />
                  </View>
                  <Text
                    className="text-foreground text-sm"
                    style={{ fontFamily: 'app-font-bold' }}
                    numberOfLines={2}
                  >
                    بدون خدمة محددة
                  </Text>
                </Pressable>
                {services.map((service) => (
                  <ServiceOptionCard
                    key={service.id}
                    service={service}
                    selected={selectedService?.id === service.id}
                    onPress={() => selectService(service)}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        ) : null}

        {/* Step 3: date selection — only once a doctor is picked */}
        {selectedDoctor ? (
          <View className="gap-3">
            <View className="px-6">
              <FieldLabel label="اختر الموعد" />
            </View>

            {workingDays.size === 0 ? (
              <View className="mx-6">
                <Text
                  className="text-muted-foreground text-center text-sm"
                  style={{ fontFamily: 'app-font-semibold' }}
                >
                  لا توجد مواعيد متاحة لهذا الطبيب
                </Text>
              </View>
            ) : (
              <BookingCalendar
                // Remount per doctor so the visible month resets to the current one.
                key={selectedDoctor.id}
                workingDays={workingDays}
                minDate={minDate}
                maxDate={maxDate}
                disabledDates={disabledDates}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            )}
          </View>
        ) : null}

        {/* Notes — optional, only shown once a doctor is picked */}
        {selectedDoctor ? (
          <View className="gap-2 px-6">
            <FieldLabel label="ملاحظات" optionalHint="اختياري" />
            <Textarea
              className="text-right"
              placeholder="أي معلومات تحب تشاركها مع الطبيب قبل الموعد"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        ) : null}

        {selectedDoctor ? (
          <PillButton
            label="تأكيد الحجز"
            variant="solid"
            className="mx-6 mt-2"
            disabled={!canSubmit}
            isLoading={isSubmitting}
            onPress={handleSubmit}
          />
        ) : null}
      </KeyboardAwareScrollView>
    </View>
  );
}
