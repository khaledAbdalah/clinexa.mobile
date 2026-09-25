import { View } from 'react-native';

import { EmptyHomeHeroCard } from '@/components/home/empty-home-hero-card';
import { EmptyHomePreviewTiles } from '@/components/home/empty-home-preview-tiles';

/**
 * Full "brand-new patient, no history yet" home state — replaces the old bare
 * single card. Composed of a welcoming hero (mirrors `QueueCard`'s gradient),
 * and a muted preview of the sections that activate once there's real history.
 * Clinic sections (contact, clinic info) live in `HomeClinicSections`; the services
 * carousel is rendered directly by the home screen, under the queue.
 */
export function EmptyAppointmentsCard() {
  return (
    <View className="gap-4">
      <EmptyHomeHeroCard />
      <EmptyHomePreviewTiles />
    </View>
  );
}
