import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import type { CreateProblemReportRequest, ProblemReport } from '@/types/problem-report.types';

/**
 * `POST /problem-reports` — submits a bug/issue report for the current
 * authenticated user (not `patient`-namespaced: it's a general endpoint
 * available to any authenticated user, not patient-only). Sent as
 * `multipart/form-data` since photos are optional attachments; the backend
 * derives `source` from the `x-platform` header the shared `api` instance
 * already sends on every request, so it isn't included in the payload here.
 */
export function useSubmitReport() {
  return useApiMutation<ProblemReport, CreateProblemReportRequest>({
    mutationFn: async ({ title, description, images }) => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      images.forEach((image) => {
        // React Native's FormData accepts this `{ uri, name, type }` shape for file parts —
        // it isn't a real `Blob`/`File`, so it's cast to satisfy `FormData.append`'s DOM typing.
        formData.append('images', {
          uri: image.uri,
          name: image.name,
          type: image.type,
        } as unknown as Blob);
      });

      const { data } = await api.post<{ data: ProblemReport }>(endpoints.problemReports, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    },
    successMessage: 'تم إرسال البلاغ بنجاح',
  });
}
