import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useDetailQuery } from '@/hooks/queries/use-detail-query';
import type { Prescription } from '@/types/prescription.types';

export function usePrescription(id: string | undefined) {
  return useDetailQuery<Prescription>({
    queryKey: ['patient', 'prescription', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Prescription }>(
        endpoints.patient.prescription(id as string)
      );
      return data.data;
    },
    enabled: !!id,
  });
}
