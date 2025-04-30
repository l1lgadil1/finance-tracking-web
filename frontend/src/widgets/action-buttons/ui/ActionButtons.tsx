import React from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/Button';
import { BiBrain } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';
import { AIAssistantModal } from '@/features/ai-assistant/ui/AIAssistantModal';
import { TransactionModal } from '@/features/transaction/ui/TransactionModal';

interface ActionButtonsProps {
  locale: Locale;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ locale }) => {
  const [isAIModalOpen, setIsAIModalOpen] = React.useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = React.useState(false);

  return (
    <>
      {/* Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        {/* AI Assistant Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            onClick={() => setIsAIModalOpen(true)}
            aria-label="Open AI Assistant"
          >
            <BiBrain className="w-7 h-7 text-white" />
          </Button>
        </motion.div>

        {/* Add Transaction Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            onClick={() => setIsTransactionModalOpen(true)}
            aria-label="Add Transaction"
          >
            <IoMdAdd className="w-8 h-8 text-white" />
          </Button>
        </motion.div>
      </div>

      {/* Modals */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        locale={locale}
      />

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        locale={locale}
      />
    </>
  );
}; 