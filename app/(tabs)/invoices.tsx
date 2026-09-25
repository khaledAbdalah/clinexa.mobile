import { Receipt } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { InvoiceRow, type Invoice as InvoiceRowProps } from '@/components/invoices/invoice-row';
import { InvoicesSummaryCard } from '@/components/invoices/invoices-summary-card';
import { SectionHeader } from '@/components/shared/section-header';
import { SegmentedToggle } from '@/components/shared/segmented-toggle';
import { TabHeader } from '@/components/shared/tab-header';
import { useCurrency } from '@/hooks/use-currency';
import { useInvoices } from '@/hooks/invoices/use-invoices';
import { usePullToRefresh } from '@/hooks/queries/use-pull-to-refresh';
import { formatDate } from '@/lib/format-date';
import type { Invoice } from '@/types/invoice.types';

type InvoicesFilter = 'all' | 'unpaid' | 'paid';

const INVOICES_FILTER_OPTIONS: { value: InvoicesFilter; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'unpaid', label: 'غير مدفوعة' },
  { value: 'paid', label: 'مُدفوعة' },
];

function toRowInvoice(invoice: Invoice, formatPrice: (n: number) => string): InvoiceRowProps {
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    amount: formatPrice(invoice.total),
    remaining: invoice.status === 'partial' ? formatPrice(invoice.remainingAmount) : null,
    status: invoice.status,
    date: formatDate(invoice.createdAt),
    doctorName: invoice.encounter?.doctor?.fullName ?? null,
  };
}

export default function InvoicesScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<InvoicesFilter>('all');
  const { formatPrice } = useCurrency();

  const { items: invoices, isLoading, isLoadingMore, hasMore, loadMore, refetch } = useInvoices();
  const { refreshing, onRefresh } = usePullToRefresh(refetch);

  const { visibleInvoices, totalDue, unpaidCount } = useMemo(() => {
    const unpaid = invoices.filter((invoice) => invoice.status !== 'paid');
    const visible =
      filter === 'all'
        ? invoices
        : filter === 'paid'
          ? invoices.filter((invoice) => invoice.status === 'paid')
          : unpaid;

    const due = unpaid.reduce((sum, invoice) => sum + invoice.remainingAmount, 0);

    return { visibleInvoices: visible, totalDue: due, unpaidCount: unpaid.length };
  }, [invoices, filter]);

  return (
    <FlatList
      className="bg-background flex-1"
      data={visibleInvoices}
      renderItem={({ item }) => (
        <View className="px-6 pb-3">
          <InvoiceRow {...toRowInvoice(item, formatPrice)} />
        </View>
      )}
      keyExtractor={(item) => item.id}
      onEndReached={() => hasMore && loadMore()}
      onEndReachedThreshold={0.4}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={
        <View className="gap-5 pb-5">
          <TabHeader title="الفواتير" />

          <SegmentedToggle
            value={filter}
            onChange={setFilter}
            options={INVOICES_FILTER_OPTIONS}
            variant="solid"
          />

          <InvoicesSummaryCard
            totalDue={formatPrice(totalDue)}
            unpaidCount={unpaidCount}
            isPartial={hasMore}
          />

          <SectionHeader icon={Receipt} title="آخر الفواتير" count={visibleInvoices.length} />
        </View>
      }
      ListFooterComponent={
        isLoadingMore ? <ActivityIndicator className="py-4" color="#0d9488" /> : null
      }
      ListEmptyComponent={
        isLoading ? <ActivityIndicator className="py-16" color="#0d9488" /> : null
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
