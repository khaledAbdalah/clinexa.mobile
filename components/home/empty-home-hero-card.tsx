import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CalendarHeart, HeartPulse, Sparkles, Stethoscope } from 'lucide-react-native';
import { View } from 'react-native';

import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';

/**
 * Warm welcome hero for a brand-new patient who hasn't booked their first
 * appointment yet. Same gradient language as `QueueCard` so the "no history"
 * home state still feels like part of the same design system rather than a
 * bare fallback. The illustration is an icon composition (layered badges +
 * soft decorative circles) rather than an image asset — no existing asset
 * fit the "booking" theme, see the report for why an image wasn't added.
 */
export function EmptyHomeHeroCard() {
  return (
    <View className="mx-6 overflow-hidden rounded-3xl">
      <LinearGradient
        colors={['#2dd4bf', '#0d9488', '#0f766e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24, gap: 20 }}
      >
        <View className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
        <View className="pointer-events-none absolute -right-6 -bottom-10 h-28 w-28 rounded-full bg-white/10" />

        <View className="items-center gap-1">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-white/15">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-white/90">
              <Icon as={CalendarHeart} size={30} className="text-primary" />
            </View>
          </View>

          <View className="absolute -top-1 right-6 h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Icon as={Stethoscope} size={16} className="text-white" />
          </View>
          <View className="absolute -bottom-1 left-6 h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Icon as={Sparkles} size={16} className="text-white" />
          </View>
        </View>

        <Icon
          as={HeartPulse}
          size={72}
          className="pointer-events-none absolute -bottom-4 left-2 text-white/10"
        />

        <View className="items-center gap-2 px-2">
          <Text className="text-center text-xl text-white" style={{ fontFamily: 'app-font-bold' }}>
            لسه معملتش أول حجز ليك
          </Text>
          <Text
            className="text-center text-sm leading-6 text-white/85"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            احجز موعدك الأول وهنبدأ نتابع رحلتك الصحية من هنا
          </Text>
        </View>

        <PillButton
          label="احجز موعدك الأول"
          onPress={() => router.push(routes.bookAppointment)}
          className="bg-white active:bg-white/90"
          labelClassName="text-primary"
          iconClassName="text-primary"
        />
      </LinearGradient>
    </View>
  );
}
