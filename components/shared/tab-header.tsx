import { router } from 'expo-router';
import { ArrowRight, Bell } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type TabHeaderProps = {
  title: string;
  subtitle?: string;
  hasUnreadNotifications?: boolean;
};

export function TabHeader({ title, subtitle, hasUnreadNotifications }: TabHeaderProps) {
  return (
    <View className="flex-row items-start justify-between px-6 pt-2">
      <Pressable
        onPress={() => router.push(routes.notifications)}
        className="relative h-10 w-10 items-center justify-center"
        hitSlop={8}
      >
        <Icon as={Bell} size={24} className="text-foreground" />
        {hasUnreadNotifications ? (
          <View className="bg-destructive border-background absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full border-2" />
        ) : null}
      </Pressable>

      <View className="items-end gap-1">
        <View className="flex-row items-center gap-2">
          <Icon as={ArrowRight} size={22} className="text-primary" />
          <Text className="text-foreground text-2xl" style={{ fontFamily: 'app-font-bold' }}>
            {title}
          </Text>
        </View>
        {subtitle ? (
          <Text
            className="text-muted-foreground text-sm"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
