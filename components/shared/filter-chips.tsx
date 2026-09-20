import { type LucideIcon } from 'lucide-react-native';
import { Pressable, ScrollView } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type FilterChipOption<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
};

type FilterChipsProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: FilterChipOption<T>[];
};

export function FilterChips<T extends string>({ value, onChange, options }: FilterChipsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={cn(
              'flex-row items-center gap-1.5 rounded-full border px-4 py-2',
              isActive ? 'bg-primary border-primary' : 'bg-card border-border'
            )}
          >
            {option.icon ? (
              <Icon
                as={option.icon}
                size={14}
                className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
              />
            ) : null}
            <Text
              className={cn('text-sm', isActive ? 'text-primary-foreground' : 'text-foreground')}
              style={{ fontFamily: 'app-font-semibold' }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
