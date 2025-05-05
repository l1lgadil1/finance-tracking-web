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
  category?: string;
  
  /**
   * Transaction category name
   */
  categoryName?: string;

  /**
   * Transaction type (income, expense, transfer, debt_give, debt_take, debt_repay)
   */
  type: 'income' | 'expense' | 'transfer' | 'debt_give' | 'debt_take' | 'debt_repay';

  /**
   * Optional account name
   */
  account?: string;
  
  /**
   * Optional account name from API
   */
  accountName?: string;
  
  /**
   * Optional from account name
   */
  fromAccountName?: string;
  
  /**
   * Optional to account name
   */
  toAccountName?: string;

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
    categoryName, 
    type, 
    account, 
    accountName, 
    fromAccountName, 
    toAccountName,
    onClick,
    className = '' 
  }, ref) => {
    // Format amount to display format with currency symbol
    const formatAmount = (amount: number) => {
      const isNegative = amount < 0;
      const absAmount = Math.abs(amount);
      const formattedAmount = absAmount.toFixed(2);
      return `${isNegative ? '-' : ''}$${formattedAmount}`;
    };

    // Format date to a more readable format
    const formatDate = (date: Date) => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        // Format: Jan 1 or Jan 1, 2023 (if different year)
        const options: Intl.DateTimeFormatOptions = 
          date.getFullYear() === today.getFullYear()
            ? { month: 'short', day: 'numeric' }
            : { month: 'short', day: 'numeric', year: 'numeric' };
        
        return date.toLocaleDateString(undefined, options);
      }
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
        case 'debt_give':
          return 'text-warning';
        case 'debt_take':
          return 'text-info';
        case 'debt_repay':
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
      if (type === 'debt_give') return 'warning';
      if (type === 'debt_take') return 'info';
      if (type === 'debt_repay') return 'warning';
      
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
          return '↓'; // Downward arrow (money coming in)
        case 'expense':
          return '↑'; // Upward arrow (money going out)
        case 'transfer':
          return '⇄'; // Two-way arrow (transfer between accounts)
        case 'debt_give':
          return '→'; // Rightward arrow (giving money)
        case 'debt_take':
          return '←'; // Leftward arrow (taking money)
        case 'debt_repay':
          return '⟲'; // Circular arrow (repaying debt)
        default:
          return '•';
      }
    };

    const getTransactionIconBg = (type: string) => {
      switch (type) {
        case 'income':
          return 'bg-success/15';
        case 'expense':
          return 'bg-error/15';
        case 'transfer':
          return 'bg-primary-100/50 dark:bg-primary-900/50';
        case 'debt_give':
          return 'bg-warning/15';
        case 'debt_take':
          return 'bg-info/15';
        case 'debt_repay':
          return 'bg-warning/15';
        default:
          return 'bg-muted';
      }
    };

    // Get descriptive transaction label based on type
    const getTransactionTypeLabel = () => {
      switch (type) {
        case 'income':
          return 'Income';
        case 'expense':
          return 'Expense';
        case 'transfer':
          return 'Transfer';
        case 'debt_give':
          return 'Debt Given';
        case 'debt_take':
          return 'Debt Taken';
        case 'debt_repay':
          return 'Debt Repaid';
        default:
          return '';
      }
    };

    // Generate account display text based on transaction type
    const getAccountDisplay = () => {
      if (type === 'transfer' && fromAccountName && toAccountName) {
        return (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="font-medium">{fromAccountName}</span>
            <span className="mx-1">→</span>
            <span className="font-medium">{toAccountName}</span>
          </div>
        );
      }
      
      if (accountName) {
        return <span className="text-sm text-muted-foreground">{accountName}</span>;
      }
      
      if (account) {
        return <span className="text-sm text-muted-foreground">{account}</span>;
      }
      
      return null;
    };

    return (
      <motion.div
        ref={ref}
        whileHover={onClick ? { scale: 1.01 } : undefined}
        whileTap={onClick ? { scale: 0.99 } : undefined}
        className={`w-full ${className}`}
      >
        <Card 
          className={`overflow-hidden hover:shadow-md hover:bg-card-hover transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
          onClick={onClick}
        >
          <div className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTransactionIconBg(type)} shrink-0`}>
                  <span className={`text-xl ${getAmountColorClass(type)}`}>
                    {getTransactionIcon(type)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-foreground truncate">{description}</p>
                    <Badge 
                      variant={getCategoryBadgeVariant(categoryName || category || '', type)} 
                      className="ml-auto shrink-0"
                    >
                      {categoryName || category || getTransactionTypeLabel()}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-muted-foreground">
                    <p className="text-sm">
                      {formatDate(date)}
                    </p>
                    {getAccountDisplay() && (
                      <>
                        <span className="hidden sm:inline text-muted-foreground">•</span>
                        {getAccountDisplay()}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className={`font-bold text-lg ${getAmountColorClass(type)}`}>
                  {formatAmount(amount)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }
);

TransactionCard.displayName = 'TransactionCard'; 