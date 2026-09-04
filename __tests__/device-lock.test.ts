import { NativeModules, Platform } from 'react-native';
import {
  isDeviceLocked,
  requestDismissKeyguard,
  setShowWhenLocked,
  dismissToLockScreen,
} from '../src/service/device-lock/deviceLock';

describe('DeviceLock Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'android';
    NativeModules.FullScreenIntentModule = {
      isDeviceLocked: jest.fn().mockResolvedValue(true),
      requestDismissKeyguard: jest.fn().mockResolvedValue(true),
      setShowWhenLocked: jest.fn().mockResolvedValue(true),
      dismissToLockScreen: jest.fn().mockResolvedValue(true),
    };
  });

  describe('isDeviceLocked', () => {
    it('should return true when device is locked on android', async () => {
      NativeModules.FullScreenIntentModule.isDeviceLocked.mockResolvedValue(true);
      const result = await isDeviceLocked();
      expect(result).toBe(true);
      expect(NativeModules.FullScreenIntentModule.isDeviceLocked).toHaveBeenCalled();
    });

    it('should return false when device is unlocked on android', async () => {
      NativeModules.FullScreenIntentModule.isDeviceLocked.mockResolvedValue(false);
      const result = await isDeviceLocked();
      expect(result).toBe(false);
    });

    it('should return false on iOS', async () => {
      Platform.OS = 'ios';
      const result = await isDeviceLocked();
      expect(result).toBe(false);
      expect(NativeModules.FullScreenIntentModule.isDeviceLocked).not.toHaveBeenCalled();
    });

    it('should handle native errors gracefully by returning false', async () => {
      NativeModules.FullScreenIntentModule.isDeviceLocked.mockRejectedValue(
        new Error('Native error'),
      );
      const result = await isDeviceLocked();
      expect(result).toBe(false);
    });
  });

  describe('requestDismissKeyguard', () => {
    it('should resolve true when dismiss keyguard succeeds', async () => {
      NativeModules.FullScreenIntentModule.requestDismissKeyguard.mockResolvedValue(true);
      const result = await requestDismissKeyguard();
      expect(result).toBe(true);
      expect(NativeModules.FullScreenIntentModule.requestDismissKeyguard).toHaveBeenCalled();
    });

    it('should resolve false when dismiss keyguard is cancelled by user', async () => {
      NativeModules.FullScreenIntentModule.requestDismissKeyguard.mockResolvedValue(false);
      const result = await requestDismissKeyguard();
      expect(result).toBe(false);
    });

    it('should resolve true on iOS without native call', async () => {
      Platform.OS = 'ios';
      const result = await requestDismissKeyguard();
      expect(result).toBe(true);
      expect(NativeModules.FullScreenIntentModule.requestDismissKeyguard).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully by returning false', async () => {
      NativeModules.FullScreenIntentModule.requestDismissKeyguard.mockRejectedValue(
        new Error('Keyguard error'),
      );
      const result = await requestDismissKeyguard();
      expect(result).toBe(false);
    });
  });

  describe('setShowWhenLocked', () => {
    it('should toggle showWhenLocked on android', async () => {
      NativeModules.FullScreenIntentModule.setShowWhenLocked.mockResolvedValue(true);
      const result = await setShowWhenLocked(true);
      expect(result).toBe(true);
      expect(NativeModules.FullScreenIntentModule.setShowWhenLocked).toHaveBeenCalledWith(true);

      await setShowWhenLocked(false);
      expect(NativeModules.FullScreenIntentModule.setShowWhenLocked).toHaveBeenCalledWith(false);
    });

    it('should return true on iOS without native call', async () => {
      Platform.OS = 'ios';
      const result = await setShowWhenLocked(true);
      expect(result).toBe(true);
      expect(NativeModules.FullScreenIntentModule.setShowWhenLocked).not.toHaveBeenCalled();
    });
  });

  describe('dismissToLockScreen', () => {
    it('should call native dismissToLockScreen on android', async () => {
      NativeModules.FullScreenIntentModule.dismissToLockScreen.mockResolvedValue(true);
      const result = await dismissToLockScreen();
      expect(result).toBe(true);
      expect(NativeModules.FullScreenIntentModule.dismissToLockScreen).toHaveBeenCalled();
    });

    it('should return false on iOS', async () => {
      Platform.OS = 'ios';
      const result = await dismissToLockScreen();
      expect(result).toBe(false);
      expect(NativeModules.FullScreenIntentModule.dismissToLockScreen).not.toHaveBeenCalled();
    });
  });
});
