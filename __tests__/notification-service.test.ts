jest.mock('../src/i18n', () => ({
  t: (key: string, options?: any) => {
    if (key === 'notifications.dailyDigest.title') return 'Tarefas de Hoje';
    if (key === 'notifications.dailyDigest.multipleUntimed')
      return `Você tem ${options?.totalCount} tarefas agendadas para hoje`;
    if (key === 'notifications.dailyDigest.singleUntimedOnly')
      return `1 tarefa para hoje: ${options?.text}`;
    if (key === 'notifications.dailyDigest.singleUntimedWithOthers')
      return `${options?.text} (+ ${options?.remainingCount} outras agendadas para hoje)`;
    if (key === 'notifications.dailyDigest.allTimed')
      return `Você tem ${options?.totalCount} tarefas agendadas para hoje ao longo do dia`;
    if (key === 'notifications.timedTudu.defaultTitle') return 'Tudú Agendado';
    return options?.defaultValue || key;
  },
}));

jest.mock('@notifee/react-native', () => ({
  createChannel: jest.fn(),
  createTriggerNotification: jest.fn(),
  cancelNotification: jest.fn(),
  getTriggerNotificationIds: jest.fn().mockResolvedValue([]),
  displayNotification: jest.fn(),
  requestPermission: jest.fn().mockResolvedValue({authorizationStatus: 1}),
  getNotificationSettings: jest.fn().mockResolvedValue({authorizationStatus: 1}),
  AndroidImportance: {HIGH: 4, DEFAULT: 3},
  AndroidVisibility: {PUBLIC: 1},
  AuthorizationStatus: {AUTHORIZED: 1, PROVISIONAL: 2, DENIED: 0},
  TriggerType: {TIMESTAMP: 0},
}));

import {TuduViewModel, TuduItem} from '../src/scenes/home/types';
import {notificationService} from '../src/service/notification/notificationService';
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_PREFIX,
} from '../src/service/notification/types';

describe('Notification Service', () => {
  describe('Constants and Channels', () => {
    it('should define correct notification channels', () => {
      expect(NOTIFICATION_CHANNELS.TIMED_TUDUS.id).toBe('tudus-timed');
      expect(NOTIFICATION_CHANNELS.DAILY_DIGEST.id).toBe('tudus-digest');
    });

    it('should define correct notification prefixes', () => {
      expect(NOTIFICATION_PREFIX.TIMED_TUDU).toBe('tudu_');
      expect(NOTIFICATION_PREFIX.DAILY_DIGEST).toBe('daily_digest');
      expect(NOTIFICATION_PREFIX.TEST).toBe('test_notification');
    });
  });

  describe('formatDailyDigestContent', () => {
    const createTudu = (
      id: string,
      label: string,
      hasTime: boolean = false,
      done: boolean = false,
    ): TuduViewModel => {
      const item: TuduItem = {
        id,
        label,
        done,
        dueDate: new Date(),
        hasTime,
      };
      return new TuduViewModel(item, 'list-1', 'default', 'Geral');
    };

    it('should return null when there are no active tudus', () => {
      const result = notificationService.formatDailyDigestContent([]);
      expect(result).toBeNull();

      const doneResult = notificationService.formatDailyDigestContent([
        createTudu('1', 'Comprar pão', false, true),
      ]);
      expect(doneResult).toBeNull();
    });

    it('should format message when untimedCount > 1 (aggregate count including timed)', () => {
      const tudus = [
        createTudu('1', 'Comprar pão', false),
        createTudu('2', 'Estudar React Native', false),
        createTudu('3', 'Dentista @15:00', true),
      ];

      const content = notificationService.formatDailyDigestContent(tudus);
      expect(content).not.toBeNull();
      expect(content?.title).toBe('Tarefas de Hoje');
      expect(content?.body).toContain('3');
      expect(content?.body).toContain('tarefas agendadas para hoje');
    });

    it('should format message when untimedCount === 1 and totalCount === 1 (show single task text)', () => {
      const tudus = [createTudu('1', 'Comprar leite', false)];

      const content = notificationService.formatDailyDigestContent(tudus);
      expect(content).not.toBeNull();
      expect(content?.title).toBe('Tarefas de Hoje');
      expect(content?.body).toBe('1 tarefa para hoje: Comprar leite');
    });

    it('should format message when untimedCount === 1 and totalCount > 1 (show single task text + remaining)', () => {
      const tudus = [
        createTudu('1', 'Comprar leite', false),
        createTudu('2', 'Dentista @14:00', true),
        createTudu('3', 'Reunião @16:30', true),
      ];

      const content = notificationService.formatDailyDigestContent(tudus);
      expect(content).not.toBeNull();
      expect(content?.title).toBe('Tarefas de Hoje');
      expect(content?.body).toContain('Comprar leite');
      expect(content?.body).toContain('+ 2 outras agendadas para hoje');
    });

    it('should format message when untimedCount === 0 and totalCount > 0 (all tasks have time)', () => {
      const tudus = [
        createTudu('1', 'Dentista @14:00', true),
        createTudu('2', 'Reunião @16:30', true),
      ];

      const content = notificationService.formatDailyDigestContent(tudus);
      expect(content).not.toBeNull();
      expect(content?.title).toBe('Tarefas de Hoje');
      expect(content?.body).toContain('2 tarefas agendadas para hoje ao longo do dia');
    });
  });
});
