import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';

/**
 * Generates a v4-like UUID using Math.random (no external dependency needed).
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Returns a stable device ID that is created once and persisted in AsyncStorage.
 * Subsequent calls always return the same ID for this installation.
 * Bug #5 fix: replaces the hardcoded 'placeholder-device-id'.
 */
export async function getOrCreateDeviceId(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    if (stored) {
      return stored;
    }
    const newId = generateUUID();
    await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, newId);
    return newId;
  } catch {
    // If AsyncStorage is unavailable, return a one-time ID so the app still works.
    return generateUUID();
  }
}
