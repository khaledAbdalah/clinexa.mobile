export type ChatSenderType = 'user' | 'patient';

export interface ChatMessage {
  id: string;
  /**
   * Stable identity for the optimistic-send -> server-confirmed swap in `useChat`.
   * Set to the temp id on the optimistic bubble and carried over onto the real
   * message once the server responds, so `keyExtractor` (which reads this instead
   * of `id`) never changes - a changing key would force React/FlatList to unmount
   * and remount that row (a visible flicker) purely because the id went from a
   * local `optimistic-...` string to the server's real uuid.
   */
  clientId?: string;
  conversationId: string;
  senderType: ChatSenderType;
  senderId: string;
  body: string;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  patientId: string;
  lastMessageAt: string | null;
  patientLastReadAt: string | null;
  staffLastReadAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  unreadCount: number;
}

export interface ChatBootstrap {
  conversation: ChatConversation;
  messages: ChatMessage[];
}
