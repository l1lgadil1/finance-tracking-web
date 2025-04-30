import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/Button';
import { BiBrain } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

// Define translations
const translations = {
  en: {
    title: 'AI Assistant',
    description: "I'm your personal finance assistant. Ask me anything about your finances, and I'll help you make better financial decisions.",
    welcomeMessage: "Hello! How can I help you with your finances today?",
    inputPlaceholder: "Type your question here...",
    close: "Close",
    send: "Send"
  },
  ru: {
    title: 'AI Ассистент',
    description: 'Я ваш личный финансовый помощник. Спросите меня о чем угодно касательно ваших финансов, и я помогу вам принимать лучшие финансовые решения.',
    welcomeMessage: 'Здравствуйте! Как я могу помочь вам с финансами сегодня?',
    inputPlaceholder: 'Введите ваш вопрос здесь...',
    close: 'Закрыть',
    send: 'Отправить'
  }
};

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  locale
}) => {
  const t = translations[locale] || translations.en;
  const [message, setMessage] = useState('');

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message submission
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-4 top-[10%] md:inset-auto md:top-[15%] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <BiBrain className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t.title}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                leftIcon={<IoMdClose className="w-5 h-5" />}
                aria-label={t.close}
              >
                <span className="sr-only">{t.close}</span>
              </Button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-600 dark:text-gray-300">
                  {t.description}
                </p>
              </div>

              {/* Chat interface */}
              <div className="h-64 overflow-y-auto border dark:border-gray-700 rounded-lg p-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start space-x-2">
                    <BiBrain className="w-6 h-6 text-blue-600 mt-1" />
                    <div className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-3">
                      <p className="text-gray-800 dark:text-gray-200">
                        {t.welcomeMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input form */}
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white"
                  placeholder={t.inputPlaceholder}
                />
                <Button type="submit">{t.send}</Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 