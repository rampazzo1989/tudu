import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, PermissionsAndroid, Platform } from 'react-native';
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from '@react-native-voice/voice';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';

export interface UseVoiceRecognitionOptions {
  onSpeechFinal?: (text: string) => void;
  onSpeechPartial?: (text: string) => void;
  onError?: (error: string) => void;
}

const normalizeLocale = (locale?: string): string => {
  if (!locale) return 'pt-BR';
  if (locale === 'pt' || locale.startsWith('pt-') || locale.startsWith('pt_')) return 'pt-BR';
  if (locale === 'en' || locale.startsWith('en-') || locale.startsWith('en_')) return 'en-US';
  if (locale === 'es' || locale.startsWith('es-') || locale.startsWith('es_')) return 'es-ES';
  if (locale === 'it' || locale.startsWith('it-') || locale.startsWith('it_')) return 'it-IT';
  return locale;
};

const BENIGN_CODES = new Set([
  '5', // Android ERROR_CLIENT (canceled or stopped)
  '6', // Android ERROR_SPEECH_TIMEOUT (user paused / silence timeout)
  '7', // Android ERROR_NO_MATCH (no recognition result)
  '8', // Android ERROR_RECOGNIZER_BUSY
  '203', // iOS no speech detected
  '216', // iOS recognition request canceled
  '1101', // iOS canceled
  '1107', // iOS canceled
]);

export const isBenignVoiceError = (rawErr: string | number | undefined | null): boolean => {
  if (!rawErr) return true;
  const str = String(rawErr).toLowerCase().trim();
  const code = str.split('/')[0].trim();
  if (BENIGN_CODES.has(code)) return true;

  const benignPhrases = [
    'no match',
    'no_match',
    'no speech input',
    'speech timeout',
    'speech_timeout',
    'client side error',
    'client_side_error',
    'recognitionservice busy',
    'cancel',
    'canceled',
    'cancelled',
  ];
  return benignPhrases.some(phrase => str.includes(phrase));
};

interface VoiceHandler {
  onSpeechStart: () => void;
  onSpeechRecognized: () => void;
  onSpeechEnd: () => void;
  onSpeechError: (e: SpeechErrorEvent) => void;
  onSpeechResults: (e: SpeechResultsEvent) => void;
  onSpeechPartialResults: (e: SpeechResultsEvent) => void;
}

let activeHandler: VoiceHandler | null = null;

// Bind stable listeners to the Voice singleton once
Voice.onSpeechStart = () => activeHandler?.onSpeechStart();
Voice.onSpeechRecognized = () => activeHandler?.onSpeechRecognized();
Voice.onSpeechEnd = () => activeHandler?.onSpeechEnd();
Voice.onSpeechError = (e: SpeechErrorEvent) => activeHandler?.onSpeechError(e);
Voice.onSpeechResults = (e: SpeechResultsEvent) => activeHandler?.onSpeechResults(e);
Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => activeHandler?.onSpeechPartialResults(e);

