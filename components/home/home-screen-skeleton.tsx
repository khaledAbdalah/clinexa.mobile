import { View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/** Every shimmering block on this screen uses the same neutral stone tone —
 * `Skeleton`'s own default (`bg-accent`) picks up the theme's teal tint,
 * which reads as a color hint before any data has loaded. */
function Bone({ className }: { className?: string }) {
  return <Skeleton className={cn('bg-stone-300 dark:bg-stone-700', className)} />;
}

function QueueCardSkeleton() {
  return (
    <View className="bg-stone-100 dark:bg-stone-900 mx-6 gap-5 rounded-3xl p-6">
      <View className="flex-row items-start justify-between">
        <View className="gap-2">
          <Bone className="h-3 w-16" />
          <Bone className="h-12 w-20" />
        </View>
        <Bone className="h-7 w-20 rounded-full" />
      </View>

      <View className="bg-stone-200 dark:bg-stone-800 gap-3.5 rounded-2xl p-4">
        <View className="flex-row items-center gap-3">
          <Bone className="h-10 w-10 rounded-full" />
          <View className="flex-1 gap-1.5">
            <Bone className="h-4 w-32" />
            <Bone className="h-3 w-20" />
          </View>
        </View>
        <View className="border-stone-300 dark:border-stone-700 flex-row items-center justify-between border-t pt-3.5">
          <Bone className="h-3 w-16" />
          <Bone className="h-3 w-24" />
        </View>
      </View>
    </View>
  );
}

function HomeCardSkeleton() {
  return (
    <View className="bg-card border-border mx-6 flex-row items-center justify-between rounded-2xl border p-5">
      <View className="flex-1 gap-2.5">
        <Bone className="h-3.5 w-28" />
        <Bone className="h-7 w-24" />
        <Bone className="h-3 w-20" />
      </View>
      <Bone className="h-14 w-14 rounded-full" />
    </View>
  );
}

function ServicesCarouselSkeleton() {
  return (
    <View className="gap-3">
      <Bone className="mx-6 h-4 w-20" />
      <View className="flex-row gap-3 px-6">
        {[0, 1, 2].map((i) => (
          <Bone key={i} className="h-32 w-40 rounded-2xl" />
        ))}
      </View>
    </View>
  );
}

function ClinicSectionsSkeleton() {
  return (
    <View className="gap-4">
      <ServicesCarouselSkeleton />
      <View className="bg-card border-border mx-6 flex-row items-center gap-4 rounded-2xl border p-5">
        <Bone className="h-12 w-12 rounded-full" />
        <View className="flex-1 gap-2">
          <Bone className="h-3.5 w-40" />
          <Bone className="h-3 w-24" />
        </View>
      </View>
      <View className="bg-card border-border mx-6 flex-row items-center gap-3 rounded-2xl border p-4">
        <Bone className="h-11 w-11 rounded-full" />
        <View className="flex-1 gap-1.5">
          <Bone className="h-3.5 w-32" />
          <Bone className="h-3 w-40" />
        </View>
      </View>
    </View>
  );
}

/** Full home screen loading state — one skeleton block per widget region, shaped
 * after the widgets that most commonly render there, shown together while the
 * combined `Promise.all` request (see `usePatientHomeScreen`) is in flight. */
export function HomeScreenSkeleton() {
  return (
    <View style={{ gap: 16 }}>
      <QueueCardSkeleton />
      <HomeCardSkeleton />
      <HomeCardSkeleton />
      <ClinicSectionsSkeleton />
    </View>
  );
}
