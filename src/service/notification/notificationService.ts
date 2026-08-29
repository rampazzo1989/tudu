import notifee, {
  AlarmType,
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { Platform } from 'react-native';
import { TuduViewModel } from '../../scenes/home/types';
import { NotificationSettingsState } from '../../state/atoms';
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
  private callRemindersEnabled = false;

  private constructor() { }

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
   * Sets whether call reminders are enabled globally
   */
  public setCallRemindersEnabled(enabled: boolean): void {
    this.callRemindersEnabled = enabled;
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
          importance: AndroidImportance.HIGH,
          vibration: true,
          visibility: AndroidVisibility.PUBLIC,
          sound: soundParam,
        });

        await notifee.createChannel({
          id: getSoundChannelId(NOTIFICATION_CHANNELS.CALL_REMINDERS.id, soundOpt.id),
          name: NOTIFICATION_CHANNELS.CALL_REMINDERS.name,
          description: NOTIFICATION_CHANNELS.CALL_REMINDERS.description,
          importance: AndroidImportance.HIGH,
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

      await notifee.createChannel({
        id: NOTIFICATION_CHANNELS.CALL_REMINDERS.id,
        name: NOTIFICATION_CHANNELS.CALL_REMINDERS.name,
        description: NOTIFICATION_CHANNELS.CALL_REMINDERS.description,
        importance: AndroidImportance.HIGH,
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
    isCallReminder?: boolean,
  ): Promise<void> {
    const notificationId = `${NOTIFICATION_PREFIX.TIMED_TUDU}${tudu.id}`;

    // Cancel existing notification for this tudu first
    await notifee.cancelNotification(notificationId);

    console.log(`🔔 [NotificationService] scheduleTimedTudu:`, {
      id: tudu.id,
      label: tudu.label,
      dueDate: tudu.dueDate?.toString(),
      hasTime: tudu.hasTime,
      done: tudu.done,
      enabled,
      isCallReminder,
    });

    // If notifications disabled, no dueDate, no hasTime, or tudu is done, don't schedule
    if (!enabled || !tudu.dueDate || !tudu.hasTime || tudu.done) {
      console.log(`🔔 [NotificationService] Abortado agendamento: enabled=${enabled}, hasDueDate=${!!tudu.dueDate}, hasTime=${tudu.hasTime}, done=${tudu.done}`);
      return;
    }

    const timestamp = new Date(tudu.dueDate).getTime();
    const now = Date.now();

    // If the due time is in the past, skip
    if (timestamp <= now) {
      console.log(`🔔 [NotificationService] Abortado pois timestamp (${new Date(timestamp).toLocaleTimeString()}) <= now (${new Date(now).toLocaleTimeString()})`);
      return;
    }

    const soundToUse = sound || this.currentSound || DEFAULT_NOTIFICATION_SOUND;
    await this.init(soundToUse);

    const shouldUseCall =
      isCallReminder !== undefined ? isCallReminder : this.callRemindersEnabled;

    const resolvedListName =
      tudu.listName && tudu.listName !== 'Unlisted' && tudu.listName !== 'sem lista'
        ? tudu.listName
        : i18next.t('notifications.timedTudu.defaultListName', {
          defaultValue: i18next.t('listTitles.today', { defaultValue: 'Hoje' }),
        });

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
        type: shouldUseCall
          ? AlarmType.SET_ALARM_CLOCK
          : AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE,
        allowWhileIdle: true,
      },
    };

    const iosSound =
      soundToUse === 'default' ? 'default' : `${soundToUse}.wav`;

    const channelId = shouldUseCall
      ? getSoundChannelId(NOTIFICATION_CHANNELS.CALL_REMINDERS.id, soundToUse)
      : getSoundChannelId(NOTIFICATION_CHANNELS.TIMED_TUDUS.id, soundToUse);

    try {
      await notifee.createTriggerNotification(
        {
          id: notificationId,
          title: shouldUseCall
            ? `📞 ${i18next.t('incomingCall.title', { defaultValue: 'Lembrete do Tudú' })}`
            : title,
          body: tudu.label,
          data: {
            type: shouldUseCall ? 'call_reminder' : 'timed_tudu',
            tuduId: tudu.id,
            listId: tudu.listId,
            listName: resolvedListName,
            taskTitle: tudu.label,
            dateTimestamp: timestamp,
            sound: soundToUse,
          },
          android: {
            channelId,
            importance: AndroidImportance.HIGH,
            sound: soundToUse === 'default' ? 'default' : soundToUse,
            pressAction: {
              id: shouldUseCall ? 'call' : 'default',
              launchActivity: shouldUseCall ? 'default' : undefined,
            },
            ...(shouldUseCall
              ? {
                fullScreenAction: {
                  id: 'call',
                  launchActivity: 'default',
                },
                actions: [
                  {
                    title: `📞 ${i18next.t('incomingCall.actions.answer', { defaultValue: 'Atender' })}`,
                    pressAction: { id: 'call_answer', launchActivity: 'default' },
                  },
                  {
                    title: `🔴 ${i18next.t('incomingCall.actions.decline', { defaultValue: 'Recusar' })}`,
                    pressAction: { id: 'call_decline' },
                  },
                ],
              }
              : {}),
            smallIcon: 'ic_launcher',
          },
          ios: {
            sound: iosSound,
            interruptionLevel: 'timeSensitive',
          },
        },
        trigger,
      );
      console.log(
        `🔔 [NotificationService] Agendado ${shouldUseCall ? 'Chamada' : 'Lembrete'}: "${tudu.label}" para ${new Date(timestamp).toLocaleTimeString()} (timestamp: ${timestamp}) Hora: ${Date.now()}`,
      );
    } catch (err) {
      console.warn('[NotificationService] Erro ao criar trigger notification:', err);
    }
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
          defaultValue: `${untimedTudu.label} (+ ${remainingCount} ${remainingCount === 1 ? 'outra agendada' : 'outras agendadas'
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

    return { title, body };
  }

  /**
   * Schedules or updates the Daily Digest notification
   */
  public async scheduleDailyDigest(
    tudusForTargetDate: TuduViewModel[],
    hour: number,
    minute: number,
    enabled: boolean = true,
    sound?: NotificationSound,
    targetDateOverride?: Date,
  ): Promise<void> {
    const notificationId = NOTIFICATION_PREFIX.DAILY_DIGEST;

    await notifee.cancelNotification(notificationId);

    if (!enabled) {
      return;
    }

    const content = this.formatDailyDigestContent(tudusForTargetDate);
    if (!content) {
      return;
    }

    const soundToUse = sound || this.currentSound || DEFAULT_NOTIFICATION_SOUND;
    await this.init(soundToUse);

    // Determine target trigger time
    let targetDate: Date;
    if (targetDateOverride) {
      targetDate = new Date(targetDateOverride);
      targetDate.setHours(hour, minute, 0, 0);
    } else {
      targetDate = new Date();
      targetDate.setHours(hour, minute, 0, 0);

      // If today's time has already passed, schedule for tomorrow
      if (targetDate.getTime() <= Date.now()) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
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
   * Sends an immediate test call notification to preview the incoming call experience
   */
  public async sendTestCallNotification(sound?: NotificationSound): Promise<void> {
    const soundToUse = sound || this.currentSound || DEFAULT_NOTIFICATION_SOUND;
    await this.init(soundToUse);
    await this.requestPermissions();

    const iosSound =
      soundToUse === 'default' ? 'default' : `${soundToUse}.wav`;

    await notifee.displayNotification({
      id: `${NOTIFICATION_PREFIX.CALL_REMINDER}test`,
      title: `📞 ${i18next.t('incomingCall.title', { defaultValue: 'Lembrete do Tudú' })}`,
      body: i18next.t('incomingCall.testDescription', {
        defaultValue: 'Toque para atender a ligação de teste do Tudú',
      }),
      data: {
        type: 'call_reminder',
        taskTitle: i18next.t('incomingCall.sampleTask', { defaultValue: 'Revisar metas do dia' }),
        listName: i18next.t('incomingCall.sampleList', { defaultValue: 'Foco & Produtividade' }),
        isTest: true,
        sound: soundToUse,
      },
      android: {
        channelId: getSoundChannelId(
          NOTIFICATION_CHANNELS.CALL_REMINDERS.id,
          soundToUse,
        ),
        importance: AndroidImportance.HIGH,
        sound: soundToUse === 'default' ? 'default' : soundToUse,
        pressAction: {
          id: 'call',
          launchActivity: 'default',
        },
        fullScreenAction: {
          id: 'call',
          launchActivity: 'default',
        },
        actions: [
          {
            title: `📞 ${i18next.t('incomingCall.actions.answer', { defaultValue: 'Atender' })}`,
            pressAction: { id: 'call_answer', launchActivity: 'default' },
          },
          {
            title: `🔴 ${i18next.t('incomingCall.actions.decline', { defaultValue: 'Recusar' })}`,
            pressAction: { id: 'call_decline' },
          },
        ],
        smallIcon: 'ic_launcher',
      },
      ios: {
        sound: iosSound,
        interruptionLevel: 'timeSensitive',
      },
    });
  }

  /**
   * Full sync of all timed notifications and daily digest with orphan cleanup
   */
  public async syncAll(
    allTudus: TuduViewModel[],
    tudusForDigest: TuduViewModel[],
    settings: NotificationSettingsState,
    targetDigestDate?: Date,
  ): Promise<void> {
    const soundToUse =
      settings.notificationSound || DEFAULT_NOTIFICATION_SOUND;
    this.currentSound = soundToUse;
    await this.init(soundToUse);

    const scheduledNotificationIds =
      await notifee.getTriggerNotificationIds();

    // 1. Sync Timed Notifications
    if (!settings.timedNotificationsEnabled) {
      // Cancel all timed triggers
      for (const id of scheduledNotificationIds) {
        if (id.startsWith(NOTIFICATION_PREFIX.TIMED_TUDU)) {
          await notifee.cancelNotification(id);
        }
      }
    } else {
      const now = Date.now();
      const timedTudus = allTudus.filter(
        t =>
          t.dueDate &&
          t.hasTime &&
          !t.done &&
          new Date(t.dueDate).getTime() > now,
      );

      const activeTimedNotificationIds = new Set(
        timedTudus.map(t => `${NOTIFICATION_PREFIX.TIMED_TUDU}${t.id}`),
      );

      // Clean up orphaned timed notifications (deleted, completed, or untimed tasks)
      for (const id of scheduledNotificationIds) {
        if (
          id.startsWith(NOTIFICATION_PREFIX.TIMED_TUDU) &&
          !activeTimedNotificationIds.has(id)
        ) {
          await notifee.cancelNotification(id);
        }
      }

      // Schedule active timed tudus
      for (const tudu of timedTudus) {
        await this.scheduleTimedTudu(
          tudu,
          true,
          soundToUse,
          Boolean(settings.callRemindersEnabled),
        );
      }
    }

    // 2. Sync Daily Digest
    await this.scheduleDailyDigest(
      tudusForDigest,
      settings.dailyDigestHour,
      settings.dailyDigestMinute,
      settings.dailyDigestEnabled,
      soundToUse,
      targetDigestDate,
    );
  }
}

export const notificationService = NotificationService.getInstance();

