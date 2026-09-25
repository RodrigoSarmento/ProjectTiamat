import i18n from '../i18n';

export const storyText = (value: string) =>
  i18n.exists(value) ? String(i18n.t(value)) : value;
