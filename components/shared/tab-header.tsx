import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type TabHeaderProps = {
  title: string;
  subtitle?: string;
  /** Optional trailing action (e.g. an icon button) rendered at the row's other end. */
  action?: ReactNode;
};

export function TabHeader({ title, subtitle, action }: TabHeaderProps) {
  return (
    <View className="gap-1 px-6 pt-2">
      <View className="flex-row items-center gap-3" style={{ direction: 'ltr' }}>
        <Pressable onPress={() => router.back()} hitSlop={12} className="-ml-2 p-2">
          <Icon as={ChevronLeft} size={24} className="text-primary" />
        </Pressable>

        <Text
          className="text-foreground flex-1 text-right text-xl"
          style={{ fontFamily: 'app-font-bold' }}
        >
          {title}
        </Text>

        {action}
      </View>

      {subtitle ? (
        <Text
          className="text-muted-foreground text-base"
          style={{ fontFamily: 'app-font-regular' }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
