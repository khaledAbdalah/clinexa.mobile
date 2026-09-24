import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useDetailQuery } from '@/hooks/queries/use-detail-query';
import type { Patient } from '@/types/patient.types';

/** 404s if the current user hasn't completed onboarding yet. */
export function usePatientProfile(enabled = true) {
  return useDetailQuery<Patient>({
    queryKey: ['patient', 'profile'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Patient }>(endpoints.patient.profile);
      return data.data;
    },
    enabled,
  });
}
