import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../Badge';
import { Card } from '../Card';

export interface TransactionCardProps {
  /**
   * Transaction ID
   */
  id: string;

  /**
   * Transaction description
   */
  description: string;

  /**
   * Transaction amount in cents (e.g., 1050 for $10.50)
   */
  amount: number;

  /**
   * Transaction date
   */
  date: Date;

  /**
   * Transaction category
   */
  category: string;

  /**
   * Transaction type (income, expense, transfer, debt)
   */
  type: 'income' | 'expense' | 'transfer' | 'debt';

  /**
   * Optional account name
   */
  account?: string;

  /**
   * Whether the card is clickable
   */
  onClick?: () => void;

  /**
   * Additional CSS class
   */
  className?: string;
}

export const TransactionCard = forwardRef<HTMLDivElement, TransactionCardProps>(
  ({ 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id, 
    description, 
    amount, 
    date, 
    category, 
    type, 
    account, 
    onClick,
    className = '' 
  }, ref) => {
    // Format amount to display format with currency symbol
    const formatAmount = (amount: number) => {
      const isNegative = amount < 0;
      const absAmount = Math.abs(amount);
      const formattedAmount = (absAmount / 100).toFixed(2);
      return `${isNegative ? '-' : ''}$${formattedAmount}`;
    };

    // Get amount color class based on transaction type
    const getAmountColorClass = (type: string) => {
      switch (type) {
        case 'income':
          return 'text-success';
        case 'expense':
          return 'text-error';
        case 'transfer':
          return 'text-primary-500';
        case 'debt':
          return 'text-warning';
        default:
          return 'text-foreground';
      }
    };

    // Get badge variant based on category
    const getCategoryBadgeVariant = (category: string, type: string) => {
      if (type === 'income') return 'success';
      if (type === 'expense') return 'error';
      if (type === 'transfer') return 'primary';
      if (type === 'debt') return 'warning';
      
      // Fallback to default mapping
      switch (category.toLowerCase()) {
        case 'food':
        case 'groceries':
        case 'dining':
          return 'warning';
        case 'income':
        case 'salary':
        case 'bonus':
          return 'success';
        case 'housing':
        case 'rent':
        case 'mortgage':
          return 'error';
        case 'transfer':
          return 'primary';
        case 'debt':
        case 'loan':
          return 'warning';
        default:
          return 'secondary';
      }
    };

    // Get icon based on transaction type
    const getTransactionIcon = (type: string) => {
      switch (type) {
        case 'income':
          return '↓';
        case 'expense':
          return '↑';
        case 'transfer':
          return '↔';
        case 'debt':
          return '⇄';
        default:
          return '•';
      }
    };

    const getTransactionIconBg = (type: string) => {
      switch (type) {
        case 'income':
          return 'bg-success/10';
        case 'expense':
          return 'bg-error/10';
        case 'transfer':
          return 'bg-primary-100 dark:bg-primary-900';
        case 'debt':
          return 'bg-warning/10';
        default:
          return 'bg-muted';
      }
    };

    return (
      <motion.div
        ref={ref}
        whileHover={onClick ? { scale: 1.01 } : undefined}
        whileTap={onClick ? { scale: 0.99 } : undefined}
        className={`w-full ${className}`}
      >
        <Card 
          className={`overflow-hidden hover:bg-card-hover transition-colors ${onClick ? 'cursor-pointer' : ''}`}
          onClick={onClick}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionIconBg(type)}`}>
                  <span className={`text-lg ${getAmountColorClass(type)}`}>
                    {getTransactionIcon(type)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{description}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {date.toLocaleDateString()}
                    </p>
                    {account && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">{account}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className={`font-bold ${getAmountColorClass(type)}`}>
                  {formatAmount(amount)}
                </p>
                <Badge variant={getCategoryBadgeVariant(category, type)} className="mt-1">
                  {category}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }
);

TransactionCard.displayName = 'TransactionCard'; 