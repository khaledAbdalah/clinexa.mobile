import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useListQuery } from '@/hooks/queries/use-list-query';
import type { CursorPage } from '@/hooks/queries/types';
import type { Prescription } from '@/types/prescription.types';

interface RawPrescriptionsResponse {
  data: {
    items: Prescription[];
    pagination: { nextCursor: string | null; hasMore: boolean };
  };
}

interface UsePrescriptionsOptions {
  limit?: number;
}

export function usePrescriptions({ limit = 20 }: UsePrescriptionsOptions = {}) {
  return useListQuery<Prescription>({
    queryKey: ['patient', 'prescriptions', { limit }],
    queryFn: async (cursor) => {
      const { data } = await api.get<RawPrescriptionsResponse>(endpoints.patient.prescriptions, {
        params: { cursor, limit },
      });
      const page: CursorPage<Prescription> = {
        data: data.data.items,
        total: 0,
        nextCursor: data.data.pagination.nextCursor,
        hasMore: data.data.pagination.hasMore,
      };
      return page;
    },
  });
}
