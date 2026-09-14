import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, View, useWindowDimensions } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardEvents } from 'react-native-keyboard-controller';
import Animated, {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { X } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

const OPEN_DURATION = 220;
const CLOSE_DURATION = 240;
const OPEN_EASING = Easing.out(Easing.cubic);
const CLOSE_EASING = Easing.in(Easing.cubic);

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  /** Header title. Omit for a header with just the grabber + close button. */
  title?: string;
  /** Set false to hide the title row + close button entirely, leaving just the grabber. Default true. */
  showHeader?: boolean;
  children: ReactNode;
  /** Fixed action area pinned below the body (e.g. Apply/Cancel buttons). */
  footer?: ReactNode;
  /** Wrap the body in a ScrollView (default true). Set false for short forms. */
  scrollable?: boolean;
  /** Cap the sheet height; defaults to `max-h-[88%]`. Ignored when `fullHeight` is set. */
  maxHeightClassName?: string;
  /** Stretch the sheet to the full screen height instead of sizing to content. Default false. */
  fullHeight?: boolean;
  /** Shift the sheet up so the footer stays above the keyboard. Default false — only needed when the footer holds a text input. */
  avoidKeyboard?: boolean;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  showHeader = true,
  children,
  footer,
  scrollable = true,
  maxHeightClassName = 'max-h-[88%]',
  fullHeight = false,
  avoidKeyboard = false,
}: BottomSheetProps) {
  const themeColors = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  // Keep the Modal mounted while the exit animation plays.
  const [mounted, setMounted] = useState(visible);

  // Start fully off-screen; the real distance is set once the sheet is measured.
  const translateY = useSharedValue(screenHeight);
  const sheetHeight = useSharedValue(screenHeight);
  const hasAnimatedIn = useRef(false);

  // Mirrors `visible` even when it's flipped externally (e.g. a parent closing
  // this sheet as a side effect of a selection) rather than via closeSheet().
  useEffect(() => {
    if (visible) {
      hasAnimatedIn.current = false;
      setMounted(true);
    } else if (mounted) {
      translateY.value = withTiming(
        sheetHeight.value,
        { duration: CLOSE_DURATION, easing: CLOSE_EASING },
        (finished) => {
          if (finished) scheduleOnRN(setMounted, false);
        }
      );
    }
  }, [visible, mounted, translateY, sheetHeight]);

  // Play the entrance only after layout, so it travels exactly the sheet's
  // height (no extra distance from the bottom of the screen → no rush/delay).
  const handleSheetLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const height = e.nativeEvent.layout.height;
      sheetHeight.value = height;
      if (visible && !hasAnimatedIn.current) {
        hasAnimatedIn.current = true;
        translateY.value = height;
        translateY.value = withTiming(0, { duration: OPEN_DURATION, easing: OPEN_EASING });
      }
    },
    [visible, translateY, sheetHeight]
  );

  const handleDismiss = useCallback(() => {
    setMounted(false);
    onClose();
  }, [onClose]);

  const closeSheet = useCallback(() => {
    translateY.value = withTiming(
      sheetHeight.value,
      { duration: CLOSE_DURATION, easing: CLOSE_EASING },
      (finished) => {
        if (finished) scheduleOnRN(handleDismiss);
      }
    );
  }, [translateY, sheetHeight, handleDismiss]);

  // Tracks the inner ScrollView offset so the drag-to-close only engages while
  // the content is scrolled to the very top — otherwise the ScrollView scrolls.
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
  });

  // Native gesture attached to the ScrollView so the pan can run simultaneously
  // with (rather than block) native scrolling.
  const nativeGesture = Gesture.Native();

  const panGesture = Gesture.Pan()
    .activeOffsetY(10)
    .simultaneousWithExternalGesture(nativeGesture)
    .onUpdate((event) => {
      // Only drag the sheet down when the list is at the top and the user is
      // pulling downward; otherwise leave it to the ScrollView.
      if (event.translationY > 0 && scrollOffset.value <= 0) {
        translateY.value = event.translationY;
      } else {
        translateY.value = 0;
      }
    })
    .onEnd((event) => {
      const shouldClose =
        translateY.value > sheetHeight.value * 0.25 ||
        (translateY.value > 0 && event.velocityY > 800);
      if (shouldClose) {
        translateY.value = withTiming(
          sheetHeight.value,
          { duration: CLOSE_DURATION, easing: CLOSE_EASING },
          (finished) => {
            if (finished) scheduleOnRN(handleDismiss);
          }
        );
      } else {
        translateY.value = withTiming(0, { duration: 200, easing: OPEN_EASING });
      }
    });

  // Lift the sheet (and its footer input) above the keyboard.
  //
  // Kept in React state and applied as *layout* (`marginBottom`/`height`) rather than as a
  // transform - whether our own or `KeyboardStickyView`'s: a transform moves the sheet on the UI
  // thread only, so the touch targets stay behind the keyboard (on Android the first tap on the
  // close button just dismisses the keyboard instead of hitting the button), and the layout that
  // does follow ends up fighting the transform as the keyboard settles, which reads as a jitter.
  //
  // The events come from `react-native-keyboard-controller` rather than RN's `Keyboard`: RN only
  // has `keyboardDidShow` on Android, which fires after the keyboard has fully appeared, so the
  // lift visibly lagged behind it. `keyboardWillShow` here fires up front on both platforms.
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!avoidKeyboard) return;
    const showSub = KeyboardEvents.addListener('keyboardWillShow', (e) => {
      setKeyboardHeight(e.height);
    });
    const hideSub = KeyboardEvents.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [avoidKeyboard]);

  // A full-height sheet keeps its top edge anchored and shrinks instead of moving, otherwise its
  // top content would be pushed off-screen. A regular one just moves up - minus `insets.bottom`,
  // which the footer already reserves and which the reported keyboard height (measured from the
  // bottom of the screen) would otherwise duplicate as a gap above the keyboard.
  const keyboardLift = fullHeight ? keyboardHeight : Math.max(keyboardHeight - insets.bottom, 0);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.min(1, translateY.value / sheetHeight.value),
  }));

  const bodyPaddingBottom = footer ? 8 : insets.bottom + 8;

  const header = (
    <View>
      <View className="items-center pt-3 pb-1">
        <View className="w-10 h-1.5 rounded-full bg-border" />
      </View>

      {showHeader ? (
        <View className={cn('items-center justify-between px-5 pt-2 pb-4', 'flex-row')}>
          <Text variant="h4">{title}</Text>
          <Pressable
            onPress={closeSheet}
            hitSlop={8}
            className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center active:opacity-70"
          >
            <X size={20} color={themeColors.primary} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  const body = scrollable ? (
    <GestureDetector gesture={nativeGesture}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className={cn(fullHeight ? 'flex-1' : 'flex-shrink')}
        contentContainerStyle={{ paddingBottom: bodyPaddingBottom }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </Animated.ScrollView>
    </GestureDetector>
  ) : (
    <View style={{ paddingBottom: bodyPaddingBottom }}>{children}</View>
  );

  const sheet = (
    <Animated.View
      style={[
        sheetStyle,
        avoidKeyboard ? { marginBottom: keyboardLift } : null,
        fullHeight ? { height: screenHeight - insets.top - keyboardHeight } : null,
      ]}
      onLayout={handleSheetLayout}
      className={cn(
        'bg-background rounded-t-3xl overflow-hidden',
        fullHeight ? undefined : maxHeightClassName
      )}
    >
      {/* The pan gesture wraps the whole sheet so it can be dragged from anywhere.
          For scrollable sheets it runs simultaneously with the inner ScrollView's
          native gesture and only engages the drag-to-close while scrolled to top. */}
      {/* `flex-shrink` only when the body is a ScrollView: a shrunk box's children don't shrink
          with it in Yoga, they overflow it - so on a non-scrollable sheet the shrink would leave
          the last field spilling out under the footer (which is laid out against the shrunk box,
          not the real content). Non-scrollable sheets are short by contract, so they keep their
          natural height and the sheet's `max-h` clips instead. */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          className={cn(fullHeight ? 'flex-1' : scrollable ? 'flex-shrink' : undefined)}
        >
          {header}
          {body}
        </Animated.View>
      </GestureDetector>

      {/* Footer - never shrinks, so it can't be squeezed into the body above it. */}
      {footer ? (
        <View
          className={cn('flex-shrink-0 px-4 pt-3 border-t border-border')}
          style={{ paddingBottom: insets.bottom + 12 }}
        >
          {footer}
        </View>
      ) : null}
    </Animated.View>
  );

  return (
    <Modal
      visible={mounted}
      animationType="none"
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={closeSheet}
    >
      <GestureHandlerRootView style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Animated.View style={backdropStyle} className="absolute inset-0 bg-black/50">
          <Pressable className="flex-1" onPress={closeSheet} />
        </Animated.View>

        {sheet}
      </GestureHandlerRootView>
    </Modal>
  );
}
