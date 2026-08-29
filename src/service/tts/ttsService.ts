import { Platform } from 'react-native';
import Tts from 'react-native-tts';
import i18next from '../../i18n';

export interface SpeakOptions {
  onStart?: () => void;
  onFinish?: () => void;
  onError?: (err: any) => void;
  rate?: number;
  pitch?: number;
}

class TtsService {
  private static instance: TtsService;
  private isInitialized = false;
  private currentLanguage = 'pt-BR';
  private currentRate = 0.5;
  private currentPitch = 1.0;
  private activeSubscriptions: Array<{ remove: () => void }> = [];

  private constructor() {}

  public static getInstance(): TtsService {
    if (!TtsService.instance) {
      TtsService.instance = new TtsService();
    }
    return TtsService.instance;
  }

  /**
   * Initializes TTS with language, rate, and audio settings
   */
  public async init(rate?: number, pitch?: number): Promise<boolean> {
    try {
      if (rate !== undefined) {
        this.currentRate = rate;
      }
      if (pitch !== undefined) {
        this.currentPitch = pitch;
      }

      // Map i18n language to TTS locale
      const i18nLang = i18next.language || 'pt-BR';
      if (i18nLang.startsWith('en')) {
        this.currentLanguage = 'en-US';
      } else if (i18nLang.startsWith('es')) {
        this.currentLanguage = 'es-ES';
      } else if (i18nLang.startsWith('it')) {
        this.currentLanguage = 'it-IT';
      } else {
        this.currentLanguage = 'pt-BR';
      }

      await Tts.getInitStatus();

      // Configure audio session and playback
      if (Platform.OS === 'ios') {
        try {
          await Tts.setIgnoreSilentSwitch('ignore');
        } catch {
          // Ignore if silent switch config is unavailable
        }
      }

      try {
        await Tts.setDucking(true);
      } catch {
        // Ignore if ducking not supported
      }

      try {
        await Tts.setDefaultLanguage(this.currentLanguage);
      } catch {
        // Fallback to default system language if specific language is missing
      }

      await Tts.setDefaultRate(this.currentRate);
      await Tts.setDefaultPitch(this.currentPitch);

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.warn('[TtsService] Failed to initialize TTS engine:', error);
      return false;
    }
  }

  /**
   * Sets the voice rate (speed)
   */
  public async setRate(rate: number): Promise<void> {
    this.currentRate = rate;
    try {
      await Tts.setDefaultRate(rate);
    } catch (err) {
      console.warn('[TtsService] Could not set rate:', err);
    }
  }

  /**
   * Generates a natural language phrase for the task reminder
   */
  public formatTaskMessage(
    taskTitle: string,
    listName?: string,
    isTest?: boolean,
  ): string {
    if (isTest) {
      return i18next.t('incomingCall.tts.testMessage', {
        defaultValue:
          'Olá! Este é um teste de ligação do Tudú. Suas notificações por chamada com voz offline estão funcionando com sucesso!',
      });
    }

    const hasValidList =
      listName &&
      listName.trim().length > 0 &&
      listName.toLowerCase() !== 'unlisted' &&
      listName.toLowerCase() !== 'sem lista';

    if (hasValidList) {
      return i18next.t('incomingCall.tts.messageWithList', {
        list: listName,
        task: taskTitle,
        defaultValue: `Atenção! Lembrete da sua lista ${listName}: ${taskTitle}.`,
      });
    }

    return i18next.t('incomingCall.tts.message', {
      task: taskTitle,
      defaultValue: `Atenção! Lembrete do Tudú para agora: ${taskTitle}.`,
    });
  }

  /**
   * Speaks the provided text with optional callbacks
   */
  public async speak(text: string, options?: SpeakOptions): Promise<void> {
    if (!this.isInitialized) {
      await this.init(options?.rate, options?.pitch);
    }

    this.clearSubscriptions();

    if (options?.rate !== undefined) {
      await this.setRate(options.rate);
    }

    if (options?.onStart) {
      const subStart = Tts.addEventListener('tts-start', () => {
        options.onStart?.();
      });
      if (subStart) {
        this.activeSubscriptions.push(subStart as any);
      }
    }

    if (options?.onFinish) {
      const subFinish = Tts.addEventListener('tts-finish', () => {
        options.onFinish?.();
        this.clearSubscriptions();
      });
      if (subFinish) {
        this.activeSubscriptions.push(subFinish as any);
      }
    }

    if (options?.onError) {
      const subError = Tts.addEventListener('tts-error', (err: any) => {
        options.onError?.(err);
        this.clearSubscriptions();
      });
      if (subError) {
        this.activeSubscriptions.push(subError as any);
      }
    }

    try {
      Tts.stop();
      Tts.speak(text);
    } catch (err) {
      console.warn('[TtsService] Speak error:', err);
      options?.onError?.(err);
    }
  }

  /**
   * Stops any ongoing TTS speech and removes temporary listeners
   */
  public stop(): void {
    try {
      Tts.stop();
    } catch (err) {
      console.warn('[TtsService] Stop error:', err);
    }
    this.clearSubscriptions();
  }

  private clearSubscriptions(): void {
    this.activeSubscriptions.forEach(sub => {
      try {
        if (typeof sub?.remove === 'function') {
          sub.remove();
        }
      } catch {
        // Ignore cleanup errors
      }
    });
    this.activeSubscriptions = [];
  }
}

export const ttsService = TtsService.getInstance();
