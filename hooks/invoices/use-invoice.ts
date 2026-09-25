import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useDetailQuery } from '@/hooks/queries/use-detail-query';
import type { Invoice } from '@/types/invoice.types';

/**
 * Single-invoice detail (includes `items`/`payments`/`installments`, unlike the list
 * rows from `useInvoices`). 404s if the invoice doesn't exist or isn't the current
 * patient's — same treatment either way, per the backend contract.
 */
export function useInvoice(id: string | undefined) {
  return useDetailQuery<Invoice>({
    queryKey: ['patient', 'invoice', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Invoice }>(endpoints.patient.invoice(id as string));
      return data.data;
    },
    enabled: !!id,
  });
}
