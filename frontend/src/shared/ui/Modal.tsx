import React, { useEffect, useRef, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { FiX } from 'react-icons/fi';

const modalVariants = cva(
  "fixed z-50 rounded-xl bg-card text-card-foreground focus:outline-none overflow-hidden",
  {
    variants: {
      size: {
        sm: "w-full max-w-sm",
        md: "w-full max-w-md",
        lg: "w-full max-w-lg",
        xl: "w-full max-w-xl",
        '2xl': "w-full max-w-2xl",
        full: "w-full max-w-full",
      },
      position: {
        center: "inset-x-4 top-[50%] -translate-y-[50%] md:inset-auto md:top-[50%] md:left-1/2 md:-translate-x-1/2 md:-translate-y-[50%]",
        top: "inset-x-4 top-[10%] md:inset-auto md:top-[10%] md:left-1/2 md:-translate-x-1/2",
      },
    },
    defaultVariants: {
      size: "md",
      position: "center",
    },
  }
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  position?: 'center' | 'top';
  showCloseButton?: boolean;
  /** Called after the modal has closed completely */
  onClosed?: () => void;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size,
  position,
  showCloseButton = true,
  onClosed,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);

  // Save the currently focused element when opening
  useEffect(() => {
    if (isOpen && document.activeElement instanceof HTMLElement) {
      lastActiveElement.current = document.activeElement;
    }
  }, [isOpen]);

  // Focus modal when opened and restore focus after closing
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
    return () => {
      if (lastActiveElement.current) {
        lastActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence onExitComplete={onClosed}>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
            aria-hidden="true"
            transition={{ duration: 0.2 }}
          />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            key="modal"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 20 },
              visible: { 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                transition: { 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30, 
                  delay: 0.1,
                } 
              },
              exit: { 
                opacity: 0, 
                scale: 0.95, 
                y: 20, 
                transition: { 
                  duration: 0.2, 
                  ease: 'easeInOut',
                } 
              },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${modalVariants({ size, position })} ${className} shadow-lg`}
          >
            {/* Close button */}
            {showCloseButton && (
              <button
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <FiX size={18} />
              </button>
            )}
            
            {/* Content */}
            <div className="p-6">
              {title && (
                <h2 
                  id="modal-title" 
                  className="text-lg font-semibold mb-4 text-foreground pr-8"
                >
                  {title}
                </h2>
              )}
              
              <div className={!title ? "pt-2" : ""}>
                {children}
              </div>
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}; 