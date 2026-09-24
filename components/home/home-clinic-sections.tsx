import { View } from 'react-native';

import { EmptyHomeClinicTeaser } from '@/components/home/empty-home-clinic-teaser';
import { EmptyHomeContactCard } from '@/components/home/empty-home-contact-card';
import { EmptyHomeServicesCarousel } from '@/components/home/empty-home-services-carousel';
import type { Service } from '@/types/appointment.types';

/** Clinic-facing sections (services, contact, clinic info) shown on the home
 * screen for every patient, regardless of appointment history. */
export function HomeClinicSections({ services }: { services: Service[] }) {
  return (
    <View className="gap-4">
      <EmptyHomeServicesCarousel services={services} />
      <EmptyHomeContactCard />
      <EmptyHomeClinicTeaser />
    </View>
  );
}
