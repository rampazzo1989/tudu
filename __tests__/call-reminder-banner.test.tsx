jest.mock('react-dom', () => ({}), { virtual: true });

jest.mock('../src/i18n', () => ({
  t: (key: string, options?: any) => options?.defaultValue || key,
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
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
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
import Toast from 'react-native-toast-message';
import { useCallReminderBanner } from '../src/service/notification/hooks/useCallReminderBanner';
import { notificationSettingsState } from '../src/state/atoms';
import { tudus, unlistedTudus } from '../src/scenes/home/state';
import { TuduItem } from '../src/scenes/home/types';

describe('useCallReminderBanner', () => {
  let hookResult!: ReturnType<typeof useCallReminderBanner>;

  const Consumer: React.FC = () => {
    hookResult = useCallReminderBanner();
    return null;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.clear();
  });

  it('should not show banner when user has no timed tasks and has not scheduled any', () => {
    act(() => {
      TestRenderer.create(
        <RecoilRoot
          initializeState={({ set }) => {
            set(notificationSettingsState, {
              timedNotificationsEnabled: true,
              dailyDigestEnabled: true,
              dailyDigestHour: 8,
              dailyDigestMinute: 30,
              callRemindersEnabled: false,
              callReminderSuggestionDismissed: false,
              hasScheduledWithTime: false,
            });
            set(tudus, new Map());
            set(unlistedTudus, new Map());
          }}>
          <Consumer />
        </RecoilRoot>,
      );
    });

    expect(hookResult.shouldShow).toBe(false);
  });

  it('should show banner when user has scheduled a timed task and call reminders are disabled', () => {
    act(() => {
      TestRenderer.create(
        <RecoilRoot
          initializeState={({ set }) => {
            set(notificationSettingsState, {
              timedNotificationsEnabled: true,
              dailyDigestEnabled: true,
              dailyDigestHour: 8,
              dailyDigestMinute: 30,
              callRemindersEnabled: false,
              callReminderSuggestionDismissed: false,
              hasScheduledWithTime: true,
            });
            set(tudus, new Map());
            set(unlistedTudus, new Map());
          }}>
          <Consumer />
        </RecoilRoot>,
      );
    });

    expect(hookResult.shouldShow).toBe(true);
  });

  it('should show banner when user has an active tudu with time in custom list', () => {
    const sampleTudu: TuduItem = {
      id: 't-1',
      label: 'Dentista às 14h',
      done: false,
      hasTime: true,
      dueDate: new Date(),
    };

    act(() => {
      TestRenderer.create(
        <RecoilRoot
          initializeState={({ set }) => {
            set(notificationSettingsState, {
              timedNotificationsEnabled: true,
              dailyDigestEnabled: true,
              dailyDigestHour: 8,
              dailyDigestMinute: 30,
              callRemindersEnabled: false,
              callReminderSuggestionDismissed: false,
              hasScheduledWithTime: false,
            });
            set(
              tudus,
              new Map([['list-1', new Map([['t-1', sampleTudu]])]]),
            );
            set(unlistedTudus, new Map());
          }}>
          <Consumer />
        </RecoilRoot>,
      );
    });

    expect(hookResult.shouldShow).toBe(true);
  });

  it('should not show banner if callRemindersEnabled is already true', () => {
    act(() => {
      TestRenderer.create(
        <RecoilRoot
          initializeState={({ set }) => {
            set(notificationSettingsState, {
              timedNotificationsEnabled: true,
              dailyDigestEnabled: true,
              dailyDigestHour: 8,
              dailyDigestMinute: 30,
              callRemindersEnabled: true,
              callReminderSuggestionDismissed: false,
              hasScheduledWithTime: true,
            });
            set(tudus, new Map());
            set(unlistedTudus, new Map());
          }}>
          <Consumer />
        </RecoilRoot>,
      );
    });

    expect(hookResult.shouldShow).toBe(false);
  });

  it('should not show banner if callReminderSuggestionDismissed is true', () => {
    act(() => {
      TestRenderer.create(
        <RecoilRoot
          initializeState={({ set }) => {
            set(notificationSettingsState, {
              timedNotificationsEnabled: true,
              dailyDigestEnabled: true,
              dailyDigestHour: 8,
              dailyDigestMinute: 30,
              callRemindersEnabled: false,
              callReminderSuggestionDismissed: true,
              hasScheduledWithTime: true,
            });
            set(tudus, new Map());
            set(unlistedTudus, new Map());
          }}>
          <Consumer />
        </RecoilRoot>,
      );
    });

    expect(hookResult.shouldShow).toBe(false);
  });

  it('should dismiss banner and update state when dismissBanner is called', () => {
    act(() => {
      TestRenderer.create(
        <RecoilRoot
          initializeState={({ set }) => {
            set(notificationSettingsState, {
              timedNotificationsEnabled: true,
              dailyDigestEnabled: true,
              dailyDigestHour: 8,
              dailyDigestMinute: 30,
              callRemindersEnabled: false,
              callReminderSuggestionDismissed: false,
              hasScheduledWithTime: true,
            });
            set(tudus, new Map());
            set(unlistedTudus, new Map());
          }}>
          <Consumer />
        </RecoilRoot>,
      );
    });

    expect(hookResult.shouldShow).toBe(true);

    act(() => {
      hookResult.dismissBanner();
    });

    expect(hookResult.shouldShow).toBe(false);
  });

  it('should enable call reminders, show toast and hide banner when enableCallReminders is called', async () => {
    act(() => {
      TestRenderer.create(
        <RecoilRoot
          initializeState={({ set }) => {
            set(notificationSettingsState, {
              timedNotificationsEnabled: true,
              dailyDigestEnabled: true,
              dailyDigestHour: 8,
              dailyDigestMinute: 30,
              callRemindersEnabled: false,
              callReminderSuggestionDismissed: false,
              hasScheduledWithTime: true,
            });
            set(tudus, new Map());
            set(unlistedTudus, new Map());
          }}>
          <Consumer />
        </RecoilRoot>,
      );
    });

    expect(hookResult.shouldShow).toBe(true);

    await act(async () => {
      await hookResult.enableCallReminders();
    });

    expect(hookResult.shouldShow).toBe(false);
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
      }),
    );
  });
});
