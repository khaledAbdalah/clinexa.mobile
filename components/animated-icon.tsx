import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const DURATION = 600;

// Matches assets/images/splash-pattern.png's aspect ratio (1536×1024), so the
// wave graphic scales to the screen width without distortion.
const PATTERN_ASPECT_RATIO = 1536 / 1024;

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);
  const { width: screenWidth } = useWindowDimensions();

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      transform: [{ scale: 1 }],
      opacity: 1,
    },
    20: {
      opacity: 1,
    },
    70: {
      opacity: 0,
      easing: Easing.elastic(0.7),
    },
    100: {
      opacity: 0,
      transform: [{ scale: 1 }],
      easing: Easing.elastic(0.7),
    },
  });

  const content = (
    <>
      <View style={styles.content}>
        <Image style={styles.logo} source={require('@/assets/images/splash-icon.png')} />
        <Text style={styles.title}>Clinexa</Text>
        <Text style={styles.tagline}>عيادتك في جيبك</Text>
      </View>
      <Image
        style={[styles.pattern, { width: screenWidth, height: screenWidth / PATTERN_ASPECT_RATIO }]}
        source={require('@/assets/images/splash-pattern.png')}
        contentFit="contain"
      />
    </>
  );

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.splashOverlay}
    >
      {content}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={styles.splashOverlay}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    paddingBottom: '20%',
  },
  logo: {
    width: 110,
    height: 110,
  },
  title: {
    marginTop: 16,
    fontFamily: 'app-font-bold',
    fontSize: 26,
    color: '#0F172A',
  },
  tagline: {
    marginTop: 6,
    fontFamily: 'app-font-regular',
    fontSize: 14,
    color: '#64748B',
  },
  pattern: {
    position: 'absolute',
    bottom: 0,
  },
});
