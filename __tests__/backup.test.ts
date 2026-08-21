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
    });

    const preview = getBackupPreview(payload, 'google_drive');
    expect(preview.source).toBe('google_drive');
    expect(preview.listsCount).toBe(2);
    expect(preview.tudusCount).toBe(3);
    expect(preview.countersCount).toBe(1);
    expect(preview.archivedCount).toBe(2); // 1 list + 1 tudu
    expect(preview.createdAt).toBeInstanceOf(Date);
  });

  it('should restore state from payload and revive dates correctly', async () => {
    const payload = serializeBackupPayload({
      myLists: sampleLists,
      archivedLists: sampleArchivedLists,
      tudus: sampleTudus,
      archivedTudus: sampleArchivedTudus,
      unlistedTudus: sampleUnlistedTudus,
      counters: sampleCounters,
      emojiUsage: sampleEmojiUsage,
    });

    const result = await restoreStateFromPayload(payload);
    expect(result.success).toBe(true);
    expect(result.listsRestored).toBe(2);
    expect(result.tudusRestored).toBe(3);
    expect(result.countersRestored).toBe(1);
    expect(setRecoil).toHaveBeenCalled();
  });

  it('should generate formatted backup filename with timestamp', () => {
    const testDate = new Date(2026, 7, 21, 14, 30, 0);
    const filename = generateBackupFilename(testDate);
    expect(filename).toBe('tudu-backup-2026-08-21-143000.json');
  });
});
