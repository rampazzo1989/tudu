import { useCallback, useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
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

export const useVoiceRecognition = (options?: UseVoiceRecognitionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;
  const isListeningRef = useRef(false);
  isListeningRef.current = isListening;

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
    try {
      await Voice.stop();
      RNReactNativeHapticFeedback.trigger('impactLight');
    } catch (err) {
      console.warn('[useVoiceRecognition] Error stopping voice recognition:', err);
    } finally {
      setIsListening(false);
    }
  }, []);

  const cancelListening = useCallback(async () => {
    try {
      await Voice.cancel();
    } catch (err) {
      console.warn('[useVoiceRecognition] Error canceling voice recognition:', err);
    } finally {
      setIsListening(false);
    }
  }, []);

  const startListening = useCallback(
    async (locale = 'pt-BR') => {
      setError(null);
      setRecognizedText('');

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
            // ignore cleanup errors
          }
        }

        const targetLocale = normalizeLocale(locale);
        RNReactNativeHapticFeedback.trigger('impactMedium');
        setIsListening(true);
        await Voice.start(targetLocale);
      } catch (err: any) {
        console.warn('[useVoiceRecognition] Error starting voice recognition:', err);
        setIsListening(false);
        const errMsg = err?.message || 'failed_to_start';
        if (!isBenignVoiceError(errMsg)) {
          setError(errMsg);
          optionsRef.current?.onError?.(errMsg);
        }
      }
    },
    [requestAudioPermission],
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
    const onSpeechStart = () => {
      setIsListening(true);
      setError(null);
    };

    const onSpeechRecognized = () => {
      // Recognized speech activity
    };

    const onSpeechEnd = () => {
      setIsListening(false);
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
      const rawCode = e?.error?.code !== undefined && e?.error?.code !== null ? String(e.error.code) : '';
      const rawMessage = e?.error?.message ? String(e.error.message) : '';
      const codeFromMessage = rawMessage.includes('/') ? rawMessage.split('/')[0].trim() : '';
      const errorCode = rawCode || codeFromMessage || rawMessage;

      console.log('[useVoiceRecognition] onSpeechError:', { errorCode, rawCode, rawMessage });
      setIsListening(false);

      if (isBenignVoiceError(errorCode) || isBenignVoiceError(rawMessage)) {
        return;
      }

      if (errorCode === '9' || rawMessage.toLowerCase().includes('insufficient permissions')) {
        setError('permission_denied');
        optionsRef.current?.onError?.('permission_denied');
        return;
      }

      const reportedError = errorCode || rawMessage || 'voice_error';
      setError(reportedError);
      optionsRef.current?.onError?.(reportedError);
    };

    const onSpeechResults = (e: SpeechResultsEvent) => {
      const texts = e.value;
      if (texts && texts.length > 0) {
        const bestMatch = texts[0];
        setRecognizedText(bestMatch);
        optionsRef.current?.onSpeechFinal?.(bestMatch);
      }
      setIsListening(false);
    };

    const onSpeechPartialResults = (e: SpeechResultsEvent) => {
      const texts = e.value;
      if (texts && texts.length > 0) {
        const partial = texts[0];
        setRecognizedText(partial);
        optionsRef.current?.onSpeechPartial?.(partial);
      }
    };

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners).catch(() => {});
    };
  }, []);

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
