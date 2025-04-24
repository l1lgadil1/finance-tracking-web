export const locales = ['en', 'ru'] as const;
export type Locale = typeof locales[number];
export const defaultLocale = 'en';

type Messages = {
  [key: string]: string | Messages;
};

type TranslationsType = {
  [locale in Locale]: Messages;
};

export const translations: TranslationsType = {
  en: {
    common: {
      title: 'AqshaTracker',
      theme: {
        light: 'Light',
        dark: 'Dark',
        system: 'System'
      },
      language: {
        en: 'English',
        ru: 'Russian'
      }
    }
  },
  ru: {
    common: {
      title: 'АкшаТрекер',
      theme: {
        light: 'Светлая',
        dark: 'Темная',
        system: 'Системная'
      },
      language: {
        en: 'Английский',
        ru: 'Русский'
      }
    }
  }
}; 