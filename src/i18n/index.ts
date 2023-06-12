import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../locale/en.json';
import pt from '../locale/pt.json';

export const defaultNS = 'translation';

export const resources = {
  pt: {
    translation: pt,
  },
  en: {
    translation: en,
  },
} as const;

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  ns: ['translation'],
  defaultNS,
  fallbackLng: 'en',
  resources,
});

export default i18next;
