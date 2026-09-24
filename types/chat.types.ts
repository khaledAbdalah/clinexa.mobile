export type ChatSenderType = 'user' | 'patient';

export interface ChatMessage {
  id: string;
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
