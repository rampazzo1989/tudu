import {resources, defaultNS} from '../i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    // eslint-disable-next-line prettier/prettier
    resources: typeof resources['en'];
  }
}
