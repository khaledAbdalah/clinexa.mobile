import { router } from 'expo-router';
import { ChevronLeft, WalletCards } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type BalanceDueCardProps = {
  amount: string;
};

export function BalanceDueCard({ amount }: BalanceDueCardProps) {
  return (
    <Pressable
      onPress={() => router.push(routes.tabsInvoices)}
      className="mx-6 flex-row items-center gap-4 rounded-2xl border border-red-100 bg-red-50 p-4 active:opacity-80"
    >
      <View className="h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100">
        <Icon as={WalletCards} size={22} className="text-destructive" />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-semibold' }}>
          متبقي عليك
        </Text>
        <Text
          className="text-destructive text-2xl leading-8"
          style={{ fontFamily: 'app-font-bold' }}
        >
          {amount}
        </Text>
        <Text className="text-xs text-red-700" style={{ fontFamily: 'app-font-semibold' }}>
          عرض الفواتير
        </Text>
      </View>

      <Icon as={ChevronLeft} size={18} className="text-muted-foreground shrink-0" />
    </Pressable>
  );
}
