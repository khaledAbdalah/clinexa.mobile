import { Platform } from 'react-native';
import Constants from 'expo-constants';

/** From app.json's `expo.version`. */
export const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export const IsIOS = Platform.OS === 'ios';
