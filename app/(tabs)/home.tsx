import { ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { BalanceDueCard } from '@/components/home/balance-due-card';
import { EmptyAppointmentsCard } from '@/components/home/empty-appointments-card';
import { GreetingHeader } from '@/components/home/greeting-header';
import { HomeClinicSections } from '@/components/home/home-clinic-sections';
import { InstallmentCard } from '@/components/home/installment-card';
import { LastVisitCard } from '@/components/home/last-visit-card';
import { QueueCard } from '@/components/home/queue-card';
import { ReturningPatientCard } from '@/components/home/returning-patient-card';
import { useCurrency } from '@/hooks/use-currency';
import { formatDate } from '@/lib/format-date';
import { useUnreadCount } from '@/hooks/notifications/use-unread-count';
import { usePatientHome } from '@/hooks/patient/use-patient-home';
import { useAuthStore } from '@/store/auth';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: home, isLoading } = usePatientHome();
  const { formatPrice } = useCurrency();

  const queue = home?.queue ?? null;
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
    >
      <GreetingHeader
        fullName={user?.fullName ?? 'ضيف'}
        initial={user?.fullName.trim().charAt(0) || '؟'}
        hasUnreadNotifications={unreadCount > 0}
      />

      {isLoading ? (
        <ActivityIndicator className="py-16" color="#0d9488" />
      ) : queue ? (
        <QueueCard
          queueNumber={String(queue.queueNumber)}
          isReserved
          doctorName={queue.doctorName}
          doctorSpecialty={queue.doctorSpecialty ?? '—'}
          date={formatDate(queue.scheduledDate)}
          patientsAhead={queue.patientsAhead}
        />
      ) : null}

      {!isLoading && balanceDue !== null ? (
        <BalanceDueCard amount={formatPrice(balanceDue)} />
      ) : null}

      {!isLoading && nextInstallment ? (
        <InstallmentCard
          nextInstallmentDate={formatDate(nextInstallment.dueDate)}
          installmentAmount={formatPrice(nextInstallment.amount)}
          totalInstallments={nextInstallment.totalInstallments}
        />
      ) : null}

      {!isLoading && lastVisit ? (
        <LastVisitCard
          date={formatDate(lastVisit.date)}
          doctorName={lastVisit.doctorName}
          doctorSpecialty={lastVisit.doctorSpecialty ?? '—'}
          diagnosis={lastVisit.diagnosis ?? '—'}
        />
      ) : null}

      {!isLoading && !queue && lastVisit ? <ReturningPatientCard lastVisit={lastVisit} /> : null}

      {!isLoading && !queue && !lastVisit ? <EmptyAppointmentsCard /> : null}

      {!isLoading ? <HomeClinicSections /> : null}
    </ScrollView>
  );
}
