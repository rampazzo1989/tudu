import { ListViewModel, TuduViewModel } from '../../scenes/home/types';
import { APP_NAME, APP_VERSION } from '../backup/backupSerializer';
import {
  ImportListPreviewInfo,
  TuduShareItem,
  TuduSharePayload,
} from './types';

export const CURRENT_LIST_SHARE_VERSION = 1;
export const TUDU_FILE_EXTENSION = '.tudu';

export const serializeListToTuduPayload = (
  list: ListViewModel,
  tudus: TuduViewModel[],
): TuduSharePayload => {
  const serializedTudus: TuduShareItem[] = (tudus || []).map(tudu => ({
    label: tudu.label,
    done: tudu.done,
    starred: tudu.starred,
    dueDate: tudu.dueDate ? tudu.dueDate.toISOString() : undefined,
    hasTime: tudu.hasTime,
    recurrence: tudu.recurrence,
  }));

  return {
    type: 'tudu-list',
    version: CURRENT_LIST_SHARE_VERSION,
    appName: APP_NAME,
    appVersion: APP_VERSION,
    createdAt: new Date().toISOString(),
    list: {
      label: list.label,
      color: list.color,
      groupName: list.groupName,
    },
    tudus: serializedTudus,
  };
};

export const serializeListToTuduJson = (
  list: ListViewModel,
  tudus: TuduViewModel[],
): string => {
  const payload = serializeListToTuduPayload(list, tudus);
  return JSON.stringify(payload, null, 2);
};

export const parseAndValidateTuduPayload = (
  rawJson: string,
): TuduSharePayload => {
  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new Error('Formato de arquivo .tudu inválido ou corrompido.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Arquivo de lista vazio ou inválido.');
  }

  if (parsed.type !== 'tudu-list') {
    throw new Error('O arquivo selecionado não é uma lista válida do Tudú (.tudu).');
  }

  if (
    typeof parsed.version !== 'number' ||
    parsed.version > CURRENT_LIST_SHARE_VERSION
  ) {
    throw new Error(
      `Versão do arquivo incompatível (v${parsed.version || '?'}). Atualize o aplicativo.`,
    );
  }

  if (!parsed.list || typeof parsed.list !== 'object' || !parsed.list.label) {
    throw new Error('Dados da lista ausentes ou corrompidos no arquivo.');
  }

  if (!Array.isArray(parsed.tudus)) {
    throw new Error('Estrutura de itens corrompida no arquivo .tudu.');
  }

  return parsed as TuduSharePayload;
};

export const generateTuduFilename = (listLabel: string): string => {
  // Remove special characters that are invalid in filenames
  const sanitized = listLabel
    .replace(/[\\/:*?"<>|]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  const baseName = sanitized || 'lista';
  return `${baseName}${TUDU_FILE_EXTENSION}`;
};

export const getImportListPreview = (
  payload: TuduSharePayload,
): ImportListPreviewInfo => {
  const { list, tudus = [], createdAt } = payload;

  const totalTudus = tudus.length;
  const pendingTudus = tudus.filter(t => !t.done).length;
  const doneTudus = tudus.filter(t => t.done).length;
  const starredTudus = tudus.filter(t => t.starred).length;
  const scheduledTudus = tudus.filter(t => !!t.dueDate).length;

  return {
    list,
    tudus,
    totalTudus,
    pendingTudus,
    doneTudus,
    starredTudus,
    scheduledTudus,
    createdAt: createdAt ? new Date(createdAt) : new Date(),
    rawPayload: payload,
  };
};

export const formatListAsText = (
  list: ListViewModel,
  tudus: TuduViewModel[],
): string => {
  const lines: string[] = [];

  const title = (list.label || '').trim();
  lines.push(`*${title}*`);
  lines.push('');

  if (!tudus || tudus.length === 0) {
    lines.push('(Nenhum item)');
    return lines.join('\n');
  }

  tudus.forEach(tudu => {
    const statusIcon = tudu.done ? '✅' : '◻️';
    const starredIcon = tudu.starred ? ' ⭐' : '';
    lines.push(`${statusIcon} ${tudu.label.trim()}${starredIcon}`);
  });

  return lines.join('\n');
};

