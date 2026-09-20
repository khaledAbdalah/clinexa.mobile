import { type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type SectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  count: number;
};

export function SectionHeader({ icon, title, count }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center gap-2 px-6">
      <Icon as={icon} size={18} className="text-primary" />
      <Text className="text-foreground text-base" style={{ fontFamily: 'app-font-bold' }}>
        {title}
      </Text>
      <View className="bg-muted h-6 w-6 items-center justify-center rounded-full">
        <Text className="text-foreground text-xs" style={{ fontFamily: 'app-font-bold' }}>
          {count}
        </Text>
      </View>
    </View>
  );
}
