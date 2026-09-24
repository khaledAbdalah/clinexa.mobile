import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { cn, hexToRgba } from '@/lib/utils';

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
  const colors = useTheme();

  return (
    <View className="bg-muted mx-6 flex-row gap-1 rounded-full p-1">
      {options.map((option) => {
        const isActive = option.value === value;
        const isActiveOutline = isActive && variant === 'outline';
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={cn(
              'flex-1 items-center rounded-full py-2.5',
              isActive && (variant === 'solid' ? 'bg-primary' : 'bg-card')
            )}
            style={
              isActiveOutline
                ? {
                    borderWidth: 1,
                    borderColor: hexToRgba(colors.primary, 0.3),
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }
                : undefined
            }
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
