import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  "bg-card text-card-foreground rounded-lg overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border border-border shadow-sm",
        secondary: "bg-card-secondary border border-border shadow-sm",
        outline: "border border-border bg-transparent",
        ghost: "border-0 bg-transparent shadow-none",
      },
      hoverable: {
        true: "hover:shadow-md hover:translate-y-[-2px]",
      },
    },
    defaultVariants: {
      variant: "default",
      hoverable: false,
    },
  }
);

interface CardProps 
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

// Create a specialized motion component type for div
type MotionDivType = typeof motion.div;

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    className = '', 
    variant,
    hoverable,
    onClick,
    ...props
  }, ref) => {
    // Define motion props separately
    const motionProps = {
      whileHover: hoverable ? { y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' } : undefined,
      initial: { opacity: 0, y: 5 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.2, ease: "easeOut" },
    };

    const clickableStyles = onClick ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2' : '';
    
    // Define accessibility props separately
    const accessibilityProps = onClick ? { 
      tabIndex: 0, 
      role: "button",
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }
    } : {};

    return (
      <motion.div
        ref={ref}
        className={`${cardVariants({ variant, hoverable, className })} ${clickableStyles}`}
        onClick={onClick}
        {...motionProps}
        {...accessibilityProps}
        {...props as React.ComponentProps<MotionDivType>}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={`p-4 border-b border-border flex items-center justify-between ${className}`} 
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`p-4 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = "CardBody";

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={`p-4 border-t border-border ${className}`} 
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardBody, CardFooter, cardVariants }; 