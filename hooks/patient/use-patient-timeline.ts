import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useDetailQuery } from '@/hooks/queries/use-detail-query';
import type { TimelineEntry } from '@/types/timeline.types';

/** Merged, date-sorted feed of appointments/encounters/prescriptions/invoices/payments. */
export function usePatientTimeline(enabled = true) {
  return useDetailQuery<TimelineEntry[]>({
    queryKey: ['patient', 'timeline'],
    queryFn: async () => {
      const { data } = await api.get<{ data: TimelineEntry[] }>(endpoints.patient.timeline);
      return data.data;
    },
    enabled,
  });
}
