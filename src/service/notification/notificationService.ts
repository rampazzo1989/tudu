import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import {Platform} from 'react-native';
import {TuduViewModel} from '../../scenes/home/types';
import {NotificationSettingsState} from '../../state/atoms';
import {
  DEFAULT_NOTIFICATION_SOUND,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_PREFIX,
  NOTIFICATION_SOUND_OPTIONS,
  NotificationSound,
  getSoundChannelId,
} from './types';
import i18next from '../../i18n';

class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;
  private currentSound: NotificationSound = DEFAULT_NOTIFICATION_SOUND;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Sets the active sound for notifications
   */
  public setSound(sound: NotificationSound): void {
    this.currentSound = sound;
  }

  /**
   * Initializes notification channels for Android
   */
  public async init(sound?: NotificationSound): Promise<void> {
    if (sound) {
      this.currentSound = sound;
    }

    if (this.isInitialized) {
      return;
    }

    if (Platform.OS === 'android') {
      // Create channels for each sound variation
      for (const soundOpt of NOTIFICATION_SOUND_OPTIONS) {
        const soundParam =
          soundOpt.id === 'default' ? 'default' : soundOpt.id;

        await notifee.createChannel({
          id: getSoundChannelId(NOTIFICATION_CHANNELS.TIMED_TUDUS.id, soundOpt.id),
          name: NOTIFICATION_CHANNELS.TIMED_TUDUS.name,
          description: NOTIFICATION_CHANNELS.TIMED_TUDUS.description,
          importance: AndroidImportance.HIGH,
          vibration: true,
          visibility: AndroidVisibility.PUBLIC,
          sound: soundParam,
        });

        await notifee.createChannel({
          id: getSoundChannelId(NOTIFICATION_CHANNELS.DAILY_DIGEST.id, soundOpt.id),
          name: NOTIFICATION_CHANNELS.DAILY_DIGEST.name,
          description: NOTIFICATION_CHANNELS.DAILY_DIGEST.description,
          importance: AndroidImportance.DEFAULT,
          vibration: true,
          visibility: AndroidVisibility.PUBLIC,
          sound: soundParam,
        });
      }

      // Legacy fallback channels
      await notifee.createChannel({
        id: NOTIFICATION_CHANNELS.TIMED_TUDUS.id,
        name: NOTIFICATION_CHANNELS.TIMED_TUDUS.name,
        description: NOTIFICATION_CHANNELS.TIMED_TUDUS.description,
        importance: AndroidImportance.HIGH,
        vibration: true,
        visibility: AndroidVisibility.PUBLIC,
        sound: DEFAULT_NOTIFICATION_SOUND,
      });

      await notifee.createChannel({
        id: NOTIFICATION_CHANNELS.DAILY_DIGEST.id,
        name: NOTIFICATION_CHANNELS.DAILY_DIGEST.name,
        description: NOTIFICATION_CHANNELS.DAILY_DIGEST.description,
        importance: AndroidImportance.DEFAULT,
        vibration: true,
        visibility: AndroidVisibility.PUBLIC,
        sound: DEFAULT_NOTIFICATION_SOUND,
      });
    }

    this.isInitialized = true;
  }

  /**
   * Requests notification permissions from user
   */
  public async requestPermissions(): Promise<boolean> {
    await this.init();
    const settings = await notifee.requestPermission();
    return (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  /**
   * Checks if notification permissions are granted
   */
  public async checkPermissions(): Promise<boolean> {
    const settings = await notifee.getNotificationSettings();
    return (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  /**
   * Schedules an exact alarm notification for a Tudu with time
   */
  public async scheduleTimedTudu(
    tudu: TuduViewModel,
    enabled: boolean = true,
    sound?: NotificationSound,
  ): Promise<void> {
    const notificationId = `${NOTIFICATION_PREFIX.TIMED_TUDU}${tudu.id}`;

    // Cancel existing notification for this tudu first
    await notifee.cancelNotification(notificationId);

    // If notifications disabled, no dueDate, no hasTime, or tudu is done, don't schedule
    if (!enabled || !tudu.dueDate || !tudu.hasTime || tudu.done) {
      return;
    }

    const timestamp = new Date(tudu.dueDate).getTime();
    const now = Date.now();

    // If the due time is in the past, skip
    if (timestamp <= now) {
      return;
    }

    const soundToUse = sound || this.currentSound || DEFAULT_NOTIFICATION_SOUND;
    await this.init(soundToUse);

    const title =
      tudu.listName && tudu.listName !== 'Unlisted'
        ? tudu.listName
        : i18next.t('notifications.timedTudu.defaultTitle', {
            defaultValue: 'Tudú Agendado',
          });

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp,
      alarmManager: {
        allowWhileIdle: true,
      },
    };

    const iosSound =
      soundToUse === 'default' ? 'default' : `${soundToUse}.wav`;

    await notifee.createTriggerNotification(
      {
        id: notificationId,
        title,
        body: tudu.label,
        data: {
          type: 'timed_tudu',
          tuduId: tudu.id,
          listId: tudu.listId,
          dateTimestamp: timestamp,
          sound: soundToUse,
        },
        android: {
          channelId: getSoundChannelId(
            NOTIFICATION_CHANNELS.TIMED_TUDUS.id,
            soundToUse,
          ),
          importance: AndroidImportance.HIGH,
          sound: soundToUse === 'default' ? 'default' : soundToUse,
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_launcher',
        },
        ios: {
          sound: iosSound,
        },
      },
      trigger,
    );
  }

  /**
   * Cancels notification for a specific tudu
   */
  public async cancelTimedTudu(tuduId: string): Promise<void> {
    const notificationId = `${NOTIFICATION_PREFIX.TIMED_TUDU}${tuduId}`;
    await notifee.cancelNotification(notificationId);
  }

  /**
   * Formats the Daily Digest notification text based on user requirements:
   * 1. untimedCount > 1: Shows aggregate count (including timed ones)
   * 2. untimedCount === 1: Shows text of the untimed tudu (and count of remaining if any)
   * 3. untimedCount === 0 && totalCount > 0: Shows count of timed tudus
   * 4. totalCount === 0: returns null
   */
  public formatDailyDigestContent(tudusForDay: TuduViewModel[]): {
    title: string;
    body: string;
  } | null {
    const activeTudus = tudusForDay.filter(t => !t.done);
    const totalCount = activeTudus.length;

    if (totalCount === 0) {
      return null;
    }

    const untimedTudus = activeTudus.filter(t => !t.hasTime);
    const untimedCount = untimedTudus.length;

    const title = i18next.t('notifications.dailyDigest.title', {
      defaultValue: 'Tarefas de Hoje',
    });

    let body = '';

    if (untimedCount > 1) {
      body = i18next.t('notifications.dailyDigest.multipleUntimed', {
        totalCount,
        defaultValue: `Você tem ${totalCount} tarefas agendadas para hoje`,
      });
    } else if (untimedCount === 1) {
      const untimedTudu = untimedTudus[0];
      if (totalCount === 1) {
        body = i18next.t('notifications.dailyDigest.singleUntimedOnly', {
          text: untimedTudu.label,
          defaultValue: `1 tarefa para hoje: ${untimedTudu.label}`,
        });
      } else {
        const remainingCount = totalCount - 1;
        body = i18next.t('notifications.dailyDigest.singleUntimedWithOthers', {
          text: untimedTudu.label,
          remainingCount,
          defaultValue: `${untimedTudu.label} (+ ${remainingCount} ${
            remainingCount === 1 ? 'outra agendada' : 'outras agendadas'
          } para hoje)`,
        });
      }
    } else {
      // untimedCount === 0 && totalCount > 0 (all tasks have specific times)
      body = i18next.t('notifications.dailyDigest.allTimed', {
        totalCount,
        defaultValue: `Você tem ${totalCount} tarefas agendadas para hoje ao longo do dia`,
      });
    }

    return {title, body};
  }

  /**
   * Schedules or updates the Daily Digest notification
   */
  public async scheduleDailyDigest(
    tudusForToday: TuduViewModel[],
    hour: number,
    minute: number,
    enabled: boolean = true,
    sound?: NotificationSound,
  ): Promise<void> {
    const notificationId = NOTIFICATION_PREFIX.DAILY_DIGEST;

    await notifee.cancelNotification(notificationId);

    if (!enabled) {
      return;
    }

    const content = this.formatDailyDigestContent(tudusForToday);
    if (!content) {
      return;
    }

    const soundToUse = sound || this.currentSound || DEFAULT_NOTIFICATION_SOUND;
    await this.init(soundToUse);

    // Determine target trigger time
    const targetDate = new Date();
    targetDate.setHours(hour, minute, 0, 0);

    // If today's time has already passed, schedule for tomorrow
    if (targetDate.getTime() <= Date.now()) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: targetDate.getTime(),
      alarmManager: {
        allowWhileIdle: true,
      },
    };

    const iosSound =
      soundToUse === 'default' ? 'default' : `${soundToUse}.wav`;

    await notifee.createTriggerNotification(
      {
        id: notificationId,
        title: content.title,
        body: content.body,
        data: {
          type: 'daily_digest',
          dateTimestamp: targetDate.getTime(),
          sound: soundToUse,
        },
        android: {
          channelId: getSoundChannelId(
            NOTIFICATION_CHANNELS.DAILY_DIGEST.id,
            soundToUse,
          ),
          importance: AndroidImportance.DEFAULT,
          sound: soundToUse === 'default' ? 'default' : soundToUse,
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_launcher',
        },
        ios: {
          sound: iosSound,
        },
      },
      trigger,
    );
  }

  /**
   * Sends an immediate test notification to verify sounds and permissions
   */
  public async sendTestNotification(sound?: NotificationSound): Promise<void> {
    const soundToUse = sound || this.currentSound || DEFAULT_NOTIFICATION_SOUND;
    await this.init(soundToUse);
    await this.requestPermissions();

    const iosSound =
      soundToUse === 'default' ? 'default' : `${soundToUse}.wav`;

    await notifee.displayNotification({
      id: NOTIFICATION_PREFIX.TEST,
      title: i18next.t('notifications.test.title', {
        defaultValue: '🔔 Teste de Notificação',
      }),
      body: i18next.t('notifications.test.body', {
        defaultValue: 'As notificações do Tudu estão funcionando perfeitamente!',
      }),
      data: {
        type: 'test',
        sound: soundToUse,
      },
      android: {
        channelId: getSoundChannelId(
          NOTIFICATION_CHANNELS.TIMED_TUDUS.id,
          soundToUse,
        ),
        importance: AndroidImportance.HIGH,
        sound: soundToUse === 'default' ? 'default' : soundToUse,
        pressAction: {
          id: 'default',
        },
        smallIcon: 'ic_launcher',
      },
      ios: {
        sound: iosSound,
      },
    });
  }

  /**
   * Full sync of all timed notifications and daily digest
   */
  public async syncAll(
    allTudus: TuduViewModel[],
    tudusForToday: TuduViewModel[],
    settings: NotificationSettingsState,
  ): Promise<void> {
    const soundToUse =
      settings.notificationSound || DEFAULT_NOTIFICATION_SOUND;
    this.currentSound = soundToUse;
    await this.init(soundToUse);

    // 1. Sync Timed Notifications
    if (!settings.timedNotificationsEnabled) {
      // Cancel all timed triggers
      const scheduledNotifications =
        await notifee.getTriggerNotificationIds();
      for (const id of scheduledNotifications) {
        if (id.startsWith(NOTIFICATION_PREFIX.TIMED_TUDU)) {
          await notifee.cancelNotification(id);
        }
      }
    } else {
      const timedTudus = allTudus.filter(
        t => t.dueDate && t.hasTime && !t.done,
      );
      for (const tudu of timedTudus) {
        await this.scheduleTimedTudu(tudu, true, soundToUse);
      }
    }

    // 2. Sync Daily Digest
    await this.scheduleDailyDigest(
      tudusForToday,
      settings.dailyDigestHour,
      settings.dailyDigestMinute,
      settings.dailyDigestEnabled,
      soundToUse,
    );
  }
}

export const notificationService = NotificationService.getInstance();

