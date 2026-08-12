import { createMMKV } from 'react-native-mmkv';

// Initialize the instance
export const storage = createMMKV();

/**
 * Save a value to storage
 */
export const setItem = (key: string, value: string | number | boolean): void => {
  storage.set(key, value);
};

/**
 * Get a string value
 */
export const getString = (key: string): string | undefined => {
  return storage.getString(key);
};

/**
 * Get a boolean value
 */
export const getBoolean = (key: string): boolean => {
  return storage.getBoolean(key) ?? false;
};

/**
 * Delete a specific key
 */
export const removeItem = (key: string): void => {
  storage.remove(key);
};
