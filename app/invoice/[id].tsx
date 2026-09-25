import { useLocalSearchParams } from 'expo-router';
import { Calendar, CalendarClock, CreditCard, ListChecks, Receipt } from 'lucide-react-native';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import {
  INSTALLMENT_STATUS,
  INVOICE_STATUS,
  paymentMethodLabel,
} from '@/components/invoices/invoice-status';
import { CopyButton } from '@/components/shared/copy-button';
import { SectionHeader } from '@/components/shared/section-header';
import { TabHeader } from '@/components/shared/tab-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useCurrency } from '@/hooks/use-currency';
import { useInvoice } from '@/hooks/invoices/use-invoice';
import { usePullToRefresh } from '@/hooks/queries/use-pull-to-refresh';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { formatDate } from '@/lib/format-date';
import { initials } from '@/lib/initials';
import { cn } from '@/lib/utils';

function AmountRow({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <View className="flex-row items-start justify-between gap-3">
      <Text
        className={cn(
          'flex-1 text-sm leading-6',
          emphasize ? 'text-foreground' : 'text-muted-foreground'
        )}
        style={{ fontFamily: emphasize ? 'app-font-bold' : 'app-font-semibold' }}
      >
        {label}
      </Text>
      <Text
        className={cn('shrink-0 leading-6', emphasize ? 'text-foreground text-base' : 'text-sm')}
        style={{ fontFamily: 'app-font-bold' }}
      >
        {value}
      </Text>
    </View>
  );
}

function StatusChip({ label, chip, text }: { label: string; chip: string; text: string }) {
  return (
    <View className={cn('shrink-0 rounded-full px-2.5 py-1', chip)}>
      <Text className={cn('text-xs', text)} style={{ fontFamily: 'app-font-bold' }}>
        {label}
      </Text>
    </View>
  );
}

