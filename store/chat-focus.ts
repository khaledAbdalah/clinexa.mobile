import { create } from 'zustand';

type ChatFocusState = {
  isFocused: boolean;
  setFocused: (isFocused: boolean) => void;
};

/**
 * Whether the patient is currently looking at the chat screen, mirrored here
 * (outside `use-chat.ts`) so the app-wide notification hook
 * (`hooks/chat/use-global-chat-notifications.ts`) can read it via
 * `getState()` from inside a socket event callback, without subscribing to
 * `use-chat.ts`'s own render tree. `use-chat.ts` sets this alongside its
 * local `isFocusedRef` (unchanged) in its `useFocusEffect` - see the comment
 * there for why the screen needs its own ref too.
 *
 * Exists purely to prevent the global hook from double-counting a staff
 * message the chat screen's own socket already rendered live and marked
 * read while focused - see `use-global-chat-notifications.ts`.
 */
export const useChatFocusStore = create<ChatFocusState>((set) => ({
  isFocused: false,
  setFocused: (isFocused) => set({ isFocused }),
}));
