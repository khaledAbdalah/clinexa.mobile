import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useChatConversation } from '@/hooks/chat/use-chat-conversation';
import { useSendChatMessage } from '@/hooks/chat/use-send-chat-message';
import { ChatSocket } from '@/lib/chat-socket';
import { useChatFocusStore } from '@/store/chat-focus';
import type { ChatBootstrap, ChatMessage } from '@/types/chat.types';

const OLDER_PAGE_LIMIT = 30;
// `GET /patient/chat/conversation` returns the latest 50 messages inline -
// used to tell whether that initial page is full (there may be older history
// to page through) or short (it already covers the whole conversation).
const BOOTSTRAP_MESSAGES_LIMIT = 50;

/**
 * Union-by-id merge of a bootstrap/refetch page into the locally-owned
 * message list, sorted oldest -> newest. Never drops entries that aren't in
 * `incoming` (optimistic sends still in flight, older pages already loaded
 * via `loadOlderMessages`) - it only adds/overwrites by id.
 */
function mergeMessages(base: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  const byId = new Map(base.map((message) => [message.id, message]));
  for (const message of incoming) byId.set(message.id, message);
  return Array.from(byId.values()).sort((a, b) => {
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return diff !== 0 ? diff : a.id.localeCompare(b.id);
  });
}

/**
 * Orchestrates the patient chat screen: bootstraps the conversation, keeps a
 * locally-owned message list (every bootstrap refetch is merged in by id, then
 * patched by pagination/socket/send - never replaced wholesale, since a chat
 * feed must never "snap back" under a user who's mid-scroll or mid-type),
 * manages the `/chat` socket's lifecycle
 * for exactly this screen's mount, and exposes sending + older-message
 * pagination.
 */
