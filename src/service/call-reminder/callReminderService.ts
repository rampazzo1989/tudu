import { Vibration, Platform } from 'react-native';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { ttsService } from '../tts/ttsService';
import { notificationService } from '../notification/notificationService';
import { TuduViewModel } from '../../scenes/home/types';

export interface CallState {
  status: 'ringing' | 'connected' | 'ended';
  tuduId?: string;
  taskTitle: string;
  listName?: string;
  listId?: string;
  isTest?: boolean;
  durationSeconds: number;
}

class CallReminderService {
  private static instance: CallReminderService;
  private vibrationInterval: NodeJS.Timeout | null = null;
  private timerInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): CallReminderService {
    if (!CallReminderService.instance) {
      CallReminderService.instance = new CallReminderService();
    }
    return CallReminderService.instance;
  }

  /**
   * Starts ringtone vibration loop for incoming call
   */
  public startRingingEffect(): void {
    this.stopRingingEffect();

    // Trigger immediate haptic feedback
    RNReactNativeHapticFeedback.trigger('impactHeavy');

    // Continuous vibration pattern
    Vibration.vibrate([0, 1000, 1000], true);

    if (Platform.OS === 'ios') {
      this.vibrationInterval = setInterval(() => {
        RNReactNativeHapticFeedback.trigger('notificationWarning');
      }, 1200);
    }
  }

  /**
   * Stops the ringtone vibration and any playing sounds
   */
  public stopRingingEffect(): void {
    if (this.vibrationInterval) {
      clearInterval(this.vibrationInterval);
      this.vibrationInterval = null;
    }
    Vibration.cancel();
  }

  /**
   * Called when user answers the call:
   * - Stops ringing
   * - Speaks the task reminder using offline TTS
   */
  public async answerCall(
    taskTitle: string,
    listName?: string,
    isTest?: boolean,
    ttsRate?: number,
    onSpeechFinish?: () => void,
  ): Promise<void> {
    this.stopRingingEffect();
    RNReactNativeHapticFeedback.trigger('notificationSuccess');

    const message = ttsService.formatTaskMessage(taskTitle, listName, isTest);
    await ttsService.speak(message, {
      rate: ttsRate || 0.5,
      onFinish: () => {
        if (onSpeechFinish) {
          onSpeechFinish();
        }
      },
    });
  }

  /**
   * Snoozes a tudu reminder for a given number of minutes
   */
  public async snoozeTudu(
    tudu: Partial<TuduViewModel> & { id: string; label: string },
    minutes: number = 5,
  ): Promise<void> {
    this.stopRingingEffect();
    ttsService.stop();

    const snoozeDate = new Date(Date.now() + minutes * 60 * 1000);
    const updatedTudu: TuduViewModel = {
      id: tudu.id,
      label: tudu.label,
      done: false,
      hasTime: true,
      dueDate: snoozeDate.toISOString(),
      listId: tudu.listId || '',
      listName: tudu.listName,
      createdAt: tudu.createdAt || new Date().toISOString(),
      position: tudu.position || 0,
    };

    await notificationService.scheduleTimedTudu(updatedTudu, true);
  }

  /**
   * Ends call and cleans up all audio/vibrations
   */
  public endCall(): void {
    this.stopRingingEffect();
    ttsService.stop();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}

export const callReminderService = CallReminderService.getInstance();
