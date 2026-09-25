import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type TabHeaderProps = {
  title: string;
  /** Keep Western digits in the title — for identifiers like an invoice number. */
  titleLatinDigits?: boolean;
  subtitle?: string;
  /** Optional trailing action (e.g. an icon button) rendered at the row's other end. */
  action?: ReactNode;
  /**
   * Whether to render the leading back-arrow. Defaults to `true` for stack-pushed
   * screens. Pass `false` on tab-root screens where there's nowhere to go "back" to.
   */
  showBackButton?: boolean;
  /**
   * Overrides the back-arrow's default `router.back()`. Needed on screens that are
   * tab roots rather than stack-pushed (e.g. the chat tab) - `router.back()` there
   * depends on tab-navigation history existing, which isn't guaranteed the same way
   * a stack push's "previous screen" is.
   */
  onBackPress?: () => void;
  /**
   * Adds a bottom border, separating the header from content that scrolls directly
   * beneath it (e.g. the chat tab's message list). Off by default since most screens
   * using this header sit above non-scrolling or padded content where the extra
   * separator would just be visual noise.
   *
   * Deliberately border-only, no shadow: Android's `elevation` draws its Material
   * shadow around all four edges of the view, not just the bottom one, so it read as
   * a floating boxed card instead of a clean under-line - not what a bottom separator
   * should look like.
   */
  bordered?: boolean;
};

export function TabHeader({
  title,
  titleLatinDigits = false,
  subtitle,
  action,
  showBackButton = true,
  onBackPress,
  bordered = false,
}: TabHeaderProps) {
  return (
    <View className={cn('gap-1 px-6 pt-2', bordered && 'border-border border-b pb-3')}>
      <View className="flex-row items-center gap-3" style={{ direction: 'ltr' }}>
        {showBackButton ? (
          <Pressable
            onPress={onBackPress ?? (() => router.back())}
            hitSlop={12}
            className="-ml-2 p-2"
          >
            <Icon as={ChevronLeft} size={24} className="text-primary" />
          </Pressable>
        ) : null}

        <Text
          latinDigits={titleLatinDigits}
          className="text-foreground flex-1 text-right text-xl"
          style={{ fontFamily: 'app-font-bold' }}
        >
          {title}
        </Text>

        {action}
      </View>

      {subtitle ? (
        <Text
          className="text-muted-foreground text-base"
          style={{ fontFamily: 'app-font-regular' }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