export function useChat() {
  const {
    data: bootstrap,
    isLoading: isBootstrapping,
    error: bootstrapError,
    refetch: refetchConversation,
  } = useChatConversation();
  const conversation = bootstrap?.conversation;
  // Effects below key off the id, not the object: every refetch or cache
  // patch (e.g. clearing unreadCount) yields a new `conversation` object,
  // which would otherwise tear down and reconnect the socket each time.
  const conversationId = conversation?.id;
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMoreOlder, setHasMoreOlder] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const seededConversationId = useRef<string | null>(null);
  // Bottom-tab screens stay mounted (not unmounted on tab switch), so
  // `useFocusEffect` below can fire while a live `new_message` also arrives -
  // this tracks whether the chat screen is the one currently on-screen, so
  // an incoming staff message can be treated as already-read instead of
  // bumping the tab badge behind the patient's back. Kept as a plain ref
  // (not just the `useChatFocusStore` below) since `appendMessage` reads it
  // synchronously inside this same hook and a ref avoids any re-render
  // detour for that.
  const isFocusedRef = useRef(false);
  const chatSocketRef = useRef<ChatSocket | null>(null);

  // Zeroes the tab bar's unread badge directly in cache - cheaper and more
  // immediate than waiting on a conversation refetch, and correct here
  // because both call sites (mark-read REST/socket ack, a staff message
  // arriving while this screen is focused) are precisely the moments the
  // count *becomes* zero.
  const clearUnreadCount = useCallback(() => {
    // Returns the same reference when already zero, so repeated read acks
    // don't hand dependents a new `conversation` object for nothing.
    queryClient.setQueryData<ChatBootstrap>(['patient', 'chat', 'conversation'], (old) =>
      old && old.conversation.unreadCount !== 0
        ? { ...old, conversation: { ...old.conversation, unreadCount: 0 } }
        : old
    );
  }, [queryClient]);

  useEffect(() => {
    if (!bootstrap) return;
    const isNewConversation = seededConversationId.current !== bootstrap.conversation.id;
    seededConversationId.current = bootstrap.conversation.id;

    // Merge rather than replace: the tab bar keeps this screen's query
    // cached across tab switches, so a refetch (e.g. the focus refetch
    // below) must patch in whatever's new - like a staff reply - without
    // discarding optimistic sends still in flight or older pages already
    // paged in via `loadOlderMessages`.
    setMessages((prev) => mergeMessages(isNewConversation ? [] : prev, bootstrap.messages));

    if (isNewConversation) {
      setHasMoreOlder(bootstrap.messages.length >= BOOTSTRAP_MESSAGES_LIMIT);
    }
  }, [bootstrap]);

  const appendMessage = useCallback(
    (incoming: ChatMessage) => {
      setMessages((prev) => {
        // Optimistic-send + socket-echo dedupe: the POST response is appended
        // immediately by `sendMessage` below, and the server's `new_message`
        // broadcast for that same message arrives moments later over the
        // socket - both funnel through this same id-keyed check, so whichever
        // arrives second is silently dropped instead of duplicating the bubble.
        if (prev.some((message) => message.id === incoming.id)) return prev;
        return [...prev, incoming];
      });

      // A staff message arriving while the patient is looking at this
      // screen is read the moment it renders - tell the server and clear
      // the badge locally instead of leaving it to the next focus/refetch.
      if (incoming.senderType === 'user' && isFocusedRef.current) {
        chatSocketRef.current?.markRead(incoming.conversationId);
        clearUnreadCount();
      }
    },
    [clearUnreadCount]
  );

  useEffect(() => {
    if (!conversationId) return;

    const chatSocket = new ChatSocket();
    chatSocketRef.current = chatSocket;
    let cancelled = false;

    (async () => {
      try {
        await chatSocket.connect();
        if (cancelled) return;
        chatSocket.joinConversation(conversationId);
        chatSocket.onNewMessage(appendMessage);
        chatSocket.onMarkedRead(clearUnreadCount);
        chatSocket.markRead(conversationId);
      } catch {
        // Live delivery unavailable this session (e.g. offline) - sending
        // still works over REST, the patient just won't see the clinic's
        // replies until reopening the screen.
      }
    })();

    return () => {
      cancelled = true;
      chatSocket.disconnect();
      chatSocketRef.current = null;
    };
  }, [conversationId, appendMessage, clearUnreadCount]);

  // Fired whenever the screen (re)gains focus. Bottom-tab screens stay
  // mounted across tab switches, so the conversation query the tab bar
  // populated earlier can be stale by the time the patient opens chat -
  // refetch it here alongside the REST read receipt (a complement to the
  // socket's `mark_read`, covering the case the socket never connects).
  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;
      // Lets `use-global-chat-notifications.ts` (mounted at the app root, so
      // it has no other way to know this screen is on-screen) skip bumping
      // the tab badge for messages this screen is about to mark read itself.
      useChatFocusStore.getState().setFocused(true);
      if (conversationId) {
        // Read first, then refetch: a refetch that raced ahead of the read
        // receipt would bring back the pre-read unreadCount and re-show the badge.
        api
          .post(endpoints.patient.chat.read)
          .then(clearUnreadCount)
          .catch(() => {})
          .finally(() => refetchConversation());
      }
      return () => {
        isFocusedRef.current = false;
        useChatFocusStore.getState().setFocused(false);
      };
    }, [conversationId, refetchConversation, clearUnreadCount])
  );

  const sendMutation = useSendChatMessage();

  const sendMessage = useCallback(
    (body: string) => {
      const trimmed = body.trim();
      if (!trimmed || !conversation) return;

      // Optimistic bubble: without this the patient's own message only appears
      // after the POST round-trip resolves, which on a cold/first-of-session
      // connection is slow enough to visibly lag behind the clinic's already-
      // loaded greeting - looking like the greeting "jumps in front of" the
      // message the patient just sent. A locally-timestamped temp id keeps this
      // entry out of `appendMessage`'s id-dedupe until it's swapped for the real
      // one below (or dropped entirely if the send fails).
      const tempId = `optimistic-${Date.now()}`;
      const optimisticMessage: ChatMessage = {
        id: tempId,
        conversationId: conversation.id,
        senderType: 'patient',
        senderId: conversation.patientId,
        body: trimmed,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMessage]);

      sendMutation.mutate(trimmed, {
        onSuccess: (message) => {
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
          appendMessage(message);
        },
        onError: () => {
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
        },
      });
    },
    [conversation, sendMutation, appendMessage]
  );

  const loadOlderMessages = useCallback(async () => {
    if (!conversation || isLoadingOlder || !hasMoreOlder || messages.length === 0) return;

    // Skip locally-generated optimistic ids (`optimistic-<timestamp>`) when
    // picking the pivot for `beforeId` - the API validates it as a uuid, and
    // an optimistic send that hasn't resolved yet would otherwise land at
    // index 0 as the "oldest" message.
    const oldestRealMessage = messages.find((message) => !message.id.startsWith('optimistic-'));
    if (!oldestRealMessage) return;

    setIsLoadingOlder(true);
    try {
      const oldestId = oldestRealMessage.id;
      const { data } = await api.get<{ data: ChatMessage[] }>(endpoints.patient.chat.messages, {
        params: { limit: OLDER_PAGE_LIMIT, beforeId: oldestId },
      });
      const older = data.data;

      if (older.length === 0) {
        setHasMoreOlder(false);
      } else {
        setMessages((prev) => [...older, ...prev]);
        if (older.length < OLDER_PAGE_LIMIT) setHasMoreOlder(false);
      }
    } finally {
      setIsLoadingOlder(false);
    }
  }, [conversation, messages, isLoadingOlder, hasMoreOlder]);

  return {
    messages,
    isBootstrapping,
    bootstrapError,
    hasMoreOlder,
    isLoadingOlder,
    loadOlderMessages,
    sendMessage,
    isSending: sendMutation.isPending,
  };
}
