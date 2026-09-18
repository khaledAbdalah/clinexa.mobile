import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const BACKGROUND_COLOR = '#FFFFFF';
const FADE_DURATION = 400;

// splash-pattern.png is 1536×1024. The artwork is an abstract wave, so rendering it with
// `cover` against a height-driven box crops the sides harmlessly and lets the waves fill
// the bottom third of the screen the way the design calls for.
const PATTERN_HEIGHT_RATIO = 0.38;

/**
 * Branded splash shown over the app until it is ready.
 *
 * The wordmark, tagline, spinner and wave pattern live here rather than in the native
 * splash because the Android 12+ splash API only renders a background colour plus a
 * centred icon.
 */
export function SplashOverlay({ isAppReady }: { isAppReady: boolean }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const [isHidden, setHidden] = useState(false);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Handing off on `onLoadEnd` rather than `onLayout` guarantees the artwork is painted
  // before the native splash disappears, so there is no white flash between the two.
  const onPatternLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
    } catch {
      // Native splash may already be gone (e.g. fast reload).
    }
  }, []);

  useEffect(() => {
    if (!isAppReady) return;
    Animated.timing(opacity, {
      toValue: 0,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start(() => setHidden(true));
  }, [isAppReady, opacity]);

  if (isHidden) return null;

  const logoSize = screenWidth * 0.32;

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.container, { opacity }]}
    >
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/splash-icon.png')}
          style={{ width: logoSize, height: logoSize }}
          contentFit="contain"
          transition={0}
        />
        <Text style={styles.title}>Clinexa</Text>
        <Text style={styles.tagline}>عيادتك في جيبك</Text>
        <ActivityIndicator size="large" color="#0d9488" style={styles.indicator} />
      </View>

      <Image
        source={require('@/assets/images/splash-pattern.png')}
        onLoadEnd={onPatternLoaded}
        style={[
          styles.pattern,
          { width: screenWidth, height: screenHeight * PATTERN_HEIGHT_RATIO },
        ]}
        contentFit="cover"
        transition={0}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    paddingBottom: '20%',
  },
  title: {
    marginTop: 20,
    fontFamily: 'app-font-bold',
    fontSize: 34,
    color: '#0F172A',
  },
  tagline: {
    marginTop: 8,
    fontFamily: 'app-font-regular',
    fontSize: 17,
    color: '#64748B',
  },
  indicator: {
    marginTop: 36,
  },
  pattern: {
    position: 'absolute',
    bottom: 0,
  },
});
