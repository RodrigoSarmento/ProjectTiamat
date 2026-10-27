import { I18nManager } from 'react-native';

import i18n from '../i18n';

export type Language = 'pt' | 'en';

const localeOf = (locale?: string | null) =>
  locale?.toLowerCase().replace('_', '-') ?? '';

/** English when the device is set to English. Everything else stays Portuguese. */
export const languageFromLocale = (locale?: string | null): Language =>
  localeOf(locale).startsWith('en') ? 'en' : 'pt';

export const deviceLanguage = (): Language =>
  languageFromLocale(I18nManager.getConstants().localeIdentifier);

/** Points i18next at the saved language before the screen renders its labels. */
export const applyLanguage = (language: Language) => {
  if (i18n.language !== language) {
    void i18n.changeLanguage(language);
  }
};
