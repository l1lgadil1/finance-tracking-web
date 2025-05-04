import { ReactNode, forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiInfo, FiCheckCircle, FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;  // in milliseconds
  showClose?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
}

// Map variants to their respective icons and styles
const variantMap = {
  info: {
    icon: FiInfo,
    bgColor: 'bg-info-light',
    textColor: 'text-info',
    borderColor: 'border-info',
  },
  success: {
    icon: FiCheckCircle,
    bgColor: 'bg-success-light',
    textColor: 'text-success',
    borderColor: 'border-success',
  },
  warning: {
    icon: FiAlertTriangle,
    bgColor: 'bg-warning-light',
    textColor: 'text-warning',
    borderColor: 'border-warning',
  },
  error: {
    icon: FiAlertCircle,
    bgColor: 'bg-error-light',
    textColor: 'text-error',
    borderColor: 'border-error',
  },
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ 
    title, 
    description, 
    variant = 'info', 
    duration = 5000,
    showClose = true,
    onClose,
    children,
    className = '',
  }, ref) => {
    const [isVisible, setIsVisible] = useState(true);
    const { icon: Icon, bgColor, textColor, borderColor } = variantMap[variant];

    // Auto-dismiss toast after duration
    useEffect(() => {
      if (duration === 0) return;

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Allow exit animation to complete
    };

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`${bgColor} border-l-4 ${borderColor} rounded-md shadow-md p-4 flex max-w-md ${className}`}
            role="alert"
            aria-live="assertive"
          >
            <div className={`flex-shrink-0 ${textColor} mr-3 mt-0.5`}>
              <Icon size={20} />
            </div>
            
            <div className="flex-grow">
              {title && (
                <h3 className="font-medium text-foreground mb-1">{title}</h3>
              )}
              
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
              
              {children}
            </div>
            
            {showClose && (
              <button 
                className="flex-shrink-0 ml-3 text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleClose}
                aria-label="Close notification"
              >
                <FiX size={18} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Toast.displayName = 'Toast';

// Toast container for multiple toasts
export interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
  children: ReactNode;
}

const positionStyles = {
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2',
};

export const ToastContainer = ({ 
  position = 'top-right', 
  className = '',
  children 
}: ToastContainerProps) => {
  return (
    <div 
      className={`fixed z-50 p-4 flex flex-col gap-3 ${positionStyles[position]} ${className}`}
      aria-live="polite"
    >
      {children}
    </div>
  );
};

// ToastProvider and useToast hook will be implemented separately 