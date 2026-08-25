jest.mock('react-dom', () => ({}), { virtual: true });
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

import { ListViewModel, TuduViewModel } from '../src/scenes/home/types';
import {
  formatListAsText,
  generateTuduFilename,
  getImportListPreview,
  parseAndValidateTuduPayload,
  serializeListToTuduJson,
  serializeListToTuduPayload,
  TUDU_FILE_EXTENSION,
} from '../src/service/list-sharing/listSharingSerializer';

describe('List Sharing Serializer and Validator Tests', () => {
  const sampleList = new ListViewModel(
    {
      id: 'list-123',
      label: 'Compras do Mês 🛒',
      color: '#7956BF',
      groupName: 'Casa',
    },
    undefined,
    'default',
  );

  const sampleTudus = [
    new TuduViewModel(
      {
        id: 'tudu-1',
        label: 'Leite desnatado',
        done: false,
        starred: true,
        dueDate: new Date('2026-08-25T10:00:00.000Z'),
        hasTime: true,
        recurrence: 'weekly',
      },
      'list-123',
      'default',
    ),
    new TuduViewModel(
      {
        id: 'tudu-2',
        label: 'Café',
        done: true,
      },
      'list-123',
      'default',
    ),
    new TuduViewModel(
      {
        id: 'tudu-3',
        label: 'Pão de queijo',
        done: false,
      },
      'list-123',
      'default',
    ),
  ];

  it('should serialize a list and its tudus correctly into a .tudu payload', () => {
    const payload = serializeListToTuduPayload(sampleList, sampleTudus);

    expect(payload.type).toBe('tudu-list');
    expect(payload.version).toBe(1);
    expect(payload.list.label).toBe('Compras do Mês 🛒');
    expect(payload.list.color).toBe('#7956BF');
    expect(payload.list.groupName).toBe('Casa');
    expect(payload.tudus).toHaveLength(3);

    expect(payload.tudus[0]).toEqual({
      label: 'Leite desnatado',
      done: false,
      starred: true,
      dueDate: '2026-08-25T10:00:00.000Z',
      hasTime: true,
      recurrence: 'weekly',
    });
    expect(payload.tudus[1].done).toBe(true);
    expect(payload.tudus[2].done).toBe(false);
  });

  it('should serialize to valid JSON string and parse back cleanly', () => {
    const jsonString = serializeListToTuduJson(sampleList, sampleTudus);
    expect(typeof jsonString).toBe('string');

    const parsed = parseAndValidateTuduPayload(jsonString);
    expect(parsed.type).toBe('tudu-list');
    expect(parsed.list.label).toBe('Compras do Mês 🛒');
    expect(parsed.tudus).toHaveLength(3);
  });

  it('should generate sanitized filename with .tudu extension', () => {
    const filename1 = generateTuduFilename('Compras do Mês 🛒');
    expect(filename1).toBe('Compras_do_Mês_🛒.tudu');

    const filename2 = generateTuduFilename('Projetos / 2026: Trabalho?');
    expect(filename2).toBe('Projetos_2026_Trabalho.tudu');

    const filename3 = generateTuduFilename('');
    expect(filename3).toBe(`lista${TUDU_FILE_EXTENSION}`);
  });

  it('should generate accurate preview info', () => {
    const payload = serializeListToTuduPayload(sampleList, sampleTudus);
    const preview = getImportListPreview(payload);

    expect(preview.list.label).toBe('Compras do Mês 🛒');
    expect(preview.totalTudus).toBe(3);
    expect(preview.pendingTudus).toBe(2);
    expect(preview.doneTudus).toBe(1);
    expect(preview.starredTudus).toBe(1);
    expect(preview.scheduledTudus).toBe(1);
  });

  it('should reject invalid or corrupted payloads', () => {
    // Not a JSON
    expect(() => parseAndValidateTuduPayload('corrupted-string')).toThrow(
      'Formato de arquivo .tudu inválido ou corrompido.',
    );

    // Wrong type
    expect(() =>
      parseAndValidateTuduPayload(JSON.stringify({ type: 'other-type' })),
    ).toThrow('O arquivo selecionado não é uma lista válida do Tudú (.tudu).');

    // Future unsupported version
    expect(() =>
      parseAndValidateTuduPayload(
        JSON.stringify({
          type: 'tudu-list',
          version: 99,
          list: { label: 'Test' },
          tudus: [],
        }),
      ),
    ).toThrow('Versão do arquivo incompatível');

    // Missing list data
    expect(() =>
      parseAndValidateTuduPayload(
        JSON.stringify({
          type: 'tudu-list',
          version: 1,
          tudus: [],
        }),
      ),
    ).toThrow('Dados da lista ausentes ou corrompidos no arquivo.');

    // Corrupted tudus array
    expect(() =>
      parseAndValidateTuduPayload(
        JSON.stringify({
          type: 'tudu-list',
          version: 1,
          list: { label: 'Test' },
          tudus: 'not-an-array',
        }),
      ),
    ).toThrow('Estrutura de itens corrompida no arquivo .tudu.');
  });

  it('should format list as beautiful text with checkboxes and emojis', () => {
    const text = formatListAsText(sampleList, sampleTudus);

    expect(text).toContain('*Compras do Mês 🛒*');
    expect(text).toContain('◻️ Leite desnatado ⭐');
    expect(text).toContain('✅ Café');
    expect(text).toContain('◻️ Pão de queijo');
  });

  it('should handle empty list when formatting as text', () => {
    const emptyList = new ListViewModel({ id: 'empty-1', label: 'Vazia' });
    const text = formatListAsText(emptyList, []);

    expect(text).toBe('*Vazia*\n\n(Nenhum item)');
  });

  describe('readTuduFileFromUri', () => {
    const validJson = serializeListToTuduJson(sampleList, sampleTudus);

    it('should read from file:// URI correctly', async () => {
      const ReactNativeBlobUtil = require('react-native-blob-util');
      ReactNativeBlobUtil.fs.readFile.mockResolvedValueOnce(validJson);

      const { readTuduFileFromUri } = require('../src/service/list-sharing/listSharingService');
      const preview = await readTuduFileFromUri('file:///storage/emulated/0/Download/lista.tudu');

      expect(preview.list.label).toBe('Compras do Mês 🛒');
      expect(preview.totalTudus).toBe(3);
    });

    it('should read from content:// URI correctly', async () => {
      const ReactNativeBlobUtil = require('react-native-blob-util');
      ReactNativeBlobUtil.fs.readFile.mockResolvedValueOnce(validJson);

      const { readTuduFileFromUri } = require('../src/service/list-sharing/listSharingService');
      const preview = await readTuduFileFromUri('content://com.android.providers.downloads.documents/document/123');

      expect(preview.list.label).toBe('Compras do Mês 🛒');
      expect(preview.totalTudus).toBe(3);
    });
  });
});
