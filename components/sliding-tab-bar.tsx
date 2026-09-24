import { type BottomTabBarProps } from 'expo-router/js-tabs';
import * as Haptics from 'expo-haptics';
import { Calendar, Home, MessageCircle, Pill, Receipt, type LucideIcon } from 'lucide-react-native';
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

import { Badge } from '@/components/ui/badge';
import { Text as UIText } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import { useChatConversation } from '@/hooks/chat/use-chat-conversation';

const TAB_ICONS: Record<string, LucideIcon> = {
  home: Home,
  appointments: Calendar,
  prescriptions: Pill,
  invoices: Receipt,
  chat: MessageCircle,
};

const TAB_LABELS: Record<string, string> = {
  home: 'الرئيسية',
  appointments: 'المواعيد',
  prescriptions: 'الروشتات',
  invoices: 'الفواتير',
  chat: 'المحادثة',
};

const MAX_DISPLAYED_UNREAD_COUNT = 9;

const SLIDER_GAP = 8; // horizontal breathing room around the highlight

export function SlidingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const activeColor = '#ffffff';
  const inactiveColor = colors.textSecondary;

  const routeCount = state.routes.length;

  const { data: chatConversation } = useChatConversation();
  const chatUnreadCount = chatConversation?.conversation.unreadCount ?? 0;

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

  if (state.routes[state.index]?.name === 'chat') {
    return null;
  }

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

          const unreadCount = route.name === 'chat' ? chatUnreadCount : 0;

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
              <View style={styles.iconWrapper}>
                {Icon && <Icon size={22} color={color} />}
                {unreadCount > 0 && (
                  <Badge variant="destructive" style={styles.badge} className="h-4 min-w-4 px-1">
                    <UIText className="text-[10px] leading-none text-white">
                      {unreadCount > MAX_DISPLAYED_UNREAD_COUNT
                        ? `${MAX_DISPLAYED_UNREAD_COUNT}+`
                        : unreadCount}
                    </UIText>
                  </Badge>
                )}
              </View>
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
  iconWrapper: {
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
  },
  label: {
    fontFamily: 'app-font-regular',
    fontSize: 11,
    letterSpacing: -0.2,
  },
});
