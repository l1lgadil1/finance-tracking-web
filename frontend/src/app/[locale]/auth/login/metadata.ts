import { Metadata } from 'next';

// Translations
const translations = {
  en: {
    title: 'Sign In - AqshaTracker',
    description: 'Sign in to your AqshaTracker account to manage your finances.',
  },
  ru: {
    title: 'Вход - АкшаТрекер',
    description: 'Войдите в свой аккаунт АкшаТрекера для управления финансами.',
  },
};

// Dynamically set metadata based on locale
export async function generateMetadata({ 
  params: { locale } 
}: { 
  params: { locale: 'en' | 'ru' } 
}): Promise<Metadata> {
  const t = translations[locale];
  
  return {
    title: t.title,
    description: t.description,
  };
} 