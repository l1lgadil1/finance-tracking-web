import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Modal */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 20 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
              exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed z-50 inset-x-4 top-[10%] md:inset-auto md:top-[15%] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 focus:outline-none"
          >
            {title && <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h2>}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 