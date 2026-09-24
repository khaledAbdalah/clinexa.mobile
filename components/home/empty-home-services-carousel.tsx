import { router } from 'expo-router';
import { Stethoscope } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useCurrency } from '@/hooks/use-currency';
import type { Service } from '@/types/appointment.types';

/**
 * Horizontal carousel of the clinic's services for brand-new patients.
 * Tapping a card opens the booking screen with that service pre-selected.
 * `services` comes from the home screen's combined `Promise.all` fetch
 * (`usePatientHomeScreen`) rather than fetching its own — renders nothing
 * when the clinic has no services.
 */
export function EmptyHomeServicesCarousel({ services }: { services: Service[] }) {
  const { formatPrice } = useCurrency();

  if (!services?.length) return null;

  return (
    <View className="gap-3">
      <Text className="text-foreground px-6 text-base" style={{ fontFamily: 'app-font-bold' }}>
        خدماتنا
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
      >
        {services.map((service) => (
          <Pressable
            key={service.id}
            onPress={() =>
              router.push({ pathname: routes.bookAppointment, params: { serviceId: service.id } })
            }
            className="bg-card border-border w-40 gap-3 rounded-2xl border p-4"
          >
            <View className="bg-accent h-10 w-10 items-center justify-center rounded-full">
              <Icon as={Stethoscope} size={18} className="text-primary" />
            </View>
            <View className="gap-1">
              <Text
                className="text-foreground text-sm"
                style={{ fontFamily: 'app-font-bold' }}
                numberOfLines={2}
              >
                {service.name}
              </Text>
              <Text className="text-primary text-xs" style={{ fontFamily: 'app-font-semibold' }}>
                {formatPrice(service.price)}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
