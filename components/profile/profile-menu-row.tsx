import { ChevronLeft, type LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type ProfileMenuRowProps = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
};

export function ProfileMenuRow({ icon, label, onPress }: ProfileMenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="border-border bg-card flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
    >
      <View className="bg-accent h-10 w-10 items-center justify-center rounded-full">
        <Icon as={icon} size={18} className="text-primary" />
      </View>
      <Text className="text-foreground flex-1 text-sm" style={{ fontFamily: 'app-font-semibold' }}>
        {label}
      </Text>
      <Icon as={ChevronLeft} size={18} className="text-muted-foreground" />
    </Pressable>
  );
}
