import React, { createContext, useContext, ReactNode, forwardRef, HTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

// Context for Tabs state
type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
};

// Base Tabs component
interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export const Tabs = ({ value, onValueChange, children, className = '' }: TabsProps) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={`tabs ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

// Tabs List component
const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
  {
    variants: {
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      fullWidth: false,
    },
  }
);

interface TabsListProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof tabsListVariants> {
  children: ReactNode;
  className?: string;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className = '', fullWidth, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={tabsListVariants({ fullWidth, className })}
        role="tablist" 
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsList.displayName = "TabsList";

// Tabs Trigger component
const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
  {
    variants: {
      fullWidth: {
        true: "flex-1",
      },
    },
    defaultVariants: {
      fullWidth: false,
    },
  }
);

interface TabsTriggerProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'value'>, VariantProps<typeof tabsTriggerVariants> {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ children, value, className = '', fullWidth, disabled = false, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useTabs();
    const isSelected = selectedValue === value;
    
    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isSelected}
        data-state={isSelected ? 'active' : 'inactive'}
        className={tabsTriggerVariants({ fullWidth, className })}
        disabled={disabled}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {children}
        {isSelected && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-background dark:bg-gray-800 rounded-sm z-[-1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </button>
    );
  }
);

TabsTrigger.displayName = "TabsTrigger";

// Tabs Content component
interface TabsContentProps extends Omit<HTMLMotionProps<"div">, "value"> {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ children, value, className = '', ...props }, ref) => {
    const { value: selectedValue } = useTabs();
    const isSelected = selectedValue === value;
    
    if (!isSelected) return null;
    
    return (
      <motion.div
        ref={ref}
        role="tabpanel"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={`mt-2 ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

TabsContent.displayName = "TabsContent"; 