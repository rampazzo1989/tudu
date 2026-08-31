import { NativeModules, Platform, AppState, AppStateStatus } from 'react-native';
import { useState, useEffect, useCallback } from 'react';

const { FullScreenIntentModule } = NativeModules;

/**
 * Checks if the app has permission to use full-screen intents.
 * Returns true on iOS or Android < 14 (where the permission is always granted).
 * On Android 14+, checks via the native NotificationManager API.
 */
export async function checkFullScreenIntentPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  if (!FullScreenIntentModule) {
    // Native module not available — assume granted (older build)
    console.warn(
      '[FullScreenIntent] Native module not available, assuming permission granted',
    );
    return true;
  }

  try {
    return await FullScreenIntentModule.canUseFullScreenIntent();
  } catch (err) {
    console.warn('[FullScreenIntent] Error checking permission:', err);
    return true;
  }
}

/**
 * Opens the system settings page for the full-screen intent permission.
 * On Android 14+, opens the specific FSI settings page.
 * On older Android or iOS, this is a no-op.
 */
export function openFullScreenIntentSettings(): void {
  if (Platform.OS !== 'android' || !FullScreenIntentModule) {
    return;
  }

  try {
    FullScreenIntentModule.openFullScreenIntentSettings();
  } catch (err) {
    console.warn('[FullScreenIntent] Error opening settings:', err);
  }
}

/**
 * React hook that tracks full-screen intent permission status.
 * Re-checks when the app returns to foreground (e.g. after user visits settings).
 */
export function useFullScreenIntentPermission() {
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const recheckPermission = useCallback(async () => {
    setIsChecking(true);
    try {
      const result = await checkFullScreenIntentPermission();
      setHasPermission(result);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Initial check
  useEffect(() => {
    recheckPermission();
  }, [recheckPermission]);

  // Re-check when app returns to foreground (user may have changed settings)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        recheckPermission();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [recheckPermission]);

  return { hasPermission, isChecking, recheckPermission };
}