export default function InvoiceDetailScreen() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: invoice, isLoading, error, refetch } = useInvoice(id);
  const { refreshing, onRefresh } = usePullToRefresh(refetch);
  const { formatPrice } = useCurrency();

  const doctor = invoice?.encounter?.doctor;

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
      <TabHeader
        title={invoice ? `فاتورة ${invoice.invoiceNumber}` : 'الفاتورة'}
        titleLatinDigits
      />

      {isLoading ? (
        <ActivityIndicator className="py-16" color="#0d9488" />
      ) : error || !invoice ? (
        <View className="items-center px-6 py-16">
          <Text
            className="text-muted-foreground text-center text-sm"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            {error?.response?.data?.message ?? 'تعذر العثور على الفاتورة'}
          </Text>
        </View>
      ) : (
        <>
          <View className="bg-card border-border mx-6 gap-4 rounded-2xl border p-4">
            <View className="flex-row items-start gap-3">
              <View className="bg-accent h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                <Icon as={Receipt} size={20} className="text-primary" />
              </View>

              <View className="flex-1 gap-0.5">
                <Text
                  className="text-muted-foreground text-xs"
                  style={{ fontFamily: 'app-font-semibold' }}
                >
                  رقم الفاتورة
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text
                    latinDigits
                    selectable
                    className="text-foreground shrink text-base"
                    style={{ fontFamily: 'app-font-bold' }}
                  >
                    {invoice.invoiceNumber}
                  </Text>
                  <CopyButton
                    value={invoice.invoiceNumber}
                    successMessage="تم نسخ رقم الفاتورة"
                    accessibilityLabel="نسخ رقم الفاتورة"
                  />
                </View>
              </View>

              <StatusChip {...INVOICE_STATUS[invoice.status]} />
            </View>

            <View className="flex-row items-center gap-1.5">
              <Icon as={Calendar} size={13} className="text-muted-foreground" />
              <Text
                className="text-muted-foreground text-xs"
                style={{ fontFamily: 'app-font-semibold' }}
              >
                {formatDate(invoice.createdAt)}
              </Text>
            </View>

            {doctor ? (
              <View className="border-border gap-2.5 border-t pt-3.5">
                <Text
                  className="text-muted-foreground text-xs"
                  style={{ fontFamily: 'app-font-semibold' }}
                >
                  الطبيب
                </Text>
                <View className="flex-row items-center gap-3">
                  <Avatar alt={doctor.fullName} className="h-10 w-10">
                    <AvatarFallback className="bg-accent">
                      <Text
                        className="text-primary text-xs"
                        style={{ fontFamily: 'app-font-bold' }}
                      >
                        {initials(doctor.fullName) ?? '؟'}
                      </Text>
                    </AvatarFallback>
                  </Avatar>
                  <View className="flex-1">
                    <Text
                      className="text-foreground text-sm leading-6"
                      style={{ fontFamily: 'app-font-bold' }}
                    >
                      {doctor.fullName}
                    </Text>
                    {doctor.specialty ? (
                      <Text
                        className="text-muted-foreground text-xs leading-5"
                        style={{ fontFamily: 'app-font-semibold' }}
                      >
                        {doctor.specialty}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ) : null}
          </View>

          {invoice.items && invoice.items.length > 0 ? (
            <View className="gap-3">
              <SectionHeader icon={ListChecks} title="بنود الفاتورة" count={invoice.items.length} />
              <View className="bg-card border-border mx-6 rounded-2xl border">
                {invoice.items.map((item, index) => (
                  <View
                    key={item.id}
                    className={cn(
                      'flex-row items-start justify-between gap-3 px-4 py-3',
                      index > 0 && 'border-border border-t'
                    )}
                  >
                    <Text
                      className="text-foreground flex-1 text-sm leading-6"
                      style={{ fontFamily: 'app-font-semibold' }}
                    >
                      {item.description}
                    </Text>
                    <Text
                      className="text-foreground shrink-0 text-sm leading-6"
                      style={{ fontFamily: 'app-font-bold' }}
                    >
                      {formatPrice(item.price)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <View className="bg-card border-border mx-6 gap-2.5 rounded-2xl border p-4">
            <AmountRow label="المجموع الفرعي" value={formatPrice(invoice.subtotal)} />
            {invoice.discountAmount ? (
              <AmountRow
                label={invoice.discountReason ? `خصم (${invoice.discountReason})` : 'خصم'}
                value={`- ${formatPrice(invoice.discountAmount)}`}
              />
            ) : null}
            <View className="border-border border-t pt-2.5">
              <AmountRow label="الإجمالي" value={formatPrice(invoice.total)} emphasize />
            </View>
            {invoice.remainingAmount > 0 ? (
              <AmountRow label="المتبقي" value={formatPrice(invoice.remainingAmount)} emphasize />
            ) : null}
          </View>

          {invoice.payments && invoice.payments.length > 0 ? (
            <View className="gap-3">
              <SectionHeader
                icon={CreditCard}
                title="سجل المدفوعات"
                count={invoice.payments.length}
              />
              <View className="bg-card border-border mx-6 rounded-2xl border">
                {invoice.payments.map((payment, index) => (
                  <View
                    key={payment.id}
                    className={cn(
                      'flex-row items-center justify-between gap-3 px-4 py-3',
                      index > 0 && 'border-border border-t'
                    )}
                  >
                    <View className="flex-1 gap-0.5">
                      <Text
                        className="text-foreground text-sm"
                        style={{ fontFamily: 'app-font-semibold' }}
                      >
                        {paymentMethodLabel(payment.method)}
                      </Text>
                      <Text
                        className="text-muted-foreground text-xs"
                        style={{ fontFamily: 'app-font-semibold' }}
                      >
                        {formatDate(payment.paidAt)}
                      </Text>
                    </View>
                    <Text
                      className="text-primary shrink-0 text-sm"
                      style={{ fontFamily: 'app-font-bold' }}
                    >
                      {formatPrice(payment.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {invoice.installments && invoice.installments.length > 0 ? (
            <View className="gap-3">
              <SectionHeader
                icon={CalendarClock}
                title="خطة الأقساط"
                count={invoice.installments.length}
              />
              <View className="bg-card border-border mx-6 rounded-2xl border">
                {invoice.installments.map((installment, index) => (
                  <View
                    key={installment.id}
                    className={cn(
                      'flex-row items-center justify-between gap-3 px-4 py-3',
                      index > 0 && 'border-border border-t'
                    )}
                  >
                    <View className="flex-1 gap-0.5">
                      <Text
                        className="text-foreground text-sm"
                        style={{ fontFamily: 'app-font-bold' }}
                      >
                        {formatPrice(installment.amount)}
                      </Text>
                      <Text
                        className="text-muted-foreground text-xs"
                        style={{ fontFamily: 'app-font-semibold' }}
                      >
                        {`يستحق ${formatDate(installment.dueDate)}`}
                      </Text>
                    </View>
                    <StatusChip {...INSTALLMENT_STATUS[installment.status]} />
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}
