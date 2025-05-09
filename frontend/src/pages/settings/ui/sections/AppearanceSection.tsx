'use client';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { FiMoon, FiSun, FiMonitor } from 'react-icons/fi';
import { Card, CardHeader, CardBody } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';

// Define translations
const translations = {
  en: {
    appearance: 'Appearance',
    customize: 'Customize how AqshaTracker looks for you. Choose between light mode, dark mode, or follow your system settings.',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    lightDescription: 'Light mode with bright background and dark text',
    darkDescription: 'Dark mode with dark background and light text',
    systemDescription: 'Follows your device system preferences',
    themePreview: 'Theme Preview',
    previewDescription: 'This is how your selected theme looks.'
  },
  ru: {
    appearance: 'Внешний вид',
    customize: 'Настройте внешний вид AqshaTracker. Выберите светлый режим, темный режим или следуйте настройкам вашей системы.',
    light: 'Светлый',
    dark: 'Темный',
    system: 'Системный',
    lightDescription: 'Светлый режим с ярким фоном и темным текстом',
    darkDescription: 'Темный режим с темным фоном и светлым текстом',
    systemDescription: 'Следует настройкам вашего устройства',
    themePreview: 'Предпросмотр темы',
    previewDescription: 'Так выглядит выбранная вами тема.'
  }
};

interface AppearanceSectionProps {
  locale: Locale;
}

type ThemeOption = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

export const AppearanceSection = ({ locale }: AppearanceSectionProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = translations[locale];

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const themeOptions: ThemeOption[] = [
    {
      id: 'light',
      name: t.light,
      icon: <FiSun className="w-5 h-5" />,
      description: t.lightDescription
    },
    {
      id: 'dark',
      name: t.dark,
      icon: <FiMoon className="w-5 h-5" />,
      description: t.darkDescription
    },
    {
      id: 'system',
      name: t.system,
      icon: <FiMonitor className="w-5 h-5" />,
      description: t.systemDescription
    }
  ];

  if (!mounted) return null;

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">{t.appearance}</h2>
      </CardHeader>
      <CardBody>
        <p className="text-muted-foreground mb-6">
          {t.customize}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleThemeChange(option.id)}
              className={`relative p-4 rounded-lg border cursor-pointer transition-colors ${
                theme === option.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-border hover:border-primary-300 dark:hover:border-primary-700 bg-card'
              }`}
              suppressHydrationWarning
            >
              <div className="absolute top-3 right-3">
                {theme === option.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 rounded-full bg-primary-500"
                  />
                )}
              </div>
              
              <div className="flex flex-col items-center text-center py-4">
                <div className={`p-3 rounded-full mb-4 ${
                  theme === option.id 
                    ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300' 
                    : 'bg-muted text-muted-foreground'
                }`}
                suppressHydrationWarning
                >
                  {option.icon}
                </div>
                <h3 className="font-medium mb-2">{option.name}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 p-4 rounded-lg bg-muted">
          <h3 className="font-medium mb-2">{t.themePreview}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t.previewDescription}</p>
          
          <div className="flex flex-col sm:flex-row gap-4" suppressHydrationWarning>
            <div className="flex-1 p-4 rounded-md border border-border bg-background">
              <div className="h-3 w-20 bg-primary-500 rounded mb-3"></div>
              <div className="h-2 w-full bg-muted-foreground/20 rounded mb-2"></div>
              <div className="h-2 w-4/5 bg-muted-foreground/20 rounded mb-2"></div>
              <div className="h-2 w-3/5 bg-muted-foreground/20 rounded"></div>
            </div>
            
            <div className="flex-1 p-4 rounded-md border border-border bg-card">
              <div className="flex justify-between mb-3">
                <div className="h-3 w-12 bg-primary-500 rounded"></div>
                <div className="h-3 w-3 bg-muted-foreground/30 rounded-full"></div>
              </div>
              <div className="h-10 w-full border border-border rounded mb-3 flex items-center px-3">
                <div className="h-2 w-24 bg-muted-foreground/30 rounded"></div>
              </div>
              <div className="h-8 w-20 bg-primary-500 rounded flex items-center justify-center">
                <div className="h-2 w-10 bg-white rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 