import { ChevronDown } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type MonthHeaderRowProps = {
  month: string;
  expanded: boolean;
  onToggle: () => void;
};

/** Collapsible section header for a month's worth of past appointments — one `FlatList` row
 * built from `use-appointment-rows.ts`'s flattened rows, not a wrapper around its children (the
 * appointments below it are separate rows so the list can still virtualize them). */
export function MonthHeaderRow({ month, expanded, onToggle }: MonthHeaderRowProps) {
  return (
    <Pressable onPress={onToggle} className="flex-row items-center gap-2 px-6 pb-3" hitSlop={8}>
      <View className="bg-primary h-1.5 w-1.5 rounded-full" />
      <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-bold' }}>
        {month}
      </Text>
      <Icon
        as={ChevronDown}
        size={16}
        className={cn('text-muted-foreground', expanded && 'rotate-180')}
      />
    </Pressable>
  );
}
