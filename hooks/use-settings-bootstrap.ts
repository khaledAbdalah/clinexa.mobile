import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settings';

const SETTINGS_FETCH_TIMEOUT_MS = 8000;

export function useSettingsBootstrap() {
  const [settingsFetched, setSettingsFetched] = useState(false);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);

  useEffect(() => {
    let settled = false;
    const timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      console.warn(
        `Settings bootstrap timed out after ${SETTINGS_FETCH_TIMEOUT_MS}ms; continuing.`
      );
      setSettingsFetched(true);
    }, SETTINGS_FETCH_TIMEOUT_MS);

    async function run() {
      try {
        await fetchSettings();
      } catch (error) {
        console.error('Settings bootstrap error:', error);
      } finally {
        clearTimeout(timeoutId);
        if (!settled) {
          settled = true;
          setSettingsFetched(true);
        }
      }
    }

    run();

    return () => clearTimeout(timeoutId);
  }, [fetchSettings]);

  return settingsFetched;
}
