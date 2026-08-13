import { type BottomTabBarProps } from 'expo-router/js-tabs';
import * as Haptics from 'expo-haptics';
import { Compass, Home, type LucideIcon } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  I18nManager,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

const TAB_ICONS: Record<string, LucideIcon> = {
  index: Home,
  explore: Compass,
};

const TAB_LABELS: Record<string, string> = {
  index: 'الرئيسية',
  explore: 'استكشاف',
};

const SLIDER_GAP = 8; // horizontal breathing room around the highlight

export function SlidingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const activeColor = '#ffffff';
  const inactiveColor = colors.textSecondary;

  const routeCount = state.routes.length;

  // Measure the real width so the flexed tabs and the sliding highlight match.
  const [barWidth, setBarWidth] = useState(0);
  const tabWidth = barWidth / routeCount;

  const slideX = useRef(new Animated.Value(0)).current;

  // Flex + `left` mirror automatically in RTL, but `transform` never does — so
  // the highlight slides the opposite way to track the reversed tab order.
  const rtlSign = I18nManager.isRTL ? -1 : 1;

  useEffect(() => {
    if (!tabWidth) return;
    Animated.spring(slideX, {
      toValue: rtlSign * state.index * tabWidth,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [state.index, tabWidth, slideX, rtlSign]);

  const onLayout = (e: LayoutChangeEvent) => {
    setBarWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 12 }]}>
      <View
        style={[styles.container, { backgroundColor: colors.backgroundElement }]}
        onLayout={onLayout}
      >
        {tabWidth > 0 && (
          <Animated.View
            style={[
              styles.slider,
              {
                width: tabWidth - SLIDER_GAP,
                backgroundColor: colors.primary,
                transform: [{ translateX: slideX }],
              },
            ]}
          />
        )}

        {state.routes.map((route, index) => {
          const isFocused = index === state.index;
          const Icon = TAB_ICONS[route.name];
          const label = TAB_LABELS[route.name] ?? route.name;
          const color = isFocused ? activeColor : inactiveColor;

          const onPress = () => {
            if (process.env.EXPO_OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
              {Icon && <Icon size={22} color={color} />}
              <Text numberOfLines={1} style={[styles.label, { color }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  container: {
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 12,
  },
  slider: {
    position: 'absolute',
    left: SLIDER_GAP / 2,
    top: 6,
    height: 52,
    borderRadius: 26,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontFamily: 'app-font-regular',
    fontSize: 11,
    letterSpacing: -0.2,
  },
});
