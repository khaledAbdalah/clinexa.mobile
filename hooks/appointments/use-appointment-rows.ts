import { useEffect, useMemo, useState } from 'react';

import type {
  Appointment as AppointmentCardProps,
  AppointmentStatus as AppointmentCardStatus,
} from '@/components/appointments/appointment-card';
import { formatDate, formatDayName, formatMonth } from '@/lib/format-date';
import { initials } from '@/lib/initials';
import type { Appointment, AppointmentStatus } from '@/types/appointment.types';

export type AppointmentsTab = 'upcoming' | 'past';

export type AppointmentRow =
  | { type: 'appointment'; key: string; card: AppointmentCardProps }
  | { type: 'monthHeader'; key: string; month: string; expanded: boolean; onToggle: () => void };

// The backend has no equivalent for "arrived" / "in consultation" / "no show" — only
// booked/completed/cancelled — so this maps 1:1 onto the card's presentation-only status.
const STATUS_MAP: Record<AppointmentStatus, AppointmentCardStatus> = {
  booked: 'reserved',
  completed: 'completed',
  cancelled: 'cancelled',
};

// `GET /patient/appointments`'s `doctor` field is `{ id, fullName }` only — no specialty is
// returned today. Showing a dash rather than fabricating a value, same fallback the home
// screen uses for the same gap.
function toCardAppointment(appointment: Appointment): AppointmentCardProps {
  const doctorName = appointment.doctor?.fullName ?? 'طبيب';

  return {
    id: appointment.id,
    status: STATUS_MAP[appointment.status],
    doctorName,
    doctorInitials: initials(appointment.doctor?.fullName ?? null) ?? '؟',
    doctorSpecialty: '—',
    dayName: formatDayName(appointment.scheduledDate),
    date: formatDate(appointment.scheduledDate),
    queueNumber: appointment.queueNumber !== null ? String(appointment.queueNumber) : '—',
    serviceName: appointment.serviceName,
  };
}

type MonthGroup = { key: string; month: string; appointments: Appointment[] };

/**
 * Splits the flat, cursor-paginated appointment list (`useAppointments`) into the two tabs the
 * screen renders, and flattens the "past" tab's month groups into the single row list a
 * `FlatList` needs for virtualization — a nested `MonthGroup` component per group would render
 * every month's appointments regardless of scroll position.
 *
 * The backend still has no status/date-range filter for this list (just a single exact-day
 * filter, unused here), so upcoming/past can't be requested separately from the server —
 * splitting client-side by status + date, over whatever pages have been loaded so far, is the
 * only option.
 */
export function useAppointmentRows(appointments: Appointment[], tab: AppointmentsTab) {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  const { upcoming, pastMonthGroups, pastCount } = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const upcomingList: Appointment[] = [];
    const pastList: Appointment[] = [];

    for (const appointment of appointments) {
      const scheduled = new Date(appointment.scheduledDate);
      const isFuture = scheduled >= todayStart;

      if (appointment.status === 'booked' && isFuture) {
        upcomingList.push(appointment);
      } else {
        pastList.push(appointment);
      }
    }

    upcomingList.sort(
      (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    );
    pastList.sort(
      (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    );

    const groups: MonthGroup[] = [];
    for (const appointment of pastList) {
      const scheduled = new Date(appointment.scheduledDate);
      const key = `${scheduled.getFullYear()}-${scheduled.getMonth()}`;
      const lastGroup = groups[groups.length - 1];
      if (lastGroup?.key === key) {
        lastGroup.appointments.push(appointment);
      } else {
        groups.push({
          key,
          month: formatMonth(appointment.scheduledDate),
          appointments: [appointment],
        });
      }
    }

    return { upcoming: upcomingList, pastMonthGroups: groups, pastCount: pastList.length };
  }, [appointments]);

  // Mirrors the old `MonthGroup`'s `defaultExpanded` (first group only) — expand the
  // first month once groups are known, without re-collapsing a month the user toggled.
  useEffect(() => {
    const firstKey = pastMonthGroups[0]?.key;
    if (firstKey) {
      setExpandedMonths((current) => (current.size === 0 ? new Set([firstKey]) : current));
    }
  }, [pastMonthGroups]);

  const toggleMonth = (key: string) => {
    setExpandedMonths((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const rows: AppointmentRow[] = useMemo(
    () =>
      tab === 'upcoming'
        ? upcoming.map((appointment): AppointmentRow => ({
            type: 'appointment',
            key: appointment.id,
            card: toCardAppointment(appointment),
          }))
        : pastMonthGroups.flatMap((group) => {
            const expanded = expandedMonths.has(group.key);
            const header: AppointmentRow = {
              type: 'monthHeader',
              key: `header-${group.key}`,
              month: group.month,
              expanded,
              onToggle: () => toggleMonth(group.key),
            };
            if (!expanded) return [header];
            return [
              header,
              ...group.appointments.map((appointment): AppointmentRow => ({
                type: 'appointment',
                key: appointment.id,
                card: toCardAppointment(appointment),
              })),
            ];
          }),
    [tab, upcoming, pastMonthGroups, expandedMonths]
  );

  return { rows, upcomingCount: upcoming.length, pastCount };
}
