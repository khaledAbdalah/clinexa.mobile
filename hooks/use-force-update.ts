import { useSettingsStore } from '@/store/settings';
import { SettingKeys } from '@/constants/settings.constant';
import { APP_VERSION, IsIOS } from '@/constants/app';
import { isVersionBelow } from '@/lib/version';

export function useForceUpdate() {
  const forceUpdateEnabled = useSettingsStore(
    (state) =>
      state.get(
        IsIOS ? SettingKeys.IOS_FORCE_UPDATE_ENABLED : SettingKeys.ANDROID_FORCE_UPDATE_ENABLED
      ) === true
  );
  const minVersion = useSettingsStore((state) =>
    state.get(IsIOS ? SettingKeys.IOS_MIN_VERSION : SettingKeys.ANDROID_MIN_VERSION)
  );
  const storeUrl = useSettingsStore((state) =>
    state.get(IsIOS ? SettingKeys.APP_STORE_URL : SettingKeys.GOOGLE_PLAY_URL)
  );

  const isForceUpdateRequired =
    forceUpdateEnabled &&
    typeof minVersion === 'string' &&
    minVersion.length > 0 &&
    isVersionBelow(APP_VERSION, minVersion);

  return {
    isForceUpdateRequired,
    storeUrl: typeof storeUrl === 'string' ? storeUrl : null,
  };
}
