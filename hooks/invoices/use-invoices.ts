import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useListQuery } from '@/hooks/queries/use-list-query';
import type { CursorPage } from '@/hooks/queries/types';
import type { Invoice } from '@/types/invoice.types';

interface RawInvoicesResponse {
  data: {
    items: Invoice[];
    pagination: { nextCursor: string | null; hasMore: boolean };
  };
}

interface UseInvoicesOptions {
  limit?: number;
}

/**
 * Cursor-paginated via `useListQuery`, matching `useNotifications`'s pattern.
 * `GET /patient/invoices`'s envelope carries no `total` (same omission as
 * `GET /notifications`), so `total` is hardcoded to 0 here.
 */
export function useInvoices({ limit = 20 }: UseInvoicesOptions = {}) {
  return useListQuery<Invoice>({
    queryKey: ['patient', 'invoices', { limit }],
    queryFn: async (cursor) => {
      const { data } = await api.get<RawInvoicesResponse>(endpoints.patient.invoices, {
        params: { cursor, limit },
      });
      const page: CursorPage<Invoice> = {
        data: data.data.items,
        total: 0,
        nextCursor: data.data.pagination.nextCursor,
        hasMore: data.data.pagination.hasMore,
      };
      return page;
    },
  });
}
