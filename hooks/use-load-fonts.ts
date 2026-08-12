import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export function useLoadFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        await Font.loadAsync({
          'app-font-regular': require('@/assets/fonts/IBMPlexSansArabic/IBMPlexSansArabic-Regular.ttf'),
          'app-font-semibold': require('@/assets/fonts/IBMPlexSansArabic/IBMPlexSansArabic-SemiBold.ttf'),
          'app-font-bold': require('@/assets/fonts/IBMPlexSansArabic/IBMPlexSansArabic-Bold.ttf'),
        });
      } catch (error) {
        console.error('Font loading error:', error);
      } finally {
        setFontsLoaded(true);
      }
    }

    load();
  }, []);

  return fontsLoaded;
}
