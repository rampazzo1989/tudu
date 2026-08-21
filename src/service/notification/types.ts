export const NOTIFICATION_CHANNELS = {
  TIMED_TUDUS: {
    id: 'tudus-timed',
    name: 'Lembretes de Tarefas',
    description: 'Notificações de tudús agendados com horário específico',
  },
  DAILY_DIGEST: {
    id: 'tudus-digest',
    name: 'Resumo Diário',
    description: 'Resumo diário de tarefas agendadas para o dia',
  },
} as const;

export const NOTIFICATION_PREFIX = {
  TIMED_TUDU: 'tudu_',
  DAILY_DIGEST: 'daily_digest',
  TEST: 'test_notification',
} as const;

export interface NotificationPayload {
  type: 'timed_tudu' | 'daily_digest' | 'test';
  tuduId?: string;
  listId?: string;
  dateTimestamp?: number;
}
