import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import type { Patient, UpdatePatientProfileRequest } from '@/types/patient.types';

/** Partial update of the current patient's profile. Invalidates the cached `usePatientProfile()` data. */
export function useUpdatePatientProfile() {
  return useApiMutation<Patient, UpdatePatientProfileRequest>({
    mutationFn: async (body) => {
      const { data } = await api.patch<{ data: Patient }>(endpoints.patient.profile, body);
      return data.data;
    },
    successMessage: 'تم تحديث بياناتك بنجاح',
    invalidateQueryKeys: [['patient', 'profile']],
  });
}
