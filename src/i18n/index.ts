import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from '@os-team/i18next-react-native-language-detector'; // Importa o plugin para React Native
import en from '../locale/en.json';
import ptBr from '../locale/pt-BR.json';
import es from '../locale/es.json';
import it from '../locale/it.json';

export const defaultNS = 'translation';

export const resources = {
  'pt': {
    translation: ptBr,
  },
  'en': {
    translation: en,
  },
  'es': {
    translation: es,
  },
  'it': {
    translation: it,
  }
} as const;

i18next
  .use(LanguageDetector) // Usa o detector de idioma para React Native
  .use(initReactI18next) // Integra com React
  .init({
    compatibilityJSON: 'v3',
    ns: ['translation'],
    defaultNS,
    fallbackLng: 'en', // Idioma de fallback
    resources,
    detection: {
      order: ['device'], // Detecta o idioma do dispositivo
    },
  });

export default i18next;
