import { I18nManager } from 'react-native';

import { deviceLanguage, languageFromLocale } from './language';

describe('languageFromLocale', () => {
  it('uses English for an English device', () => {
    expect(languageFromLocale('en_US')).toBe('en');
    expect(languageFromLocale('en-GB')).toBe('en');
  });

  it('keeps Portuguese for a Portuguese device and for any other language', () => {
    expect(languageFromLocale('pt_BR')).toBe('pt');
    expect(languageFromLocale('pt-PT')).toBe('pt');
    expect(languageFromLocale('es_ES')).toBe('pt');
    expect(languageFromLocale(undefined)).toBe('pt');
  });
});

describe('deviceLanguage', () => {
  it('reads the locale reported by the device', () => {
    jest.spyOn(I18nManager, 'getConstants').mockReturnValue({
      isRTL: false,
      doLeftAndRightSwapInRTL: true,
      localeIdentifier: 'en_US',
    });

    expect(deviceLanguage()).toBe('en');
  });
});
