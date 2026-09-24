import { useState } from 'react';
import {
  ScrollView,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { QueueCard } from '@/components/home/queue-card';
import { formatDate } from '@/lib/format-date';
import { cn } from '@/lib/utils';
import type { PatientHomeQueue } from '@/types/patient.types';

/**
 * Paged, swipeable list of the patient's upcoming bookings on the home screen. The API returns
 * them nearest first, so the first page is always the appointment that's coming up soonest.
 * A single booking renders as a plain `QueueCard` with no pager chrome.
 */
export function QueueCarousel({ queues }: { queues: PatientHomeQueue[] }) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const renderCard = (queue: PatientHomeQueue) => (
    <QueueCard
      queueNumber={String(queue.queueNumber)}
      isReserved
      doctorName={queue.doctorName}
      doctorSpecialty={queue.doctorSpecialty ?? '—'}
      date={formatDate(queue.scheduledDate)}
      patientsAhead={queue.patientsAhead}
    />
  );

  if (queues.length === 1) return renderCard(queues[0]);

  // Horizontal ScrollView content starts at the leading edge in RTL, so offset 0 is always the
  // first (nearest) page and `x / width` maps straight to the page index.
  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  return (
    <View className="gap-3">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
      >
        {queues.map((queue) => (
          <View key={queue.appointmentId} style={{ width }}>
            {renderCard(queue)}
          </View>
        ))}
      </ScrollView>

      <View className="flex-row items-center justify-center gap-1.5">
        {queues.map((queue, index) => (
          <View
            key={queue.appointmentId}
            className={cn(
              'h-1.5 rounded-full',
              index === activeIndex ? 'bg-primary w-6' : 'bg-border w-1.5'
            )}
          />
        ))}
      </View>
    </View>
  );
}
