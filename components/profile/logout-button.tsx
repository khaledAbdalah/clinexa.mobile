import { LogOut } from 'lucide-react-native';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type LogoutButtonProps = {
  onPress: () => void;
  isLoggingOut: boolean;
};

export function LogoutButton({ onPress, isLoggingOut }: LogoutButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoggingOut}
      className={cn(
        'border-border bg-card items-center rounded-full border py-4 active:opacity-70',
        isLoggingOut && 'opacity-50'
      )}
    >
      {isLoggingOut ? (
        <ActivityIndicator />
      ) : (
        <View className="flex-row items-center gap-2">
          <Icon as={LogOut} size={18} className="text-destructive" />
          <Text className="text-destructive text-sm" style={{ fontFamily: 'app-font-semibold' }}>
            تسجيل الخروج
          </Text>
        </View>
      )}
    </Pressable>
  );
}
