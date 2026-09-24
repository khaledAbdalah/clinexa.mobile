import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { routes } from '@/constants/routes';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type GreetingHeaderProps = {
  fullName: string;
  /** Single character shown in the avatar (first letter of the name). */
  initial: string;
  hasUnreadNotifications?: boolean;
};

export function GreetingHeader({ fullName, initial, hasUnreadNotifications }: GreetingHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 pt-2">
      <Pressable
        onPress={() => router.push(routes.profile)}
        hitSlop={4}
        className="flex-1 flex-row items-center gap-3"
      >
        <Avatar alt={fullName} className="border-primary/20 h-12 w-12 border-2">
          <AvatarFallback className="bg-primary">
            <Text
              className="text-primary-foreground text-base"
              style={{ fontFamily: 'app-font-bold' }}
            >
              {initial}
            </Text>
          </AvatarFallback>
        </Avatar>

        <Text
          className="text-foreground flex-1 text-lg"
          style={{ fontFamily: 'app-font-bold' }}
          numberOfLines={1}
        >
          أهلاً {fullName}
        </Text>
      </Pressable>

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
    </View>
  );
}
