import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import type { Appointment, CreateAppointmentRequest } from '@/types/appointment.types';

/**
 * `POST /patient/appointments` — books a new appointment for the current patient.
 * Invalidates both the appointments list (`useAppointments`) and the home
 * dashboard (`usePatientHome`, whose `queue` card should reflect a freshly
 * booked appointment) so both screens refetch instead of showing stale data.
 *
 * Errors are left to the default `useApiMutation` toast path (`getErrorMessage`)
 * — the backend already sends ready-to-show Arabic `message`s for the 400
 * (doctor doesn't work that day) and 402 (subscription limit) cases, and 422s
 * are field-level (handled via `setFieldErrors` by the caller, if wired).
 */
export function useBookAppointment() {
  return useApiMutation<Appointment, CreateAppointmentRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post<{ data: Appointment }>(endpoints.patient.appointments, body);
      return data.data;
    },
    successMessage: 'تم حجز موعدك بنجاح',
    invalidateQueryKeys: [
      ['patient', 'appointments'],
      ['patient', 'home'],
    ],
  });
}
