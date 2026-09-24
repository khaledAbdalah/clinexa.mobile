import { router } from 'expo-router';
import { Calendar, History, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { BottomTabInset } from '@/constants/theme';
import { AppointmentCard } from '@/components/appointments/appointment-card';
import { EndOfAppointmentsNote } from '@/components/appointments/end-of-appointments-note';
import { MonthHeaderRow } from '@/components/appointments/month-header-row';
import { NoMoreAppointmentsCard } from '@/components/appointments/no-more-appointments-card';
import { EmptyAppointmentsCard } from '@/components/home/empty-appointments-card';
import { SectionHeader } from '@/components/shared/section-header';
import { SegmentedToggle } from '@/components/shared/segmented-toggle';
import { TabHeader } from '@/components/shared/tab-header';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import {
  useAppointmentRows,
  type AppointmentsTab,
} from '@/hooks/appointments/use-appointment-rows';
import { useAppointments } from '@/hooks/appointments/use-appointments';
import { useCancelAppointment } from '@/hooks/appointments/use-cancel-appointment';

const APPOINTMENTS_TAB_OPTIONS: { value: AppointmentsTab; label: string }[] = [
  { value: 'upcoming', label: 'القادمة' },
  { value: 'past', label: 'السابقة' },
];

export default function AppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<AppointmentsTab>('upcoming');

  // Real cursor pagination via `useListQuery` (`use-appointments.ts`), same pattern as
  // `useNotifications`.
  const { items: appointments, isLoading, isLoadingMore, hasMore, loadMore } = useAppointments();
  const cancelAppointment = useCancelAppointment();
  const { rows, upcomingCount, pastCount } = useAppointmentRows(appointments, tab);

  const cancellingId = cancelAppointment.isPending ? (cancelAppointment.variables ?? null) : null;

  return (
    <View className="bg-background flex-1">
      <FlatList
        className="bg-background flex-1"
        data={rows}
        keyExtractor={(row) => row.key}
        renderItem={({ item }) =>
          item.type === 'monthHeader' ? (
            <MonthHeaderRow month={item.month} expanded={item.expanded} onToggle={item.onToggle} />
          ) : (
            <View className="pb-3">
              <AppointmentCard
                {...item.card}
                onCancel={(id) => cancelAppointment.mutate(id)}
                isCancelling={cancellingId === item.card.id}
              />
            </View>
          )
        }
        onEndReached={() => hasMore && loadMore()}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <View className="gap-5 pb-5">
            <TabHeader title="المواعيد" />
            <SegmentedToggle value={tab} onChange={setTab} options={APPOINTMENTS_TAB_OPTIONS} />
            {!isLoading ? (
              tab === 'upcoming' ? (
                <SectionHeader icon={Calendar} title="المواعيد القادمة" count={upcomingCount} />
              ) : (
                <SectionHeader icon={History} title="المواعيد السابقة" count={pastCount} />
              )
            ) : null}
          </View>
        }
        ListFooterComponent={
          <View className="gap-4 pt-2">
            {isLoadingMore ? <ActivityIndicator className="py-4" color="#0d9488" /> : null}
            {!isLoading && !hasMore && tab === 'past' && rows.length > 0 ? (
              <EndOfAppointmentsNote />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator className="py-16" color="#0d9488" />
          ) : tab === 'upcoming' ? (
            <EmptyAppointmentsCard />
          ) : (
            <NoMoreAppointmentsCard />
          )
        }
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + BottomTabInset,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      />

      <FloatingActionButton
        icon={Plus}
        onPress={() => router.push(routes.bookAppointment)}
        bottom={insets.bottom + BottomTabInset + 16}
      />
    </View>
  );
}
