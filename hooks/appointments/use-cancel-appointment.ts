import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import type { Appointment } from '@/types/appointment.types';

/**
 * `PATCH /patient/appointments/:id/cancel` — cancels one of the current
 * patient's own appointments. Same invalidation targets as `useBookAppointment`
 * (list + home dashboard), since cancelling can free up/clear the home queue card.
 */
export function useCancelAppointment() {
  return useApiMutation<Appointment, string>({
    mutationFn: async (appointmentId) => {
      const { data } = await api.patch<{ data: Appointment }>(
        endpoints.patient.cancelAppointment(appointmentId)
      );
      return data.data;
    },
    successMessage: 'تم إلغاء الموعد',
    invalidateQueryKeys: [
      ['patient', 'appointments'],
      ['patient', 'home'],
    ],
  });
}
