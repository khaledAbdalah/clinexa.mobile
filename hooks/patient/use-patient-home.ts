import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useDetailQuery } from '@/hooks/queries/use-detail-query';
import type { PatientHome } from '@/types/patient.types';

/** 404s if the current user hasn't completed onboarding yet. */
export function usePatientHome(enabled = true) {
  return useDetailQuery<PatientHome>({
    queryKey: ['patient', 'home'],
    queryFn: async () => {
      const { data } = await api.get<{ data: PatientHome }>(endpoints.patient.home);
      return data.data;
    },
    enabled,
  });
}
