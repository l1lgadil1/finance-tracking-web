'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiShield, FiBell, FiGlobe, FiDatabase, FiCreditCard, FiHelpCircle, FiMoon, FiMenu } from 'react-icons/fi';
import { Card, CardBody } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';
import { ProfileSection } from './sections/ProfileSection';
import { SecuritySection } from './sections/SecuritySection';
import { NotificationsSection } from './sections/NotificationsSection';
import { AppearanceSection } from './sections/AppearanceSection';
import { LanguageSection } from './sections/LanguageSection';
import { DataSection } from './sections/DataSection';
import { SubscriptionSection } from './sections/SubscriptionSection';
import { SupportSection } from './sections/SupportSection';

interface SettingsPageProps {
  params: {
    locale: Locale;
  };
}

type SettingsSection = {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

export const SettingsPage = ({ params }: SettingsPageProps) => {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [mounted, setMounted] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { locale } = params;

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const sections: SettingsSection[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <FiUser className="w-5 h-5" />,
      component: <ProfileSection locale={locale} />
    },
    {
      id: 'security',
      label: 'Security',
      icon: <FiShield className="w-5 h-5" />,
      component: <SecuritySection locale={locale} />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <FiBell className="w-5 h-5" />,
      component: <NotificationsSection locale={locale} />
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: <FiMoon className="w-5 h-5" />,
      component: <AppearanceSection locale={locale} />
    },
    {
      id: 'language',
      label: 'Language',
      icon: <FiGlobe className="w-5 h-5" />,
      component: <LanguageSection locale={locale} />
    },
    {
      id: 'data',
      label: 'Data Management',
      icon: <FiDatabase className="w-5 h-5" />,
      component: <DataSection locale={locale} />
    },
    {
      id: 'subscription',
      label: 'Subscription',
      icon: <FiCreditCard className="w-5 h-5" />,
      component: <SubscriptionSection locale={locale} />
    },
    {
      id: 'support',
      label: 'Help & Support',
      icon: <FiHelpCircle className="w-5 h-5" />,
      component: <SupportSection locale={locale} />
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  // Return minimal content during SSR to prevent hydration errors
  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-primary-600">Settings</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-primary-600 flex items-center">
        <button 
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className="lg:hidden p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={sidebarVisible ? "Hide settings menu" : "Show settings menu"}
        >
          <FiMenu className="h-5 w-5" />
        </button>
        Settings
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Settings sidebar - hidden by default on mobile, toggleable */}
        <div className={`
          ${sidebarVisible ? 'block' : 'hidden'} lg:block
          w-full lg:w-64 lg:shrink-0 lg:sticky lg:top-8 lg:self-start
          fixed lg:static inset-0 z-10 bg-background lg:bg-transparent p-4 lg:p-0
          ${sidebarVisible ? 'animate-fadeIn' : ''}
        `}>
          <Card className="w-full">
            <CardBody className="p-0">
              <motion.nav
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col"
              >
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    variants={itemVariants}
                    onClick={() => {
                      setActiveSection(section.id);
                      setSidebarVisible(false);
                    }}
                    className={`flex items-center gap-3 p-4 text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium">{section.label}</span>
                  </motion.button>
                ))}
              </motion.nav>
            </CardBody>
          </Card>
        </div>

        {/* Content Area with full width */}
        <div className="flex-1 min-w-0 w-full">
          {sections.map((section) => (
            <div 
              key={section.id} 
              className={activeSection === section.id ? 'block' : 'hidden'}
            >
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="w-full"
              >
                {section.component}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 