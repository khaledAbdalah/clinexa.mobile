import { io, type Socket } from 'socket.io-client';

import { refreshAccessToken } from '@/config/api';
import { SecureStorage } from '@/config/secure-storage';
import type { ChatMessage } from '@/types/chat.types';

const CHAT_NAMESPACE = '/chat';

/**
 * Derives the Socket.IO connection origin from `EXPO_PUBLIC_API_URL`.
 *
 * `config/api.ts`'s axios `baseURL` includes the REST path suffix (e.g.
 * `https://api.example.com/api/v1`), but Socket.IO attaches directly to the
 * underlying Node HTTP server at its default `/socket.io/` path, not under
 * that REST prefix - confirmed server-side in
 * `app/services/socket/socket_service.ts` (`new Server(server.getNodeServer(), ...)`
 * with no custom `path` option) and `start/socket.ts` (`socketService.boot()`
 * runs in `app.ready()`, wiring Socket.IO onto the same HTTP server Adonis
 * already listens on). So only the origin (protocol + host [+ port]) is
 * needed here - the client appends `/chat` as the namespace and
 * socket.io-client handles the `/socket.io/` transport path itself.
 */
export function resolveSocketOrigin(): string {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('EXPO_PUBLIC_API_URL is not configured');
  }
  return new URL(apiUrl).origin;
}

type NewMessageListener = (message: ChatMessage) => void;
type MarkedReadListener = (payload: { conversationId: string }) => void;
type ErrorListener = (payload: { message: string }) => void;

/**
 * Encapsulates the `/chat` Socket.IO namespace's connect -> join -> listen ->
 * leave -> disconnect lifecycle for a single conversation. Not tied to a
 * single owner - `hooks/chat/use-chat.ts` creates one scoped to the chat
 * screen's own mount lifetime, and `hooks/chat/use-global-chat-notifications.ts`
 * creates a second, independent instance scoped to the whole app's lifetime
 * (for the tab badge/notification sound while the chat screen isn't open).
 * Each owner creates its own instance and disconnects it when it's done.
 */
export class ChatSocket {
  private socket: Socket | null = null;
  private conversationId: string | null = null;

  /**
   * Access tokens expire after 15 minutes, so the stored token may be stale
   * by the time the chat screen opens. Try it first; if the handshake is
   * rejected, refresh once through the same flow `config/api.ts`'s response
   * interceptor uses for REST calls and retry. Refreshing only on failure
   * avoids rotating the refresh token on every screen mount (and racing a
   * concurrent REST refresh).
   */
  async connect(): Promise<Socket> {
    const storedToken = await SecureStorage.getAccessToken();
    if (storedToken) {
      try {
        return await this.attemptConnect(storedToken);
      } catch (error) {
        this.socket?.disconnect();
        if (__DEV__) {
          console.error('[ChatSocket] connect_error, retrying with a fresh token', error);
        }
      }
    }
    const freshToken = await refreshAccessToken();
    return this.attemptConnect(freshToken);
  }

  private attemptConnect(token: string): Promise<Socket> {
    const socket = io(`${resolveSocketOrigin()}${CHAT_NAMESPACE}`, {
      auth: { token },
      transports: ['websocket'],
    });
    this.socket = socket;

    return new Promise<Socket>((resolve, reject) => {
      socket.once('connect', () => resolve(socket));
      socket.once('connect_error', (error: Error) => reject(error));
    });
  }

  joinConversation(conversationId: string) {
    this.conversationId = conversationId;
    this.socket?.emit('join_conversation', conversationId);
  }

  markRead(conversationId: string) {
    this.socket?.emit('mark_read', conversationId);
  }

  onNewMessage(listener: NewMessageListener) {
    this.socket?.on('new_message', listener);
    return () => this.socket?.off('new_message', listener);
  }

  onMarkedRead(listener: MarkedReadListener) {
    this.socket?.on('marked_read', listener);
    return () => this.socket?.off('marked_read', listener);
  }

  onError(listener: ErrorListener) {
    this.socket?.on('error', listener);
    return () => this.socket?.off('error', listener);
  }

  /** Emits `leave_conversation` for the joined conversation, then disconnects. */
  disconnect() {
    if (this.conversationId) {
      this.socket?.emit('leave_conversation', this.conversationId);
    }
    this.socket?.disconnect();
    this.socket = null;
    this.conversationId = null;
  }
}
