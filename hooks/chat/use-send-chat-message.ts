import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import type { ChatMessage } from '@/types/chat.types';

/**
 * `POST /patient/chat/messages`. No `successMessage` toast - a sent chat
 * bubble appearing in the list is feedback enough, matching how chat UIs
 * normally behave. No `invalidateQueryKeys` either: the caller
 * (`useChat`) owns the local message list directly and appends the
 * response itself rather than refetching.
 */
export function useSendChatMessage() {
  return useApiMutation<ChatMessage, string>({
    mutationFn: async (body) => {
      const { data } = await api.post<{ data: ChatMessage }>(endpoints.patient.chat.messages, {
        body,
      });
      return data.data;
    },
    errorMessage: 'تعذر إرسال الرسالة',
  });
}
