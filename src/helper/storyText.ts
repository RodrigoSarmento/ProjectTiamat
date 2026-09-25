import i18n from '../i18n';

export const storyText = (
  value: string,
  options?: Record<string, string | number>,
) => (i18n.exists(value) ? String(i18n.t(value, options)) : value);
