'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiShield, FiBell, FiGlobe, FiDatabase, FiCreditCard, FiHelpCircle, FiMoon, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
  const { locale } = params;

  // For mobile tab scrolling
  const tabScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check scroll capabilities on mount and window resize
  useEffect(() => {
    const checkScroll = () => {
      if (tabScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tabScrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
      }
    };

    // Initial check
    checkScroll();

    // Re-check on window resize
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [mounted]);

  // Handle scroll events to update button states
  const handleTabScroll = () => {
    if (tabScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }
  };

  // Scroll the tabs left or right
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabScrollRef.current) {
      const scrollAmount = 200; // Amount to scroll
      const currentScroll = tabScrollRef.current.scrollLeft;
      tabScrollRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
      <h1 className="text-3xl font-bold mb-8 text-primary-600">Settings</h1>
      
      {/* Mobile tab navigation */}
      <div className="lg:hidden mb-6 relative">
        {canScrollLeft && (
          <button 
            onClick={() => scrollTabs('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-card shadow-md rounded-full p-1"
            aria-label="Scroll tabs left"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
        )}
        
        <div 
          ref={tabScrollRef}
          className="flex overflow-x-auto hide-scrollbar py-2" 
          onScroll={handleTabScroll}
        >
          <div className="inline-flex space-x-2 px-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex flex-col items-center rounded-lg py-2 px-4 min-w-[80px] ${
                  activeSection === section.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'bg-card hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {section.icon}
                <span className="text-xs mt-1 text-center">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {canScrollRight && (
          <button 
            onClick={() => scrollTabs('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-card shadow-md rounded-full p-1"
            aria-label="Scroll tabs right"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Settings sidebar - desktop only */}
        <div className="hidden lg:block lg:w-64 lg:shrink-0 lg:sticky lg:top-8 lg:self-start">
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
                    onClick={() => setActiveSection(section.id)}
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