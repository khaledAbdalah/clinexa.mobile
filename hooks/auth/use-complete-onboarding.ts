import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import type { CompleteOnboardingRequest, Patient } from '@/types/patient.types';

/** Creates the `Patient` record for the current (already phone-verified) user. */
export function useCompleteOnboarding() {
  return useApiMutation<Patient, CompleteOnboardingRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post<{ data: Patient }>(endpoints.patient.onboarding, body);
      return data.data;
    },
    invalidateQueryKeys: [['patient', 'profile']],
  });
}
