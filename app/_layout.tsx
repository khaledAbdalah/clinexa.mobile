import { PortalHost } from '@rn-primitives/portal';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { ErrorBoundary } from '@/components/other/error-boundary';
import { SplashOverlay } from '@/components/other/splash-overlay';
import { toastConfig } from '@/config/toast';
import { useAppBootstrap } from '@/hooks/use-app-bootstrap';
import { useBootStore } from '@/store/boot';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isReady = useAppBootstrap();
  const entryResolved = useBootStore((state) => state.entryResolved);
  const isAppReady = isReady && entryResolved;

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar hidden />
          <ErrorBoundary>
            {isReady ? <Stack screenOptions={{ headerShown: false }} /> : null}
          </ErrorBoundary>
          <PortalHost />
          <Toast config={toastConfig} />
          <SplashOverlay isAppReady={isAppReady} />
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
