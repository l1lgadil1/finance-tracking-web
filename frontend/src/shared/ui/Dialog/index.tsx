import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Button';
import { X as CloseIcon } from 'lucide-react';

export interface DialogProps {
  /**
   * Whether the dialog is currently visible
   */
  isOpen: boolean;
  
  /**
   * Function called when the dialog is closed
   */
  onClose: () => void;
  
  /**
   * Dialog title
   */
  title: string;
  
  /**
   * Dialog content
   */
  children: ReactNode;
  
  /**
   * Custom footer content. If not provided, default action buttons will be shown
   */
  footer?: ReactNode;
  
  /**
   * Text for the primary action button
   */
  primaryActionText?: string;
  
  /**
   * Handler for primary action button click
   */
  onPrimaryAction?: () => void;
  
  /**
   * Whether the primary action button should show loading state
   */
  isPrimaryActionLoading?: boolean;
  
  /**
   * Whether the dialog can be closed by clicking outside or pressing Escape
   */
  isDismissable?: boolean;
  
  /**
   * Size of the dialog
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Additional class name
   */
  className?: string;
}

export const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  primaryActionText = 'Confirm',
  onPrimaryAction,
  isPrimaryActionLoading = false,
  isDismissable = true,
  size = 'md',
  className = '',
}: DialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && isDismissable) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isDismissable]);
  
  // Size classes mapping
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };
  
  // Prevent clicks inside dialog from closing it
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Generate default footer if custom one is not provided
  const renderFooter = () => {
    if (footer) {
      return footer;
    }
    
    return (
      <div className="flex justify-end gap-3">
        <Button 
          variant="ghost" 
          onClick={onClose}
          disabled={isPrimaryActionLoading}
        >
          Cancel
        </Button>
        
        {onPrimaryAction && (
          <Button 
            variant="primary" 
            onClick={onPrimaryAction}
            isLoading={isPrimaryActionLoading}
          >
            {primaryActionText}
          </Button>
        )}
      </div>
    );
  };
  
  // Only render the portal when the dialog is open
  if (typeof window === 'undefined') {
    return null;
  }
  
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={isDismissable ? onClose : undefined}
        >
          <motion.div
            ref={dialogRef}
            className={`bg-card w-full rounded-lg shadow-theme overflow-hidden ${sizeClasses[size]} ${className}`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={handleDialogClick}
          >
            <div className="flex justify-between items-center border-b border-border p-4">
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              {isDismissable && (
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors"
                  aria-label="Close dialog"
                >
                  <CloseIcon size={20} />
                </button>
              )}
            </div>
            
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
            
            <div className="border-t border-border p-4">
              {renderFooter()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}; 