import { View } from 'react-native';

import { EmptyHomeClinicTeaser } from '@/components/home/empty-home-clinic-teaser';
import { EmptyHomeContactCard } from '@/components/home/empty-home-contact-card';
import { EmptyHomeServicesCarousel } from '@/components/home/empty-home-services-carousel';

/** Clinic-facing sections (services, contact, clinic info) shown on the home
 * screen for every patient, regardless of appointment history. */
export function HomeClinicSections() {
  return (
    <View className="gap-4">
      <EmptyHomeServicesCarousel />
      <EmptyHomeContactCard />
      <EmptyHomeClinicTeaser />
    </View>
  );
}
