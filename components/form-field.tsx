import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';

import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

export function FieldLabel({
  label,
  required,
  optionalHint,
}: {
  label: string;
  required?: boolean;
  optionalHint?: string;
}) {
  return (
    <View className="flex-row items-center gap-1">
      <Text className="text-foreground text-base" style={{ fontFamily: 'app-font-semibold' }}>
        {label}
      </Text>
      {required ? <Text className="text-destructive text-base">*</Text> : null}
      {optionalHint ? (
        <Text className="text-muted-foreground text-sm" style={{ fontFamily: 'app-font-regular' }}>
          ({optionalHint})
        </Text>
      ) : null}
    </View>
  );
}

export function FieldRow({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
}) {
  return (
    <View
      className={cn(
        'border-input bg-background h-14 flex-row items-center rounded-xl border px-3',
        className
      )}
      style={style}
    >
      {children}
    </View>
  );
}
