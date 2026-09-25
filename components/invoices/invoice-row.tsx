import { router } from 'expo-router';
import { Calendar, ChevronLeft, Receipt } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { INVOICE_STATUS } from '@/components/invoices/invoice-status';
import type { InvoiceStatus } from '@/types/invoice.types';
import { cn } from '@/lib/utils';

export type Invoice = {
  id: string;
  invoiceNumber: string;
  amount: string;
  /** Only set for a partially paid invoice — what's still owed on it. */
  remaining: string | null;
  status: InvoiceStatus;
  date: string;
  /** `encounter.doctor.fullName`, when the invoice's encounter carries one. */
  doctorName: string | null;
};

/**
 * Two lines, each a `flex-1` start column plus a `shrink-0` end column: invoice number
 * ↔ amount, doctor ↔ status. The start side wraps, so a long doctor name or a
 * large amount pushes text down instead of pushing the amount out of the card.
 */
export function InvoiceRow({
  id,
  invoiceNumber,
  amount,
  remaining,
  status,
  date,
  doctorName,
}: Invoice) {
  const config = INVOICE_STATUS[status];

  return (
    <Pressable
      onPress={() => router.push(routes.invoiceDetail(id) as never)}
      className="bg-card border-border flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-80"
    >
      <View className="flex-1 flex-row items-start gap-3">
        <View className="bg-accent h-11 w-11 shrink-0 items-center justify-center rounded-xl">
          <Icon as={Receipt} size={20} className="text-primary" />
        </View>

        <View className="flex-1 gap-1.5">
          <View className="flex-row items-start justify-between gap-3">
            <Text
              latinDigits
              className="text-foreground flex-1 text-base leading-6"
              style={{ fontFamily: 'app-font-bold' }}
            >
              #{invoiceNumber}
            </Text>
            <Text
              className="text-foreground shrink-0 text-base leading-6"
              style={{ fontFamily: 'app-font-bold' }}
            >
              {amount}
            </Text>
          </View>

          <View className="flex-row items-center justify-between gap-3">
            <Text
              className="text-muted-foreground flex-1 text-xs leading-5"
              style={{ fontFamily: 'app-font-semibold' }}
            >
              {doctorName ?? 'فاتورة العيادة'}
            </Text>
            <View className={cn('shrink-0 rounded-full px-2.5 py-0.5', config.chip)}>
              <Text className={cn('text-xs', config.text)} style={{ fontFamily: 'app-font-bold' }}>
                {config.label}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <View className="flex-row items-center gap-1.5">
              <Icon as={Calendar} size={12} className="text-muted-foreground" />
              <Text
                className="text-muted-foreground text-xs"
                style={{ fontFamily: 'app-font-semibold' }}
              >
                {date}
              </Text>
            </View>
            {remaining ? (
              <Text className="text-amber-700 text-xs" style={{ fontFamily: 'app-font-bold' }}>
                المتبقي {remaining}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <Icon as={ChevronLeft} size={18} className="text-muted-foreground shrink-0" />
    </Pressable>
  );
}
