export type NotificationSound =
  | 'tudu_marimba'
  | 'tudu_pop'
  | 'tudu_chime'
  | 'tudu_kalimba'
  | 'default';

export const DEFAULT_NOTIFICATION_SOUND: NotificationSound = 'tudu_marimba';

export interface NotificationSoundOption {
  id: NotificationSound;
  nameKey: string;
  descriptionKey: string;
  icon: string;
}

export const NOTIFICATION_SOUND_OPTIONS: NotificationSoundOption[] = [
  {
    id: 'tudu_marimba',
    nameKey: 'settings.notifications.sounds.marimba',
    descriptionKey: 'settings.notifications.sounds.marimbaDesc',
    icon: '🎵',
  },
  {
    id: 'tudu_pop',
    nameKey: 'settings.notifications.sounds.pop',
    descriptionKey: 'settings.notifications.sounds.popDesc',
    icon: '🫧',
  },
  {
    id: 'tudu_chime',
    nameKey: 'settings.notifications.sounds.chime',
    descriptionKey: 'settings.notifications.sounds.chimeDesc',
    icon: '🔔',
  },
  {
    id: 'tudu_kalimba',
    nameKey: 'settings.notifications.sounds.kalimba',
    descriptionKey: 'settings.notifications.sounds.kalimbaDesc',
    icon: '🪵',
  },
  {
    id: 'default',
    nameKey: 'settings.notifications.sounds.systemDefault',
    descriptionKey: 'settings.notifications.sounds.systemDefaultDesc',
    icon: '⚙️',
  },
];

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
  CALL_REMINDERS: {
    id: 'tudus-calls',
    name: 'Lembretes por Chamada',
    description: 'Chamadas e alarmes de tela cheia para tarefas agendadas',
  },
} as const;

export const NOTIFICATION_CHANNEL_VERSION = 'v1';

export const getSoundChannelId = (
  baseChannelId: string,
  sound: NotificationSound = DEFAULT_NOTIFICATION_SOUND,
): string => {
  return `${baseChannelId}_${NOTIFICATION_CHANNEL_VERSION}_${sound}`;
};

export const NOTIFICATION_PREFIX = {
  TIMED_TUDU: 'tudu_',
  DAILY_DIGEST: 'daily_digest',
  TEST: 'test_notification',
  CALL_REMINDER: 'call_tudu_',
} as const;

export interface NotificationPayload {
  type: 'timed_tudu' | 'daily_digest' | 'test' | 'call_reminder';
  tuduId?: string;
  listId?: string;
  listName?: string;
  taskTitle?: string;
  dateTimestamp?: number;
  isTest?: boolean;
}

