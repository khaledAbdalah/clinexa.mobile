import { Calendar, CreditCard } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type InstallmentCardProps = {
  nextInstallmentDate: string;
  installmentAmount: string;
  totalInstallments: number;
};

export function InstallmentCard({
  nextInstallmentDate,
  installmentAmount,
  totalInstallments,
}: InstallmentCardProps) {
  return (
    <View className="bg-accent border-primary/15 mx-6 flex-row items-center justify-between rounded-2xl border p-5">
      <View className="flex-row items-center gap-3">
        <View className="bg-primary/10 h-11 w-11 items-center justify-center rounded-full">
          <Icon as={Calendar} size={20} className="text-primary" />
        </View>
        <View className="gap-1">
          <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-semibold' }}>
            القسط القادم
          </Text>
          <Text
            className="text-muted-foreground text-xs"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            {nextInstallmentDate}
          </Text>
          <Text className="text-foreground text-xs" style={{ fontFamily: 'app-font-semibold' }}>
            مبلغ القسط {installmentAmount}
          </Text>
        </View>
      </View>

      <View className="items-center gap-2">
        <View className="bg-primary/10 flex-row items-center gap-1 rounded-full px-3 py-1">
          <Icon as={CreditCard} size={14} className="text-primary" />
          <Text className="text-primary text-xs" style={{ fontFamily: 'app-font-semibold' }}>
            {totalInstallments} أقساط
          </Text>
        </View>
      </View>
    </View>
  );
}
