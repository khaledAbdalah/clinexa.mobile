import { ActivityIndicator, Pressable, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react-native';
import { ChevronLeft } from 'lucide-react-native';

import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

const pillButtonVariants = cva('h-14 flex-row items-center rounded-full px-6', {
  variants: {
    variant: {
      solid: 'bg-primary active:bg-primary/90',
      outline: 'border-primary active:bg-primary/5 border bg-transparent',
      ghost: 'active:bg-primary/5 bg-transparent',
    },
    size: {
      default: 'h-14 px-6',
      sm: 'h-12 px-5',
      lg: 'h-16 px-8',
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'default',
  },
});

const pillButtonTextVariants = cva('flex-1 text-center text-base', {
  variants: {
    variant: {
      solid: 'text-primary-foreground',
      outline: 'text-primary',
      ghost: 'text-primary',
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
});

type PillButtonProps = Omit<React.ComponentProps<typeof Pressable>, 'children'> &
  VariantProps<typeof pillButtonVariants> & {
    /** Button label. For custom content instead, use `children`. */
    label?: string;
    /**
     * Trailing icon. Defaults to a chevron. Pass `null` to render a plain
     * centered label with no icon/balance spacer at all.
     */
    icon?: LucideIcon | null;
    iconSize?: number;
    /** Show a spinner instead of the label/icon and disable the button. */
    isLoading?: boolean;
    spinnerColor?: string;
    className?: string;
    labelClassName?: string;
    iconClassName?: string;
    /** Escape hatch for fully custom content — bypasses `label`/`icon`. */
    children?: React.ReactNode;
  };

function PillButton({
  label,
  icon = ChevronLeft,
  iconSize = 18,
  isLoading,
  spinnerColor,
  variant,
  size,
  disabled,
  className,
  labelClassName,
  iconClassName,
  children,
  ...props
}: PillButtonProps) {
  const resolvedSpinnerColor =
    spinnerColor ?? (variant === 'outline' || variant === 'ghost' ? undefined : '#ffffff');

  return (
    <Pressable
      disabled={disabled || isLoading}
      role="button"
      className={cn(
        pillButtonVariants({ variant, size }),
        (disabled || isLoading) && 'opacity-50',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator className="mx-auto" color={resolvedSpinnerColor} />
      ) : children ? (
        children
      ) : (
        <>
          {icon ? <View style={{ width: iconSize }} /> : null}
          <Text
            className={cn(pillButtonTextVariants({ variant }), labelClassName)}
            style={{ fontFamily: 'app-font-semibold' }}
          >
            {label}
          </Text>
          {icon ? (
            <Icon
              as={icon}
              size={iconSize}
              className={cn(
                variant === 'solid' ? 'text-primary-foreground' : 'text-primary',
                iconClassName
              )}
            />
          ) : null}
        </>
      )}
    </Pressable>
  );
}

export { PillButton, pillButtonVariants, pillButtonTextVariants };
export type { PillButtonProps };
