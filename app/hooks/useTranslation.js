import {useLocation} from '@remix-run/react';
import {en} from '~/translations/en';
import {de} from '~/translations/de';
import {getMarketByLocale} from '~/config/markets';

const translations = {
  en,
  de,
};

export function useTranslation() {
  const location = useLocation();
  const [, locale] = location.pathname.split('/');
  const market = getMarketByLocale(locale);
  const language = market.language.toLowerCase();

  function t(key, params = {}) {
    // Split the key by dots to traverse the translations object
    const keys = key.split('.');
    let value = translations[language] || translations.en; // fallback to English

    // Traverse the translations object
    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }

    // If no translation found, fallback to English
    if (!value && language !== 'en') {
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
        if (!value) break;
      }
    }

    // If still no value, return the key
    if (!value) return key;

    // Replace any parameters in the string
    return Object.entries(params).reduce(
      (str, [key, value]) => str.replace(`{${key}}`, value),
      value
    );
  }

  return {t};
}
