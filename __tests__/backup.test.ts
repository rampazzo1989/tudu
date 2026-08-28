jest.mock('react-dom', () => ({}), { virtual: true });

jest.mock('../src/i18n', () => ({
  t: (key: string, options?: any) => options?.defaultValue || key,
}));

jest.mock('recoil-nexus', () => ({
  setRecoil: jest.fn(),
  getRecoil: jest.fn(),
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

import {
  generateBackupFilename,
  getBackupPreview,
  parseAndValidateBackupPayload,
  serializeBackupPayload,
  serializeBackupToJson,
} from '../src/service/backup/backupSerializer';
import { restoreStateFromPayload } from '../src/service/backup/restoreService';
import { List, TuduItem } from '../src/scenes/home/types';
import { setRecoil } from 'recoil-nexus';

describe('Backup Serializer and Validator Tests', () => {
  const sampleLists = new Map<string, List>([
    ['list1', { id: 'list1', label: 'Projetos', color: '#ff0000' }],
    ['list2', { id: 'list2', label: 'Mercado', groupName: 'Pessoal' }],
  ]);

  const sampleArchivedLists = new Map<string, List>([
    ['arch1', { id: 'arch1', label: 'Lista Antiga' }],
  ]);

  const sampleTudus = new Map<string, Map<string, TuduItem>>([
    [
      'list1',
      new Map<string, TuduItem>([
        [
          'tudu1',
          {
            id: 'tudu1',
            label: 'Comprar pão',
            done: false,
            dueDate: new Date('2026-08-22T10:00:00.000Z'),
            hasTime: true,
            starred: true,
            recurrence: 'daily',
          },
        ],
        [
          'tudu2',
          {
            id: 'tudu2',
            label: 'Lavar o carro',
            done: true,
          },
        ],
      ]),
    ],
  ]);

  const sampleArchivedTudus = new Map<string, Map<string, TuduItem>>([
    [
      'list1',
      new Map<string, TuduItem>([
        ['tuduArch', { id: 'tuduArch', label: 'Feito ano passado', done: true }],
      ]),
    ],
  ]);

  const sampleUnlistedTudus = new Map<string, TuduItem>([
    [
      'unlisted1',
      {
        id: 'unlisted1',
        label: 'Nota rápida',
        done: false,
      },
    ],
  ]);

  const sampleCounters = new Map([
    ['c1', { id: 'c1', title: 'Água', value: 4, pace: 1 }],
  ]);

  const sampleEmojiUsage = new Map([
    ['🚀', 10],
    ['🍎', 5],
  ]);

  it('should serialize app state into a valid backup payload', () => {
    const payload = serializeBackupPayload({
      myLists: sampleLists,
      archivedLists: sampleArchivedLists,
      tudus: sampleTudus,
      archivedTudus: sampleArchivedTudus,
      unlistedTudus: sampleUnlistedTudus,
      counters: sampleCounters,
      emojiUsage: sampleEmojiUsage,
      showOutdatedTudus: true,
      notificationSettings: {
        timedNotificationsEnabled: true,
        dailyDigestEnabled: true,
        dailyDigestHour: 9,
        dailyDigestMinute: 0,
      },
      aiSettings: {
        provider: 'gemini',
        aiEmojiSuggestionsEnabled: true,
        hasApiKey: true,
      },
    });

    expect(payload.metadata.version).toBe(1);
    expect(payload.metadata.appName).toBe('Tudu');
    expect(payload.metadata.summary.listsCount).toBe(2);
    expect(payload.metadata.summary.tudusCount).toBe(3); // 2 in list1 + 1 in unlisted
    expect(payload.metadata.summary.countersCount).toBe(1);
    expect(payload.metadata.summary.archivedListsCount).toBe(1);
    expect(payload.metadata.summary.archivedTudusCount).toBe(1);

    expect(payload.data.myLists.length).toBe(2);
    expect(payload.data.tudus.length).toBe(1);
    expect(payload.data.unlistedTudus.length).toBe(1);
    expect(payload.data.counters.length).toBe(1);
    expect(payload.data.settings?.showOutdatedTudus).toBe(true);
    expect(payload.data.settings?.notificationSettings?.dailyDigestHour).toBe(9);
  });

  it('should serialize full settings including security, AI token usage, and backup preferences', () => {
    const payload = serializeBackupPayload({
      myLists: sampleLists,
      archivedLists: sampleArchivedLists,
      tudus: sampleTudus,
      archivedTudus: sampleArchivedTudus,
      unlistedTudus: sampleUnlistedTudus,
      counters: sampleCounters,
      emojiUsage: sampleEmojiUsage,
      includeSettings: true,
      showOutdatedTudus: true,
      hasSeenOnboarding: true,
      notificationSettings: {
        timedNotificationsEnabled: true,
        dailyDigestEnabled: true,
        dailyDigestHour: 8,
        dailyDigestMinute: 30,
        notificationSound: 'gentle_bell',
      },
      aiSettings: {
        provider: 'openai',
        aiEmojiSuggestionsEnabled: true,
        hasApiKey: true,
      },
      aiTokenUsage: {
        records: [
          {
            id: 'rec1',
            timestamp: 1724000000000,
            provider: 'openai',
            feature: 'emoji',
            promptTokens: 100,
            completionTokens: 20,
            totalTokens: 120,
          },
        ],
        lastResetAt: '2026-08-01T00:00:00.000Z',
      },
      securitySettings: {
        isLockEnabled: true,
        pinHash: 'hashedpin123',
        pinSalt: 'randomsalt456',
        isBiometricsEnabled: true,
        lockTimeout: '5m',
        failedAttempts: 2,
        lockoutUntil: 1724000030000,
      },
      backupSettings: {
        googleUser: null,
        lastCloudBackupDate: null,
        lastLocalBackupDate: null,
        autoBackupEnabled: true,
        autoBackupFrequency: 'weekly',
        reminderEnabled: true,
        reminderIntervalDays: 15,
        lastReminderDismissedDate: null,
        includeSettingsInBackup: true,
      },
    });

    expect(payload.data.settings).toBeDefined();
    expect(payload.data.settings?.hasSeenOnboarding).toBe(true);
    expect(payload.data.settings?.aiSettings?.provider).toBe('openai');
    expect(payload.data.settings?.aiTokenUsage?.records.length).toBe(1);
    expect(payload.data.settings?.aiTokenUsage?.records[0].totalTokens).toBe(120);
    expect(payload.data.settings?.securitySettings?.isLockEnabled).toBe(true);
    expect(payload.data.settings?.securitySettings?.pinHash).toBe('hashedpin123');
    expect(payload.data.settings?.securitySettings?.lockTimeout).toBe('5m');
    // Transient lockout state should not be serialized
    expect((payload.data.settings?.securitySettings as any)?.failedAttempts).toBeUndefined();
    expect(payload.data.settings?.backupPreferences?.autoBackupFrequency).toBe('weekly');
  });

  it('should exclude settings when includeSettings is false', () => {
    const payload = serializeBackupPayload({
      myLists: sampleLists,
      archivedLists: sampleArchivedLists,
      tudus: sampleTudus,
      archivedTudus: sampleArchivedTudus,
      unlistedTudus: sampleUnlistedTudus,
      counters: sampleCounters,
      emojiUsage: sampleEmojiUsage,
      includeSettings: false,
      showOutdatedTudus: true,
      notificationSettings: {
        timedNotificationsEnabled: true,
        dailyDigestEnabled: true,
        dailyDigestHour: 9,
        dailyDigestMinute: 0,
      },
    });

    expect(payload.data.settings).toBeUndefined();
    const preview = getBackupPreview(payload, 'local_file');
    expect(preview.hasSettings).toBe(false);
  });

  it('should generate formatted backup JSON string and parse it back', () => {
    const json = serializeBackupToJson({
      myLists: sampleLists,
      archivedLists: sampleArchivedLists,
      tudus: sampleTudus,
      archivedTudus: sampleArchivedTudus,
      unlistedTudus: sampleUnlistedTudus,
      counters: sampleCounters,
      emojiUsage: sampleEmojiUsage,
    });

    expect(typeof json).toBe('string');

    const parsed = parseAndValidateBackupPayload(json);
    expect(parsed.metadata.version).toBe(1);
    expect(parsed.data.myLists[0][1].label).toBe('Projetos');
  });

  it('should reject invalid or corrupted backup JSON', () => {
    expect(() => parseAndValidateBackupPayload('not a json')).toThrow(
      'Formato JSON inválido no arquivo de backup.',
    );

    expect(() => parseAndValidateBackupPayload('{}')).toThrow(
      'Metadados do backup ausentes.',
    );

    expect(() =>
      parseAndValidateBackupPayload(
        JSON.stringify({ metadata: { version: 999 }, data: {} }),
      ),
    ).toThrow('Versão do backup incompatível');

    expect(() =>
      parseAndValidateBackupPayload(
        JSON.stringify({ metadata: { version: 1 }, data: { myLists: 'invalid' } }),
      ),
    ).toThrow('Estrutura de listas ou tarefas corrompida');
  });

  it('should extract correct backup preview info', () => {
    const payload = serializeBackupPayload({
      myLists: sampleLists,
      archivedLists: sampleArchivedLists,
      tudus: sampleTudus,
      archivedTudus: sampleArchivedTudus,
      unlistedTudus: sampleUnlistedTudus,
      counters: sampleCounters,
      emojiUsage: sampleEmojiUsage,
      includeSettings: true,
      showOutdatedTudus: true,
    });

    const preview = getBackupPreview(payload, 'google_drive');
    expect(preview.source).toBe('google_drive');
    expect(preview.listsCount).toBe(2);
    expect(preview.tudusCount).toBe(3);
    expect(preview.countersCount).toBe(1);
    expect(preview.archivedCount).toBe(2); // 1 list + 1 tudu
    expect(preview.createdAt).toBeInstanceOf(Date);
    expect(preview.hasSettings).toBe(true);
  });

  it('should restore state from payload and revive dates and settings correctly', async () => {
    const payload = serializeBackupPayload({
      myLists: sampleLists,
      archivedLists: sampleArchivedLists,
      tudus: sampleTudus,
      archivedTudus: sampleArchivedTudus,
      unlistedTudus: sampleUnlistedTudus,
      counters: sampleCounters,
      emojiUsage: sampleEmojiUsage,
      includeSettings: true,
      showOutdatedTudus: true,
      hasSeenOnboarding: true,
      notificationSettings: {
        timedNotificationsEnabled: false,
        dailyDigestEnabled: true,
        dailyDigestHour: 7,
        dailyDigestMinute: 15,
      },
      aiSettings: {
        provider: 'claude',
        aiEmojiSuggestionsEnabled: true,
        hasApiKey: false,
      },
      aiTokenUsage: {
        records: [
          {
            id: 't1',
            timestamp: 1724000000000,
            provider: 'claude',
            feature: 'parse_list',
            promptTokens: 50,
            completionTokens: 50,
            totalTokens: 100,
          },
        ],
        lastResetAt: null,
      },
      securitySettings: {
        isLockEnabled: true,
        pinHash: 'hash999',
        pinSalt: 'salt999',
        isBiometricsEnabled: false,
        lockTimeout: 'immediate',
        failedAttempts: 0,
        lockoutUntil: null,
      },
    });

    const result = await restoreStateFromPayload(payload);
    expect(result.success).toBe(true);
    expect(result.listsRestored).toBe(2);
    expect(result.tudusRestored).toBe(3);
    expect(result.countersRestored).toBe(1);
    expect(result.settingsRestored).toBe(true);
    expect(setRecoil).toHaveBeenCalled();
  });

  it('should generate formatted backup filename with timestamp', () => {
    const testDate = new Date(2026, 7, 21, 14, 30, 0);
    const filename = generateBackupFilename(testDate);
    expect(filename).toBe('tudu-backup-2026-08-21-143000.json');
  });
});
