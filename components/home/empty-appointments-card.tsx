import { View } from 'react-native';

import { EmptyHomeHeroCard } from '@/components/home/empty-home-hero-card';

/**
 * Full "brand-new patient, no history yet" home state — replaces the old bare
 * single card. A welcoming hero (mirrors `QueueCard`'s gradient).
 * Clinic sections (contact, clinic info) live in `HomeClinicSections`; the services
 * carousel is rendered directly by the home screen, under the queue.
 */
export function EmptyAppointmentsCard() {
  return (
    <View className="gap-4">
      <EmptyHomeHeroCard />
    </View>
  );
}
