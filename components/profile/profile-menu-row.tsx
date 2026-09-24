import { ChevronLeft, type LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type ProfileMenuRowProps = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  /** Renders the row in the destructive color (e.g. delete account). */
  destructive?: boolean;
};

export function ProfileMenuRow({ icon, label, onPress, destructive = false }: ProfileMenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="border-border bg-card flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
    >
      {/* Inline style: color-opacity classNames crash with a fake "navigation context" error. */}
      <View
        className={cn(
          'h-10 w-10 items-center justify-center rounded-full',
          !destructive && 'bg-accent'
        )}
        style={destructive ? { backgroundColor: 'rgba(220, 38, 38, 0.12)' } : undefined}
      >
        <Icon as={icon} size={18} className={destructive ? 'text-destructive' : 'text-primary'} />
      </View>
      <Text
        className={cn('flex-1 text-sm', destructive ? 'text-destructive' : 'text-foreground')}
        style={{ fontFamily: 'app-font-semibold' }}
      >
        {label}
      </Text>
      <Icon as={ChevronLeft} size={18} className="text-muted-foreground" />
    </Pressable>
  );
}
