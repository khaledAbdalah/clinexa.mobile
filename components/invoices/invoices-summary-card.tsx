import { FileHeart, Sparkles } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type InvoicesSummaryCardProps = {
  totalDue: string;
  unpaidCount: number;
  /**
   * True when more invoice pages exist beyond what's currently loaded, so
   * `totalDue`/`unpaidCount` only reflect the loaded pages, not the patient's full
   * invoice history — the backend doesn't return an authoritative total. Shows a
   * caveat instead of presenting a partial figure as if it were exact.
   */
  isPartial?: boolean;
};

function unpaidCountLabel(count: number) {
  if (count === 0) return 'لا توجد فواتير غير مدفوعة';
  if (count === 1) return 'لديك فاتورة واحدة غير مدفوعة';
  if (count === 2) return 'لديك فاتورتان غير مدفوعتين';
  if (count <= 10) return `لديك ${count} فواتير غير مدفوعة`;
  return `لديك ${count} فاتورة غير مدفوعة`;
}

// Solid tints only — color/opacity classNames (`bg-primary/10`) trigger the NativeWind
// "navigation context" crash in this project.
export function InvoicesSummaryCard({
  totalDue,
  unpaidCount,
  isPartial = false,
}: InvoicesSummaryCardProps) {
  return (
    <View className="bg-accent border-teal-100 mx-6 flex-row items-center gap-4 rounded-2xl border p-5">
      <View className="flex-1 items-start gap-2">
        <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-semibold' }}>
          إجمالي المستحقات
        </Text>
        <Text className="text-destructive text-3xl" style={{ fontFamily: 'app-font-bold' }}>
          {totalDue}
        </Text>
        <Text className="text-muted-foreground text-xs" style={{ fontFamily: 'app-font-semibold' }}>
          {unpaidCountLabel(unpaidCount)}
        </Text>
        {isPartial ? (
          <Text
            className="text-muted-foreground text-[10px]"
            style={{ fontFamily: 'app-font-regular' }}
          >
            محسوبة من الفواتير المُحمّلة حاليًا فقط
          </Text>
        ) : null}
      </View>

      <View className="relative h-20 w-20 items-center justify-center">
        <View className="bg-teal-100 h-16 w-16 items-center justify-center rounded-2xl">
          <Icon as={FileHeart} size={30} className="text-primary" />
        </View>
        <Icon as={Sparkles} size={16} className="text-teal-300 absolute -top-1 -right-1" />
      </View>
    </View>
  );
}
