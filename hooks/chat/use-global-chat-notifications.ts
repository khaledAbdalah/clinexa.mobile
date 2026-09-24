import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useChatConversation } from '@/hooks/chat/use-chat-conversation';
import { useNotificationSound } from '@/hooks/use-notification-sound';
import { ChatSocket } from '@/lib/chat-socket';
import { useAuthStore } from '@/store/auth';
import { useChatFocusStore } from '@/store/chat-focus';
import type { ChatBootstrap, ChatMessage } from '@/types/chat.types';

/**
 * App-wide counterpart to `use-chat.ts`'s screen-scoped `/chat` socket -
 * mounted once near the root (`app/_layout.tsx`, alongside
 * `usePushTokenRegistration`) so a staff reply bumps the "المحادثة" tab badge
 * (`components/sliding-tab-bar.tsx`, reading the same
 * `['patient','chat','conversation']` cache) and plays a notification sound
 * no matter which tab the patient is on - not only while the chat screen
 * happens to be mounted and focused.
 *
 * This is deliberately a *second*, independent `ChatSocket` connection
 * rather than a shared one - `use-chat.ts`'s socket is created/destroyed
 * with the chat screen's own mount lifecycle, and re-plumbing it to survive
 * unmount would risk the screen-scoped behavior that already works
 * correctly (live-append while focused, clearing the badge on read). Running
 * both in parallel means a `new_message` while the chat screen is open is
 * delivered to both connections - this hook still plays the sound for it (a
 * message arriving is a message arriving), but see the focus check below for
 * why it never double-counts the unread badge for it.
 */
export function useGlobalChatNotifications(isReady: boolean) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const enabled = isReady && isAuthenticated;

  // Reuses the same query key `use-chat.ts`/`sliding-tab-bar.tsx` already
  // populate - if nothing has fetched it yet this session, mounting the hook
  // with `enabled: true` triggers the bootstrap fetch itself.
  const { data: bootstrap } = useChatConversation({ enabled });
  const conversationId = bootstrap?.conversation.id;
  const queryClient = useQueryClient();
  const { play } = useNotificationSound();

  // Guards against the exact same event being processed twice by *this*
  // listener (e.g. a brief reconnect re-delivering the latest message) - not
  // against `use-chat.ts`'s own socket, which is a separate connection
  // covering a separate concern (see the focus check below).
  const lastMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !conversationId) return;

    const chatSocket = new ChatSocket();
    let cancelled = false;

    (async () => {
      try {
        await chatSocket.connect();
        if (cancelled) return;
        chatSocket.joinConversation(conversationId);
        chatSocket.onNewMessage((message: ChatMessage) => {
          if (message.senderType !== 'user') return;
          if (lastMessageIdRef.current === message.id) return;
          lastMessageIdRef.current = message.id;

          play();

          // The chat screen's own socket already renders this message live
          // and marks it read/clears the badge the instant it arrives while
          // focused (see `appendMessage` in use-chat.ts) - bumping the count
          // here too would either fight that clear or double-count the same
          // message, so only increment while the patient is on another tab.
          if (useChatFocusStore.getState().isFocused) return;

          queryClient.setQueryData<ChatBootstrap>(['patient', 'chat', 'conversation'], (old) =>
            old
              ? {
                  ...old,
                  conversation: {
                    ...old.conversation,
                    unreadCount: old.conversation.unreadCount + 1,
                  },
                }
              : old
          );
        });
      } catch {
        // Live delivery unavailable this session (e.g. offline) - the badge
        // still catches up next time the conversation query refetches.
      }
    })();

    return () => {
      cancelled = true;
      chatSocket.disconnect();
    };
  }, [enabled, conversationId, queryClient, play]);
}
