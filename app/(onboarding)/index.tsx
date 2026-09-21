import { View } from 'react-native';

import { useEntryRedirect } from '@/hooks/use-entry-redirect';

/**
 * Pure redirect gate for '/'. Never renders real content — by the time it
 * mounts, `useAppBootstrap`'s `checkAuth()` has already resolved, so it just
 * decides where to send the user (home tabs or the welcome screen) and gets
 * out of the way before the splash overlay finishes fading.
 */
export default function Index() {
  useEntryRedirect();

  return <View className="bg-background flex-1" />;
}
