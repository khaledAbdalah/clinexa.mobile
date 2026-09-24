import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useDetailQuery } from '@/hooks/queries/use-detail-query';
import type { Service } from '@/types/appointment.types';

/**
 * `GET /patient/services` — the tenant's active service catalog (id, name,
 * price), used for the optional service-picker step on the booking screen.
 *
 * Response is `{ data: { id, name, price }[] }`, tenant-scoped and already
 * filtered to active services. Mirrors `use-doctors.ts`'s shape/pattern.
 */
export function useServices() {
  return useDetailQuery<Service[]>({
    queryKey: ['patient', 'services'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Service[] }>(endpoints.patient.services);
      return data.data;
    },
  });
}
