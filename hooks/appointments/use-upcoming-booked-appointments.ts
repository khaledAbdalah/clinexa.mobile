import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useDetailQuery } from '@/hooks/queries/use-detail-query';
import type { Appointment } from '@/types/appointment.types';

interface RawAppointmentsResponse {
  data: {
    items: Appointment[];
    pagination: { nextCursor: string | null; hasMore: boolean };
  };
}

export function useUpcomingBookedAppointments(enabled: boolean) {
  return useDetailQuery<Appointment[]>({
    queryKey: ['patient', 'appointments', 'booked-conflicts'],
    queryFn: async () => {
      const { data } = await api.get<RawAppointmentsResponse>(endpoints.patient.appointments, {
        params: { limit: 100 },
      });
      return data.data.items.filter((appointment) => appointment.status === 'booked');
    },
    enabled,
  });
}
