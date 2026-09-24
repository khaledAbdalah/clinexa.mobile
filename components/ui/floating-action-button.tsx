import type { LucideIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { Icon } from '@/components/ui/icon';

type FloatingActionButtonProps = {
  icon: LucideIcon;
  onPress: () => void;
  /** Distance from the screen's bottom edge — typically the safe-area inset plus the tab
   * bar's height plus a small gap, since this floats above the custom sliding tab bar
   * rather than the raw screen edge. */
  bottom: number;
};

/** Circular floating action button, pinned to the bottom-left corner above the tab bar —
 * e.g. "book a new appointment" on `app/(tabs)/appointments.tsx`. Always bottom-left
 * regardless of RTL, matching the equivalent FAB in the `lms` sibling project. */
export function FloatingActionButton({ icon, onPress, bottom }: FloatingActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={{ bottom }}
      className="bg-primary active:bg-primary/90 absolute left-6 h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/20"
    >
      <Icon as={icon} size={26} className="text-primary-foreground" />
    </Pressable>
  );
}
