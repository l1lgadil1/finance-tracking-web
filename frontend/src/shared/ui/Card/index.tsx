import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  bordered?: boolean;
  onClick?: () => void;
}

export const Card = ({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  onClick,
}: CardProps) => {
  const baseStyles = 'bg-card rounded-lg overflow-hidden transition-all duration-200';
  const borderStyles = bordered ? 'border border-border' : '';
  const hoverStyles = hoverable ? 'hover:shadow-md hover:translate-y-[-2px]' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      className={`${baseStyles} ${borderStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      whileHover={hoverable ? { y: -2 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return (
    <div className={`p-4 border-b border-border ${className}`}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody = ({ children, className = '' }: CardBodyProps) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return (
    <div className={`p-4 border-t border-border ${className}`}>
      {children}
    </div>
  );
}; 