import { Calendar, Pill, Receipt, Stethoscope, Wallet } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { FilterChips, type FilterChipOption } from '@/components/shared/filter-chips';
import { TabHeader } from '@/components/shared/tab-header';
import { EmptyTimelineCard } from '@/components/timeline/empty-timeline-card';
import { TimelineItem } from '@/components/timeline/timeline-item';
import { TimelineMonthHeader } from '@/components/timeline/timeline-month-header';
import { usePatientTimeline } from '@/hooks/patient/use-patient-timeline';
import {
  useTimelineRows,
  type TimelineFilter,
  type TimelineRow,
} from '@/hooks/patient/use-timeline-rows';
import { usePullToRefresh } from '@/hooks/queries/use-pull-to-refresh';
import { useRequireAuth } from '@/hooks/use-require-auth';

const FILTER_OPTIONS: FilterChipOption<TimelineFilter>[] = [
  { value: 'all', label: 'الكل' },
  { value: 'appointment', label: 'مواعيد', icon: Calendar },
  { value: 'visit', label: 'زيارات', icon: Stethoscope },
  { value: 'prescription', label: 'روشتات', icon: Pill },
  { value: 'invoice', label: 'فواتير', icon: Receipt },
  { value: 'payment', label: 'مدفوعات', icon: Wallet },
];

function renderRow({ item }: { item: TimelineRow }) {
  return item.type === 'monthHeader' ? (
    <TimelineMonthHeader month={item.month} count={item.count} isFirst={item.isFirst} />
  ) : (
    <TimelineItem event={item.event} isLast={item.isLast} />
  );
}

export default function MedicalTimelineScreen() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<TimelineFilter>('all');
  const { data: entries, isLoading, refetch } = usePatientTimeline();
  const { refreshing, onRefresh } = usePullToRefresh(refetch);
  const rows = useTimelineRows(entries, filter);

  return (
    <FlatList
      className="bg-background flex-1"
      data={rows}
      renderItem={renderRow}
      keyExtractor={(row) => row.key}
      ListHeaderComponent={
        <View className="gap-5 pb-5">
          <TabHeader title="السجل المرضي" subtitle="كل بياناتك الطبية في مكان واحد" />
          <FilterChips value={filter} onChange={setFilter} options={FILTER_OPTIONS} />
        </View>
      }
      ListEmptyComponent={
        isLoading ? (
          <ActivityIndicator className="py-16" color="#0d9488" />
        ) : (
          <EmptyTimelineCard isFiltered={filter !== 'all'} />
        )
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0d9488" />
      }
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + BottomTabInset,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}
