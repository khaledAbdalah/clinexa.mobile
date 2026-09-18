import { Linking } from 'react-native';

/**
 * Opens an external URL in the device browser.
 *
 * Returns `false` when the URL is missing or cannot be opened, so callers can surface
 * the failure rather than leaving a tap looking unresponsive.
 */
export async function openExternalUrl(url: string): Promise<boolean> {
  if (!url) return false;

  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
