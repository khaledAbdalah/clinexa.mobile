import { create } from 'zustand';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { getString, setItem, removeItem } from '@/config/storage';
import type { PushTokenState } from '@/types/store.types';

const PUSH_TOKEN_STORAGE_KEY = 'push_token';

export const usePushTokenStore = create<PushTokenState>((set, get) => ({
  token: getString(PUSH_TOKEN_STORAGE_KEY) ?? null,

  register: async () => {
    if (!Device.isDevice) return;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      const finalStatus =
        existingStatus === 'granted'
          ? existingStatus
          : (await Notifications.requestPermissionsAsync()).status;

      if (finalStatus !== 'granted') return;

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) return;

      const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
      if (get().token === token) return;

      await api.post(endpoints.account.pushTokens, {
        token,
        platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      });

      setItem(PUSH_TOKEN_STORAGE_KEY, token);
      set({ token });
    } catch (error) {
      console.error('Failed to register push token:', error);
    }
  },

  unregister: async () => {
    const token = get().token;
    if (!token) return;

    try {
      await api.delete(endpoints.account.pushTokens, { data: { token } });
    } catch (error) {
      console.error('Failed to unregister push token:', error);
    } finally {
      removeItem(PUSH_TOKEN_STORAGE_KEY);
      set({ token: null });
    }
  },

  clearLocal: () => {
    removeItem(PUSH_TOKEN_STORAGE_KEY);
    set({ token: null });
  },
}));
