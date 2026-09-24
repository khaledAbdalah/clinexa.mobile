import { useAudioPlayer } from 'expo-audio';
import { useCallback } from 'react';

const NOTIFICATION_SOUND = require('@/assets/audio/notification.wav');

/**
 * Plays a short incoming-message chime. `useAudioPlayer` hands back a stable
 * player instance for the component's lifetime, so `play` is memoized on it -
 * callers (e.g. `hooks/chat/use-global-chat-notifications.ts`) can safely put
 * it in a `useEffect` dependency array without the effect re-running on every
 * render. `seekTo(0)` rewinds before each play so rapid back-to-back messages
 * each get the full chime instead of overlapping mid-clip.
 */
export function useNotificationSound() {
  const player = useAudioPlayer(NOTIFICATION_SOUND);

  const play = useCallback(() => {
    player.seekTo(0);
    player.play();
  }, [player]);

  return { play };
}
