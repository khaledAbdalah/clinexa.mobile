import * as SecureStore from 'expo-secure-store';

export const SecureStorage = {
  // Access Token
  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('access_token');
  },

  async setAccessToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('access_token', token);
  },

  // Refresh Token
  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('refresh_token');
  },

  async setRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('refresh_token', token);
  },

  // Clear all tokens
  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
  },
};