export const useVoiceRecognition = (options?: UseVoiceRecognitionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const isListeningRef = useRef(false);
  isListeningRef.current = isListening;

  const lastPartialTextRef = useRef('');
  const finalProcessedRef = useRef(false);
  const watchdogTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearWatchdog = useCallback(() => {
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
  }, []);

  const finalizeText = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || finalProcessedRef.current) return;
    finalProcessedRef.current = true;
    setRecognizedText(trimmed);
    optionsRef.current?.onSpeechFinal?.(trimmed);
  }, []);

  const requestAudioPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissão de Microfone',
            message:
              'O Tudú precisa de acesso ao microfone para permitir a criação de tarefas por voz.',
            buttonPositive: 'Permitir',
            buttonNegative: 'Cancelar',
          },
        );
        return status === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('[useVoiceRecognition] Error requesting audio permission on Android:', err);
        return false;
      }
    }
    return true;
  }, []);

  const stopListening = useCallback(async () => {
    clearWatchdog();
    setIsListening(false);
    isListeningRef.current = false;

    // Fallback: If partial text exists but was not yet finalized, commit it
    if (!finalProcessedRef.current && lastPartialTextRef.current.trim()) {
      finalizeText(lastPartialTextRef.current);
    }

    try {
      await Voice.stop();
      RNReactNativeHapticFeedback.trigger('impactLight');
    } catch (err) {
      console.warn('[useVoiceRecognition] Error stopping voice recognition:', err);
    }
  }, [clearWatchdog, finalizeText]);

  const cancelListening = useCallback(async () => {
    clearWatchdog();
    setIsListening(false);
    isListeningRef.current = false;
    lastPartialTextRef.current = '';
    finalProcessedRef.current = true;

    try {
      await Voice.cancel();
    } catch (err) {
      console.warn('[useVoiceRecognition] Error canceling voice recognition:', err);
    }
  }, [clearWatchdog]);

  const startListening = useCallback(
    async (locale = 'pt-BR') => {
      clearWatchdog();
      setError(null);
      setRecognizedText('');
      lastPartialTextRef.current = '';
      finalProcessedRef.current = false;

      // Dismiss soft keyboard so it doesn't conflict with Android audio focus
      Keyboard.dismiss();

      const hasPermission = await requestAudioPermission();
      if (!hasPermission) {
        const permissionError = 'permission_denied';
        setError(permissionError);
        optionsRef.current?.onError?.(permissionError);
        return;
      }

      try {
        if (isListeningRef.current) {
          try {
            await Voice.stop();
          } catch {
            // ignore
          }
        }

        const targetLocale = normalizeLocale(locale);
        RNReactNativeHapticFeedback.trigger('impactMedium');
        setIsListening(true);
        isListeningRef.current = true;

        await Voice.start(targetLocale, {
          EXTRA_LANGUAGE_MODEL: 'LANGUAGE_MODEL_FREE_FORM',
          EXTRA_MAX_RESULTS: 5,
          EXTRA_PARTIAL_RESULTS: true,
          REQUEST_PERMISSIONS_AUTO: true,
        });

        // Safety watchdog: after 12s, automatically finalize and stop if still active
        watchdogTimerRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            console.log('[useVoiceRecognition] Watchdog timeout triggered');
            stopListening();
          }
        }, 12000);
      } catch (err: any) {
        console.warn('[useVoiceRecognition] Error starting voice recognition:', err);
        setIsListening(false);
        isListeningRef.current = false;
        clearWatchdog();
        const errMsg = err?.message || 'failed_to_start';
        if (!isBenignVoiceError(errMsg)) {
          setError(errMsg);
          optionsRef.current?.onError?.(errMsg);
        }
      }
    },
    [clearWatchdog, requestAudioPermission, stopListening],
  );

  const toggleListening = useCallback(
    async (locale = 'pt-BR') => {
      if (isListening) {
        await stopListening();
      } else {
        await startListening(locale);
      }
    },
    [isListening, startListening, stopListening],
  );

  useEffect(() => {
    const handler: VoiceHandler = {
      onSpeechStart: () => {
        setIsListening(true);
        isListeningRef.current = true;
        setError(null);
      },
      onSpeechRecognized: () => {
        // Speech activity
      },
      onSpeechEnd: () => {
        clearWatchdog();
        setIsListening(false);
        isListeningRef.current = false;

        // Fallback: If partial results were received but onSpeechResults never fired on Android
        if (!finalProcessedRef.current && lastPartialTextRef.current.trim()) {
          finalizeText(lastPartialTextRef.current);
        }
      },
      onSpeechError: (e: SpeechErrorEvent) => {
        clearWatchdog();
        setIsListening(false);
        isListeningRef.current = false;

        const rawCode =
          e?.error?.code !== undefined && e?.error?.code !== null
            ? String(e.error.code)
            : '';
        const rawMessage = e?.error?.message ? String(e.error.message) : '';
        const codeFromMessage = rawMessage.includes('/')
          ? rawMessage.split('/')[0].trim()
          : '';
        const errorCode = rawCode || codeFromMessage || rawMessage;

        console.log('[useVoiceRecognition] onSpeechError:', {
          errorCode,
          rawCode,
          rawMessage,
        });

        // Fallback: If partial text exists and benign error occurred, commit partial text
        if (!finalProcessedRef.current && lastPartialTextRef.current.trim()) {
          finalizeText(lastPartialTextRef.current);
        }

        if (isBenignVoiceError(errorCode) || isBenignVoiceError(rawMessage)) {
          return;
        }

        if (
          errorCode === '9' ||
          rawMessage.toLowerCase().includes('insufficient permissions')
        ) {
          setError('permission_denied');
          optionsRef.current?.onError?.('permission_denied');
          return;
        }

        const reportedError = errorCode || rawMessage || 'voice_error';
        setError(reportedError);
        optionsRef.current?.onError?.(reportedError);
      },
      onSpeechResults: (e: SpeechResultsEvent) => {
        clearWatchdog();
        setIsListening(false);
        isListeningRef.current = false;

        const texts = e.value;
        if (texts && texts.length > 0) {
          const bestMatch = texts[0];
          finalizeText(bestMatch);
        } else if (!finalProcessedRef.current && lastPartialTextRef.current.trim()) {
          finalizeText(lastPartialTextRef.current);
        }
      },
      onSpeechPartialResults: (e: SpeechResultsEvent) => {
        const texts = e.value;
        if (texts && texts.length > 0) {
          const partial = texts[0];
          lastPartialTextRef.current = partial;
          setRecognizedText(partial);
          optionsRef.current?.onSpeechPartial?.(partial);
        }
      },
    };

    activeHandler = handler;

    return () => {
      clearWatchdog();
      if (activeHandler === handler) {
        activeHandler = null;
      }
    };
  }, [clearWatchdog, finalizeText]);

  return {
    isListening,
    recognizedText,
    error,
    startListening,
    stopListening,
    cancelListening,
    toggleListening,
  };
};

