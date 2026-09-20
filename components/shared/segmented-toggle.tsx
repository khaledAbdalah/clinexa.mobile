import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type SegmentedToggleOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedToggleProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedToggleOption<T>[];
  /** `outline` (default): a bordered white pill on the active tab. `solid`: a filled primary pill. */
  variant?: 'outline' | 'solid';
};

export function SegmentedToggle<T extends string>({
  value,
  onChange,
  options,
  variant = 'outline',
}: SegmentedToggleProps<T>) {
  return (
    <View className="bg-muted mx-6 flex-row gap-1 rounded-full p-1">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={cn(
              'flex-1 items-center rounded-full py-2.5',
              isActive &&
                (variant === 'solid'
                  ? 'bg-primary'
                  : 'bg-card border-primary/30 border shadow-sm shadow-black/5')
            )}
          >
            <Text
              className={cn(
                'text-sm',
                isActive
                  ? variant === 'solid'
                    ? 'text-primary-foreground'
                    : 'text-primary'
                  : 'text-muted-foreground'
              )}
              style={{ fontFamily: 'app-font-bold' }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
