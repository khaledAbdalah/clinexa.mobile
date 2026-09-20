import { PortalHost } from '@rn-primitives/portal';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { ErrorBoundary } from '@/components/other/error-boundary';
import { ForceUpdateScreen } from '@/components/other/force-update-screen';
import { MaintenanceScreen } from '@/components/other/maintenance-screen';
import { SplashOverlay } from '@/components/other/splash-overlay';
import { toastConfig } from '@/config/toast';
import { SettingKeys } from '@/constants/settings.constant';
import { useAppBootstrap } from '@/hooks/use-app-bootstrap';
import { useForceUpdate } from '@/hooks/use-force-update';
import { useBootStore } from '@/store/boot';
import { useSettingsStore } from '@/store/settings';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isReady = useAppBootstrap();
  const entryResolved = useBootStore((state) => state.entryResolved);
  const isMaintenanceMode = useSettingsStore(
    (state) => state.get(SettingKeys.MAINTENANCE_MODE_ENABLED) === true
  );
  const { isForceUpdateRequired, storeUrl } = useForceUpdate();
  // Maintenance mode and force-update both skip the index redirect (which normally
  // flips entryResolved), so the splash must be allowed to hide on its own here.
  const isAppReady = isReady && (entryResolved || isMaintenanceMode || isForceUpdateRequired);

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar hidden />
          <ErrorBoundary>
            {isReady ? (
              isMaintenanceMode ? (
                <MaintenanceScreen />
              ) : isForceUpdateRequired ? (
                <ForceUpdateScreen storeUrl={storeUrl} />
              ) : (
                <Stack screenOptions={{ headerShown: false }} />
              )
            ) : null}
          </ErrorBoundary>
          <PortalHost />
          <Toast config={toastConfig} />
          <SplashOverlay isAppReady={isAppReady} />
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
