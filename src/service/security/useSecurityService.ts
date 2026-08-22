import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  appLockSessionState,
  LockTimeoutOption,
  securitySettingsState,
} from '../../state/atoms';
import {
  authenticateWithBiometrics,
  checkBiometricsAvailability,
} from './biometrics';
import { generateSalt, hashPin, verifyPin } from './crypto';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds

export function useSecurityService() {
  const [settings, setSettings] = useRecoilState(securitySettingsState);
  const [session, setSession] = useRecoilState(appLockSessionState);
  const [sensorInfo, setSensorInfo] = useState<{
    available: boolean;
    biometryType: 'TouchID' | 'FaceID' | 'Biometrics' | null;
  }>({
    available: false,
    biometryType: null,
  });

  const refreshSensorInfo = useCallback(async () => {
    const info = await checkBiometricsAvailability();
    setSensorInfo(info);
    return info;
  }, []);

  useEffect(() => {
    refreshSensorInfo();
  }, [refreshSensorInfo]);

  const isLockedOut = useCallback(() => {
    if (!settings.lockoutUntil) {
      return false;
    }
    const now = Date.now();
    if (now < settings.lockoutUntil) {
      return true;
    }
    // Lockout expired, reset lockoutUntil
    setSettings(prev => ({
      ...prev,
      lockoutUntil: null,
      failedAttempts: 0,
    }));
    return false;
  }, [settings.lockoutUntil, setSettings]);

  const getRemainingLockoutSeconds = useCallback(() => {
    if (!settings.lockoutUntil) {
      return 0;
    }
    const remaining = Math.ceil((settings.lockoutUntil - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  }, [settings.lockoutUntil]);

  const setupPin = useCallback(
    (pin: string, enableBiometrics?: boolean) => {
      const salt = generateSalt();
      const hash = hashPin(pin, salt);

      setSettings(prev => ({
        ...prev,
        isLockEnabled: true,
        pinHash: hash,
        pinSalt: salt,
        isBiometricsEnabled:
          enableBiometrics !== undefined
            ? enableBiometrics
            : prev.isBiometricsEnabled,
        failedAttempts: 0,
        lockoutUntil: null,
      }));

      setSession(prev => ({
        ...prev,
        isAppLocked: false,
      }));

      return true;
    },
    [setSettings, setSession],
  );

  const changePin = useCallback(
    (currentPin: string, newPin: string): boolean => {
      const isValid = verifyPin(
        currentPin,
        settings.pinHash,
        settings.pinSalt,
      );
      if (!isValid) {
        return false;
      }

      const newSalt = generateSalt();
      const newHash = hashPin(newPin, newSalt);

      setSettings(prev => ({
        ...prev,
        pinHash: newHash,
        pinSalt: newSalt,
        failedAttempts: 0,
        lockoutUntil: null,
      }));

      return true;
    },
    [settings.pinHash, settings.pinSalt, setSettings],
  );

  const disableLock = useCallback(
    (currentPin: string): boolean => {
      const isValid = verifyPin(
        currentPin,
        settings.pinHash,
        settings.pinSalt,
      );
      if (!isValid) {
        return false;
      }

      setSettings(prev => ({
        ...prev,
        isLockEnabled: false,
        pinHash: null,
        pinSalt: null,
        isBiometricsEnabled: false,
        failedAttempts: 0,
        lockoutUntil: null,
      }));

      setSession(prev => ({
        ...prev,
        isAppLocked: false,
      }));

      return true;
    },
    [settings.pinHash, settings.pinSalt, setSettings, setSession],
  );

  const toggleBiometrics = useCallback(
    (enabled: boolean) => {
      setSettings(prev => ({
        ...prev,
        isBiometricsEnabled: enabled,
      }));
    },
    [setSettings],
  );

  const setLockTimeout = useCallback(
    (timeout: LockTimeoutOption) => {
      setSettings(prev => ({
        ...prev,
        lockTimeout: timeout,
      }));
    },
    [setSettings],
  );

  const validateCurrentPin = useCallback(
    (pin: string): boolean => {
      return verifyPin(pin, settings.pinHash, settings.pinSalt);
    },
    [settings.pinHash, settings.pinSalt],
  );

  const unlockWithPin = useCallback(
    (pin: string): { success: boolean; isLockedOut: boolean } => {
      if (isLockedOut()) {
        return { success: false, isLockedOut: true };
      }

      const isValid = verifyPin(pin, settings.pinHash, settings.pinSalt);

      if (isValid) {
        setSettings(prev => ({
          ...prev,
          failedAttempts: 0,
          lockoutUntil: null,
        }));
        setSession(prev => ({
          ...prev,
          isAppLocked: false,
        }));
        return { success: true, isLockedOut: false };
      }

      const newFailedAttempts = settings.failedAttempts + 1;
      const shouldLockout = newFailedAttempts >= MAX_FAILED_ATTEMPTS;
      const lockoutTimestamp = shouldLockout
        ? Date.now() + LOCKOUT_DURATION_MS
        : null;

      setSettings(prev => ({
        ...prev,
        failedAttempts: newFailedAttempts,
        lockoutUntil: lockoutTimestamp,
      }));

      return { success: false, isLockedOut: shouldLockout };
    },
    [isLockedOut, settings.failedAttempts, settings.pinHash, settings.pinSalt, setSettings, setSession],
  );

  const unlockWithBiometrics = useCallback(
    async (
      promptMessage?: string,
      cancelButtonText?: string,
    ): Promise<boolean> => {
      if (!settings.isLockEnabled || !settings.isBiometricsEnabled) {
        return false;
      }
      if (isLockedOut()) {
        return false;
      }

      const result = await authenticateWithBiometrics(
        promptMessage,
        cancelButtonText,
      );

      if (result.success) {
        setSettings(prev => ({
          ...prev,
          failedAttempts: 0,
          lockoutUntil: null,
        }));
        setSession(prev => ({
          ...prev,
          isAppLocked: false,
        }));
        return true;
      }

      return false;
    },
    [isLockedOut, settings.isBiometricsEnabled, settings.isLockEnabled, setSettings, setSession],
  );

  const lockApp = useCallback(() => {
    if (settings.isLockEnabled) {
      setSession(prev => ({
        ...prev,
        isAppLocked: true,
      }));
    }
  }, [settings.isLockEnabled, setSession]);

  return {
    settings,
    session,
    sensorInfo,
    refreshSensorInfo,
    isLockedOut,
    getRemainingLockoutSeconds,
    setupPin,
    changePin,
    disableLock,
    toggleBiometrics,
    setLockTimeout,
    validateCurrentPin,
    unlockWithPin,
    unlockWithBiometrics,
    lockApp,
  };
}
