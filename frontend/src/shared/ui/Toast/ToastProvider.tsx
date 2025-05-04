import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastContainer, ToastVariant } from './index';

// Define type for a toast item
interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
}

// Define the toast context
interface ToastContextType {
  toast: (props: Omit<ToastItem, 'id'>) => string;
  remove: (id: string) => void;
  removeAll: () => void;
}

// Create the toast context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider props interface
interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Generate a unique ID for each toast
  const generateId = () => `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Add a new toast
  const toast = useCallback((props: Omit<ToastItem, 'id'>) => {
    const id = generateId();
    setToasts((prevToasts) => [...prevToasts, { ...props, id }]);
    return id;
  }, []);

  // Remove a toast by ID
  const remove = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Remove all toasts
  const removeAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Create value for the context
  const contextValue = { toast, remove, removeAll };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.length > 0 && (
        <ToastContainer position={position}>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              title={toast.title}
              description={toast.description}
              variant={toast.variant}
              duration={toast.duration}
              onClose={() => {
                toast.onClose?.();
                remove(toast.id);
              }}
            />
          ))}
        </ToastContainer>
      )}
    </ToastContext.Provider>
  );
};

// Custom hook for using the toast context
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

// Convenience methods for different toast types
export const useToastMethods = () => {
  const { toast } = useToast();
  
  return {
    success: (props: Omit<ToastItem, 'id' | 'variant'>) => 
      toast({ ...props, variant: 'success' }),
      
    error: (props: Omit<ToastItem, 'id' | 'variant'>) => 
      toast({ ...props, variant: 'error' }),
      
    warning: (props: Omit<ToastItem, 'id' | 'variant'>) => 
      toast({ ...props, variant: 'warning' }),
      
    info: (props: Omit<ToastItem, 'id' | 'variant'>) => 
      toast({ ...props, variant: 'info' }),
  };
}; 