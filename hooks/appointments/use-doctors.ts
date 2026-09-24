import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useDetailQuery } from '@/hooks/queries/use-detail-query';
import type { Doctor } from '@/types/appointment.types';

/**
 * `GET /patient/doctors` — the tenant's doctor list with working hours, used to
 * build the doctor picker on the booking screen. Unlike every other
 * `patient/*` endpoint, this one requires no onboarding (`SelfController.doctors`
 * skips `getOwnPatient`) — just auth. The list is small and unpaginated, so
 * `useDetailQuery` (not `useListQuery`, which is for cursor-paginated lists) fits.
 */
export function useDoctors() {
  return useDetailQuery<Doctor[]>({
    queryKey: ['patient', 'doctors'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Doctor[] }>(endpoints.patient.doctors);
      return data.data;
    },
  });
}
