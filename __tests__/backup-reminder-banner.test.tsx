jest.mock('react-dom', () => ({}), { virtual: true });

jest.mock('../src/i18n', () => ({
  t: (key: string, options?: any) => options?.defaultValue || key,
}));

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (comp: any) => comp,
    },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn(val => val),
    withTiming: jest.fn(val => val),
    runOnJS: jest.fn(fn => fn),
  };
});

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

jest.mock('@notifee/react-native', () => ({
  createChannel: jest.fn(),
  createTriggerNotification: jest.fn(),
  cancelNotification: jest.fn(),
  getTriggerNotificationIds: jest.fn().mockResolvedValue([]),
  displayNotification: jest.fn(),
  requestPermission: jest.fn().mockResolvedValue({ authorizationStatus: 1 }),
  getNotificationSettings: jest.fn().mockResolvedValue({ authorizationStatus: 1 }),
  AndroidImportance: { HIGH: 4, DEFAULT: 3 },
  AndroidVisibility: { PUBLIC: 1 },
  AuthorizationStatus: { AUTHORIZED: 1, PROVISIONAL: 2, DENIED: 0 },
  TriggerType: { TIMESTAMP: 0 },
  AlarmType: {
    SET_EXACT: 0,
    SET_EXACT_AND_ALLOW_WHILE_IDLE: 1,
    SET: 2,
    SET_AND_ALLOW_WHILE_IDLE: 3,
    SET_ALARM_CLOCK: 4,
  },
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

jest.mock('react-native-blob-util', () => ({
  fs: {
    dirs: {
      CacheDir: '/mock/cache',
    },
    writeFile: jest.fn(),
    readFile: jest.fn(),
    cp: jest.fn(),
    unlink: jest.fn(),
  },
}));
jest.mock('react-native-share', () => ({
  open: jest.fn(),
}));
jest.mock('react-native-document-picker', () => ({
  pickSingle: jest.fn(),
  types: { allFiles: '*/*' },
  isCancel: jest.fn(),
}));

const mockSignInWithGoogle = jest.fn();
jest.mock('../src/service/backup/googleAuthService', () => ({
  signInWithGoogle: () => mockSignInWithGoogle(),
  signInSilentlyWithGoogle: jest.fn().mockResolvedValue(null),
  signOutFromGoogle: jest.fn(),
}));

const mockUploadGoogleDriveBackup = jest.fn();
jest.mock('../src/service/backup/googleDriveService', () => ({
  uploadGoogleDriveBackup: () => mockUploadGoogleDriveBackup(),
  downloadGoogleDriveBackupContent: jest.fn(),
  getLatestGoogleDriveBackup: jest.fn(),
}));

const mockStorage = new Map<string, any>();
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    clearAll: () => mockStorage.clear(),
    delete: (key: string) => mockStorage.delete(key),
    set: (key: string, value: any) => mockStorage.set(key, value),
    getString: (key: string) => {
      const result = mockStorage.get(key);
      return typeof result === 'string' ? result : undefined;
    },
    getNumber: (key: string) => {
      const result = mockStorage.get(key);
      return typeof result === 'number' ? result : undefined;
    },
    getBoolean: (key: string) => {
      const result = mockStorage.get(key);
      return typeof result === 'boolean' ? result : undefined;
    },
    contains: (key: string) => mockStorage.has(key),
    getAllKeys: () => Array.from(mockStorage.keys()),
  })),
}));

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components/native';
import { darkTheme } from '../src/themes/dark';
import Toast from 'react-native-toast-message';
import { BackupReminderBanner } from '../src/components/backup-reminder-banner';
import { backupSettingsState } from '../src/state/atoms';
import { myLists, tudus } from '../src/scenes/home/state';
import { PrimaryAction } from '../src/components/backup-reminder-banner/styles';

describe('BackupReminderBanner', () => {
  const onNavigateToBackupSettings = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.clear();
  });

  it('should connect to Google and navigate to BackupSettings without creating a backup automatically', async () => {
    const fakeUser = {
      id: 'google-123',
      email: 'test@gmail.com',
      name: 'Test User',
    };
    mockSignInWithGoogle.mockResolvedValue(fakeUser);

    let testRenderer!: TestRenderer.ReactTestRenderer;

    await act(async () => {
      testRenderer = TestRenderer.create(
        <RecoilRoot
          initializeState={({ set }) => {
            set(backupSettingsState, {
              googleUser: null,
              lastCloudBackupDate: null,
              lastLocalBackupDate: null,
              autoBackupEnabled: false,
              autoBackupFrequency: 'daily',
              reminderEnabled: true,
              reminderIntervalDays: 7,
              lastReminderDismissedDate: null,
              lastAutoBackupError: null,
              includeSettingsInBackup: true,
            });
            set(
              myLists,
              new Map([['list-1', { id: 'list-1', label: 'Minha Lista' }]]),
            );
            set(tudus, new Map());
          }}>
          <ThemeProvider theme={darkTheme}>
            <BackupReminderBanner onNavigateToBackupSettings={onNavigateToBackupSettings} />
          </ThemeProvider>
        </RecoilRoot>,
      );
    });

    const primaryButton = testRenderer.root.findByType(PrimaryAction);
    expect(primaryButton).toBeTruthy();

    await act(async () => {
      primaryButton.props.onPress();
    });

    expect(mockSignInWithGoogle).toHaveBeenCalled();
    expect(mockUploadGoogleDriveBackup).not.toHaveBeenCalled();
    expect(onNavigateToBackupSettings).toHaveBeenCalled();
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
      }),
    );
  });

  it('should navigate directly to BackupSettings when user is already connected', async () => {
    const fakeUser = {
      id: 'google-123',
      email: 'test@gmail.com',
      name: 'Test User',
    };

    let testRenderer!: TestRenderer.ReactTestRenderer;

    await act(async () => {
      testRenderer = TestRenderer.create(
        <RecoilRoot
          initializeState={({ set }) => {
            const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
            set(backupSettingsState, {
              googleUser: fakeUser,
              lastCloudBackupDate: tenDaysAgo,
              lastLocalBackupDate: null,
              autoBackupEnabled: false,
              autoBackupFrequency: 'daily',
              reminderEnabled: true,
              reminderIntervalDays: 7,
              lastReminderDismissedDate: null,
              lastAutoBackupError: null,
              includeSettingsInBackup: true,
            });
            set(
              myLists,
              new Map([['list-1', { id: 'list-1', label: 'Minha Lista' }]]),
            );
            set(tudus, new Map());
          }}>
          <ThemeProvider theme={darkTheme}>
            <BackupReminderBanner onNavigateToBackupSettings={onNavigateToBackupSettings} />
          </ThemeProvider>
        </RecoilRoot>,
      );
    });

    const primaryButton = testRenderer.root.findByType(PrimaryAction);
    expect(primaryButton).toBeTruthy();

    await act(async () => {
      primaryButton.props.onPress();
    });

    expect(mockSignInWithGoogle).not.toHaveBeenCalled();
    expect(mockUploadGoogleDriveBackup).not.toHaveBeenCalled();
    expect(onNavigateToBackupSettings).toHaveBeenCalled();
  });
});
