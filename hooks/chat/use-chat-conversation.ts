import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useDetailQuery } from '@/hooks/queries/use-detail-query';
import type { ChatBootstrap } from '@/types/chat.types';

/**
 * Bootstraps the patient's single clinic conversation: `GET
 * /patient/chat/conversation` lazily creates it if this is the patient's
 * first contact, and returns it together with the most recent page of
 * messages in one composite payload.
 *
 * This fits `useDetailQuery` fine even though the payload is a composite
 * `{conversation, messages}` shape rather than a single flat resource -
 * `useDetailQuery` is generic over `T` and the whole bootstrap response IS
 * the single resource being fetched (there's exactly one conversation per
 * patient). A bespoke `useQuery` call would've added nothing here; the
 * bespoke handling this feature actually needs is for `GET
 * /patient/chat/messages` (see `use-chat-messages.ts`), whose response is a
 * plain array with no pagination envelope at all.
 *
 * `enabled` defaults to `true` (matching `useDetailQuery`'s own default) -
 * `hooks/chat/use-global-chat-notifications.ts` passes it explicitly so the
 * root-mounted hook only fetches/connects once the patient is actually
 * authenticated.
 */
export function useChatConversation(options?: { enabled?: boolean }) {
  return useDetailQuery<ChatBootstrap>({
    queryKey: ['patient', 'chat', 'conversation'],
    queryFn: async () => {
      const { data } = await api.get<{ data: ChatBootstrap }>(endpoints.patient.chat.conversation);
      return data.data;
    },
    staleTime: 0,
    refetchOnMount: 'always',
    enabled: options?.enabled,
  });
}
