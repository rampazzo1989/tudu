import { RecurrenceType } from '../../scenes/home/types';

export interface TuduShareItem {
  label: string;
  done: boolean;
  starred?: boolean;
  dueDate?: string;
  hasTime?: boolean;
  recurrence?: RecurrenceType;
}

export interface TuduShareListMetadata {
  label: string;
  color?: string;
  groupName?: string;
}

export interface TuduSharePayload {
  type: 'tudu-list';
  version: number;
  appName: string;
  appVersion: string;
  createdAt: string;
  list: TuduShareListMetadata;
  tudus: TuduShareItem[];
}

export interface ImportListPreviewInfo {
  list: TuduShareListMetadata;
  tudus: TuduShareItem[];
  totalTudus: number;
  pendingTudus: number;
  doneTudus: number;
  starredTudus: number;
  scheduledTudus: number;
  createdAt: Date;
  rawPayload: TuduSharePayload;
}
