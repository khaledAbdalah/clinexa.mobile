import { View } from 'react-native';

import { EmptyHomeClinicTeaser } from '@/components/home/empty-home-clinic-teaser';
import { EmptyHomeContactCard } from '@/components/home/empty-home-contact-card';

export function HomeClinicSections() {
  return (
    <View className="gap-4">
      <EmptyHomeContactCard />
      <EmptyHomeClinicTeaser />
    </View>
  );
}
