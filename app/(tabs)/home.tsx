import { useEffect } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { BalanceDueCard } from '@/components/home/balance-due-card';
import { EmptyAppointmentsCard } from '@/components/home/empty-appointments-card';
import { GreetingHeader } from '@/components/home/greeting-header';
import { HomeClinicSections } from '@/components/home/home-clinic-sections';
import { HomeScreenSkeleton } from '@/components/home/home-screen-skeleton';
import { InstallmentCard } from '@/components/home/installment-card';
import { LastVisitCard } from '@/components/home/last-visit-card';
import { QueueCarousel } from '@/components/home/queue-carousel';
import { ReturningPatientCard } from '@/components/home/returning-patient-card';
import { useCurrency } from '@/hooks/use-currency';
import { formatDate } from '@/lib/format-date';
import { usePatientHomeScreen } from '@/hooks/patient/use-patient-home';
import { usePullToRefresh } from '@/hooks/queries/use-pull-to-refresh';
import { useAuthStore } from '@/store/auth';
import { useBootStore } from '@/store/boot';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, refetch } = usePatientHomeScreen();
  const { refreshing, onRefresh } = usePullToRefresh(refetch);

  // Releases the splash overlay (see `useHomeDataBootstrap`) once the first load settles.
  useEffect(() => {
    if (!isLoading) useBootStore.getState().markHomeReady();
  }, [isLoading]);

  const { formatPrice } = useCurrency();

  const home = data?.home;
  const unreadCount = data?.unreadCount ?? 0;
  const services = data?.services ?? [];

  // `queues` is nearest-first; fall back to the single `queue` for older API responses.
  const queues = home?.queues?.length ? home.queues : home?.queue ? [home.queue] : [];
  const balanceDue = home?.balanceDue ?? null;
  const nextInstallment = home?.nextInstallment ?? null;
  const lastVisit = home?.lastVisit ?? null;

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + BottomTabInset + 24,
        gap: 16,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0d9488" />
      }
    >
      <GreetingHeader
        fullName={user?.fullName ?? 'ضيف'}
        initial={user?.fullName.trim().charAt(0) || '؟'}
        hasUnreadNotifications={unreadCount > 0}
      />

      {isLoading ? (
        <HomeScreenSkeleton />
      ) : (
        <>
          {queues.length ? <QueueCarousel queues={queues} /> : null}

          {balanceDue !== null ? <BalanceDueCard amount={formatPrice(balanceDue)} /> : null}

          {nextInstallment ? (
            <InstallmentCard
              nextInstallmentDate={formatDate(nextInstallment.dueDate)}
              installmentAmount={formatPrice(nextInstallment.amount)}
              totalInstallments={nextInstallment.totalInstallments}
            />
          ) : null}

          {lastVisit ? (
            <LastVisitCard
              date={formatDate(lastVisit.date)}
              doctorName={lastVisit.doctorName}
              doctorSpecialty={lastVisit.doctorSpecialty ?? '—'}
              diagnosis={lastVisit.diagnosis ?? '—'}
            />
          ) : null}

          {!queues.length && lastVisit ? <ReturningPatientCard lastVisit={lastVisit} /> : null}

          {!queues.length && !lastVisit ? <EmptyAppointmentsCard /> : null}

          <HomeClinicSections services={services} />
        </>
      )}
    </ScrollView>
  );
}
