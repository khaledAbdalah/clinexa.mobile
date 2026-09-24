import { useLocalSearchParams } from 'expo-router';
import { Pill } from 'lucide-react-native';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { MedicationCard } from '@/components/prescriptions/medication-card';
import { Text } from '@/components/ui/text';
import { TabHeader } from '@/components/shared/tab-header';
import { usePrescription } from '@/hooks/prescriptions/use-prescription';
import { usePullToRefresh } from '@/hooks/queries/use-pull-to-refresh';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { formatDate } from '@/lib/format-date';
import { initials } from '@/lib/initials';

export default function PrescriptionDetailScreen() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: prescription, isLoading, error, refetch } = usePrescription(id);
  const { refreshing, onRefresh } = usePullToRefresh(refetch);

  // Complaint/diagnosis on the encounter are intentionally not shown to the patient.
  const doctor = prescription?.encounter?.doctor;

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + BottomTabInset,
        gap: 20,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0d9488" />
      }
    >
      <TabHeader title="تفاصيل الروشتة" />

      {isLoading ? (
        <ActivityIndicator className="py-16" color="#0d9488" />
      ) : error || !prescription ? (
        <View className="items-center px-6 py-16">
          <Text
            className="text-muted-foreground text-sm"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            {error?.response?.data?.message ?? 'تعذر العثور على الروشتة'}
          </Text>
        </View>
      ) : (
        <>
          <View className="bg-card border-border mx-6 gap-4 rounded-2xl border p-4">
            <View className="flex-row items-center gap-3">
              <Avatar alt={doctor?.fullName ?? 'طبيب'} className="h-12 w-12">
                <AvatarFallback className="bg-accent">
                  <Text className="text-primary text-sm" style={{ fontFamily: 'app-font-bold' }}>
                    {initials(doctor?.fullName ?? null) ?? '؟'}
                  </Text>
                </AvatarFallback>
              </Avatar>

              <View className="flex-1 items-start gap-0.5">
                <Text className="text-foreground text-base" style={{ fontFamily: 'app-font-bold' }}>
                  {doctor?.fullName ?? 'طبيب'}
                </Text>
                {doctor?.specialty ? (
                  <Text
                    className="text-muted-foreground text-xs"
                    style={{ fontFamily: 'app-font-semibold' }}
                  >
                    {doctor.specialty}
                  </Text>
                ) : null}
              </View>
            </View>

            <Text
              className="text-muted-foreground text-xs"
              style={{ fontFamily: 'app-font-semibold' }}
            >
              {formatDate(prescription.createdAt)}
            </Text>

            {prescription.notes ? (
              <View className="border-border items-start gap-0.5 border-t pt-3">
                <Text
                  className="text-muted-foreground text-xs"
                  style={{ fontFamily: 'app-font-semibold' }}
                >
                  ملاحظات
                </Text>
                <Text
                  className="text-foreground text-sm"
                  style={{ fontFamily: 'app-font-semibold' }}
                >
                  {prescription.notes}
                </Text>
              </View>
            ) : null}
          </View>

          <View className="gap-3">
            <View className="flex-row items-center gap-2 px-6">
              <Icon as={Pill} size={18} className="text-primary" />
              <Text className="text-foreground text-base" style={{ fontFamily: 'app-font-bold' }}>
                الأدوية
              </Text>
              <View className="bg-muted h-6 w-6 items-center justify-center rounded-full">
                <Text className="text-foreground text-xs" style={{ fontFamily: 'app-font-bold' }}>
                  {prescription.items?.length ?? 0}
                </Text>
              </View>
            </View>

            {prescription.items && prescription.items.length > 0 ? (
              <View className="gap-3">
                {prescription.items.map((item) => (
                  <MedicationCard key={item.id} item={item} />
                ))}
              </View>
            ) : (
              <View className="items-center px-6 py-6">
                <Text
                  className="text-muted-foreground text-sm"
                  style={{ fontFamily: 'app-font-semibold' }}
                >
                  لا توجد أدوية في هذه الروشتة
                </Text>
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}
