import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import english from './translation/english.json';
import portuguese from './translation/portuguese.json';

i18n.use(initReactI18next).init({
  lng: 'pt',
  fallbackLng: 'pt',
  initImmediate: false,
  resources: {
    pt: {
      translation: portuguese,
    },
    en: {
      translation: english,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
