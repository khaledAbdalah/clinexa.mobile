import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useListQuery } from '@/hooks/queries/use-list-query';
import type { CursorPage } from '@/hooks/queries/types';
import type { Appointment } from '@/types/appointment.types';

interface RawAppointmentsResponse {
  data: {
    items: Appointment[];
    pagination: { nextCursor: string | null; hasMore: boolean };
  };
}

interface UseAppointmentsOptions {
  /** Filter to a single day, e.g. '2026-09-20'. */
  date?: string;
  limit?: number;
}

/**
 * Cursor-paginated via `useListQuery`, matching `useNotifications`'s pattern.
 * `GET /patient/appointments`'s envelope carries no `total` (same omission as
 * `GET /notifications`), so `total` is hardcoded to 0 here.
 */
export function useAppointments({ date, limit = 20 }: UseAppointmentsOptions = {}) {
  return useListQuery<Appointment>({
    queryKey: ['patient', 'appointments', { date, limit }],
    queryFn: async (cursor) => {
      const { data } = await api.get<RawAppointmentsResponse>(endpoints.patient.appointments, {
        params: { date, cursor, limit },
      });
      const page: CursorPage<Appointment> = {
        data: data.data.items,
        total: 0,
        nextCursor: data.data.pagination.nextCursor,
        hasMore: data.data.pagination.hasMore,
      };
      return page;
    },
  });
}
