'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiGlobe, FiCheck } from 'react-icons/fi';
import { Card, CardHeader, CardBody } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';

// Define translations
const translations = {
  en: {
    language: 'Language',
    chooseLanguage: 'Choose the language you want to use in AqshaTracker.',
    languageInfo: 'Language Information',
    currentlySupported: 'AqshaTracker currently supports English and Russian languages.',
    workingOnAdding: 'We\'re working on adding more language options in the future. Your selection will be saved and applied across all of your devices.'
  },
  ru: {
    language: 'Язык',
    chooseLanguage: 'Выберите язык, который вы хотите использовать в AqshaTracker.',
    languageInfo: 'Информация о языках',
    currentlySupported: 'В настоящее время AqshaTracker поддерживает английский и русский языки.',
    workingOnAdding: 'Мы работаем над добавлением большего количества языковых опций в будущем. Ваш выбор будет сохранен и применен на всех ваших устройствах.'
  }
};

interface LanguageSectionProps {
  locale: Locale;
}

type LanguageOption = {
  id: Locale;
  name: string;
  nativeName: string;
  flag: string;
};

export const LanguageSection = ({ locale }: LanguageSectionProps) => {
  const router = useRouter();
  const [selectedLocale, setSelectedLocale] = useState<Locale>(locale);
  const t = translations[locale];

  const languageOptions: LanguageOption[] = [
    {
      id: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    },
    {
      id: 'ru',
      name: 'Russian',
      nativeName: 'Русский',
      flag: '🇷🇺'
    }
  ];

  const handleLanguageChange = (langId: Locale) => {
    setSelectedLocale(langId);

    // Replace the current path with the same path but with the new locale
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.split('/').slice(2).join('/');
    const newPath = `/${langId}/${pathWithoutLocale}`;
    
    router.push(newPath);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">{t.language}</h2>
      </CardHeader>
      <CardBody>
        <p className="text-muted-foreground mb-6">
          {t.chooseLanguage}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languageOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLanguageChange(option.id)}
              className={`relative p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedLocale === option.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-border hover:border-primary-300 dark:hover:border-primary-700 bg-card'
              }`}
              suppressHydrationWarning
            >
              <div className="absolute top-3 right-3">
                {selectedLocale === option.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white"
                  >
                    <FiCheck className="w-4 h-4" />
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center" suppressHydrationWarning>
                <div className="text-3xl mr-4">{option.flag}</div>
                <div>
                  <h3 className="font-medium">{option.name}</h3>
                  <p className="text-sm text-muted-foreground">{option.nativeName}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 p-4 rounded-lg border border-border">
          <div className="flex items-center text-muted-foreground mb-2">
            <FiGlobe className="mr-2" />
            <h3 className="font-medium">{t.languageInfo}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {t.currentlySupported}
          </p>
          <p className="text-sm text-muted-foreground">
            {t.workingOnAdding}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}; 