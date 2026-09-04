import { NativeModules, Platform } from 'react-native';

const getModule = () => NativeModules.FullScreenIntentModule;

/**
 * Checks whether the Android device is currently locked (keyguard active).
 * On iOS, returns false as iOS already handles authentication at OS level before rendering apps.
 */
export async function isDeviceLocked(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }
  const mod = getModule();
  if (!mod?.isDeviceLocked) {
    return false;
  }
  try {
    return await mod.isDeviceLocked();
  } catch (err) {
    console.warn('[DeviceLock] Error checking if device is locked:', err);
    return false;
  }
}

/**
 * Requests the Android OS to dismiss the keyguard by prompting the user for PIN, pattern,
 * password, or biometric authentication.
 * 
 * Returns `true` if unlocked successfully (or already unlocked), `false` if cancelled or failed.
 * On iOS, always returns `true`.
 */
export async function requestDismissKeyguard(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  const mod = getModule();
  if (!mod?.requestDismissKeyguard) {
    return true;
  }
  try {
    return await mod.requestDismissKeyguard();
  } catch (err) {
    console.warn('[DeviceLock] Error requesting dismiss keyguard:', err);
    return false;
  }
}

/**
 * Dynamically enables or disables `showWhenLocked` and `turnScreenOn` on the current Activity.
 */
export async function setShowWhenLocked(show: boolean): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  const mod = getModule();
  if (!mod?.setShowWhenLocked) {
    return true;
  }
  try {
    return await mod.setShowWhenLocked(show);
  } catch (err) {
    console.warn('[DeviceLock] Error setting showWhenLocked:', err);
    return false;
  }
}

/**
 * Disables `showWhenLocked` and moves the application task to background (`moveTaskToBack`),
 * causing the device to return to its native lock screen without exposing app content.
 */
export async function dismissToLockScreen(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }
  const mod = getModule();
  if (!mod?.dismissToLockScreen) {
    return false;
  }
  try {
    return await mod.dismissToLockScreen();
  } catch (err) {
    console.warn('[DeviceLock] Error dismissing to lock screen:', err);
    return false;
  }
}
