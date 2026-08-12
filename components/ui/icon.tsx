import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { LucideIcon, LucideProps } from 'lucide-react-native';
import * as React from 'react';
import { useCssElement } from 'react-native-css';
import { StyleSheet } from 'react-native';

type IconProps = LucideProps & {
  as: LucideIcon;
} & React.RefAttributes<LucideIcon>;

type FlattenedIconStyle = { color?: string; width?: number; height?: number };

function RawIconImpl({ as: IconComponent, ...props }: IconProps) {
  // react-native-css resolves `className` to a `style` object — Lucide icons take
  // size/color as props, not a style prop, so pull them back out here.
  const { color, width, height } = (StyleSheet.flatten(props.style) ?? {}) as FlattenedIconStyle;
  const size = props.size ?? width ?? height;
  return <IconComponent color={color} {...props} size={size} />;
}

function IconImpl(props: IconProps) {
  return useCssElement(RawIconImpl, props, { className: 'style' });
}

/**
 * A wrapper component for Lucide icons with Nativewind `className` support via `cssInterop`.
 *
 * This component allows you to render any Lucide icon while applying utility classes
 * using `nativewind`. It avoids the need to wrap or configure each icon individually.
 *
 * @component
 * @example
 * ```tsx
 * import { ArrowRight } from 'lucide-react-native';
 * import { Icon } from '@/registry/components/ui/icon';
 *
 * <Icon as={ArrowRight} className="text-red-500" size={16} />
 * ```
 *
 * @param {LucideIcon} as - The Lucide icon component to render.
 * @param {string} className - Utility classes to style the icon using Nativewind.
 * @param {number} size - Icon size (defaults to 14).
 * @param {...LucideProps} ...props - Additional Lucide icon props passed to the "as" icon.
 */
function Icon({ as: IconComponent, className, size = 14, ...props }: IconProps) {
  const textClass = React.useContext(TextClassContext);
  return (
    <IconImpl
      as={IconComponent}
      className={cn('text-foreground', textClass, className)}
      size={size}
      {...props}
    />
  );
}

export { Icon };
