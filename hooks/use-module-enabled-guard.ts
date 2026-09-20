import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/store/settings';
import { routes } from '@/constants/routes';

/**
 * Redirects back to the home tab when the given feature-flag setting key is
 * disabled. Call from screens that only make sense when their backing module
 * is enabled and skip rendering the screen's content while `isRestricted` is true.
 */
export function useModuleEnabledGuard(settingKey: string) {
  const router = useRouter();
  const isModuleEnabled = useSettingsStore((state) => state.isEnabled(settingKey));
  const isRestricted = !isModuleEnabled;

  useEffect(() => {
    if (isRestricted) {
      router.replace(routes.tabsHome);
    }
  }, [isRestricted, router]);

  return isRestricted;
}
