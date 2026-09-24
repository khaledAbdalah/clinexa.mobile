import { router } from 'expo-router';
import { ChevronLeft, CircleAlert, WalletCards } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type BalanceDueCardProps = {
  amount: string;
};

export function BalanceDueCard({ amount }: BalanceDueCardProps) {
  return (
    <View className="bg-destructive/5 border-destructive/10 mx-6 flex-row items-center justify-between rounded-2xl border p-5">
      <View className="gap-2">
        <View className="flex-row items-center gap-1.5">
          <Icon as={CircleAlert} size={16} className="text-destructive" />
          <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-semibold' }}>
            متبقي عليك
          </Text>
        </View>
        <Text className="text-destructive text-3xl" style={{ fontFamily: 'app-font-bold' }}>
          {amount}
        </Text>
        <Pressable
          onPress={() => router.push(routes.tabsInvoices)}
          className="flex-row items-center gap-1"
          hitSlop={8}
        >
          <Icon as={ChevronLeft} size={14} className="text-muted-foreground" />
          <Text
            className="text-muted-foreground text-xs"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            عرض الفواتير
          </Text>
        </Pressable>
      </View>

      <View className="bg-destructive/10 h-14 w-14 items-center justify-center rounded-full">
        <Icon as={WalletCards} size={24} className="text-destructive" />
      </View>
    </View>
  );
}
