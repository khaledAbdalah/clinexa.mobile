import { FileText } from 'lucide-react-native';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import {
  PrescriptionCard,
  type Prescription as PrescriptionCardProps,
} from '@/components/prescriptions/prescription-card';
import { SectionHeader } from '@/components/shared/section-header';
import { TabHeader } from '@/components/shared/tab-header';
import { Text } from '@/components/ui/text';
import { usePrescriptions } from '@/hooks/prescriptions/use-prescriptions';
import { usePullToRefresh } from '@/hooks/queries/use-pull-to-refresh';
import { formatDate } from '@/lib/format-date';
import type { Prescription } from '@/types/prescription.types';

function toCardPrescription(prescription: Prescription): PrescriptionCardProps {
  const doctor = prescription.encounter?.doctor;

  return {
    id: prescription.id,
    date: formatDate(prescription.createdAt),
    doctorName: doctor?.fullName ?? 'طبيب',
    doctorSpecialty: doctor?.specialty ?? null,
    notes: prescription.notes,
  };
}

export default function PrescriptionsScreen() {
  const insets = useSafeAreaInsets();

  const {
    items: prescriptions,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    refetch,
  } = usePrescriptions();
  const { refreshing, onRefresh } = usePullToRefresh(refetch);

  return (
    <FlatList
      className="bg-background flex-1"
      data={prescriptions}
      renderItem={({ item }) => (
        <View className="px-6 pb-3">
          <PrescriptionCard {...toCardPrescription(item)} />
        </View>
      )}
      keyExtractor={(item) => item.id}
      onEndReached={() => hasMore && loadMore()}
      onEndReachedThreshold={0.4}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={
        <View className="gap-5 pb-5">
          <TabHeader title="الروشتات" />
          <SectionHeader icon={FileText} title="الروشتات" count={prescriptions.length} />
        </View>
      }
      ListFooterComponent={
        isLoadingMore ? <ActivityIndicator className="py-4" color="#0d9488" /> : null
      }
      ListEmptyComponent={
        isLoading ? (
          <ActivityIndicator className="py-16" color="#0d9488" />
        ) : (
          <View className="items-center px-6 py-10">
            <Text
              className="text-muted-foreground text-sm"
              style={{ fontFamily: 'app-font-semibold' }}
            >
              لا توجد روشتات
            </Text>
          </View>
        )
      }
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + BottomTabInset,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}
