import { DevSettings, I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

// The app is Arabic-only, so layout direction is forced RTL app-wide rather
// than left to device locale. Forcing it only takes effect on native's next
// launch, so once the persisted flag actually changes we reload immediately
// (dev via Fast Refresh's reload, standalone builds via expo-updates) instead
// of leaving the user on a half-LTR layout until they restart manually.
function applyForcedRtl() {
  if (I18nManager.isRTL) return;

  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);

  if (__DEV__) {
    DevSettings.reload();
  } else {
    Updates.reloadAsync().catch(() => {});
  }
}

applyForcedRtl();
