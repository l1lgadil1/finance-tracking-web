import { Metadata } from 'next';

// Translations
const translations = {
  en: {
    title: 'Sign Up - AqshaTracker',
    description: 'Create your AqshaTracker account to start tracking your finances.',
  },
  ru: {
    title: 'Регистрация - АкшаТрекер',
    description: 'Создайте свой аккаунт АкшаТрекера для отслеживания финансов.',
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