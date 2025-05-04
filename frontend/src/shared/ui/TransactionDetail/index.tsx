import { forwardRef } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';

export interface TransactionDetailProps {
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
   * Optional notes
   */
  notes?: string;

  /**
   * Optional destination account (for transfers)
   */
  destinationAccount?: string;

  /**
   * Handler for edit button click
   */
  onEdit?: () => void;

  /**
   * Handler for delete button click
   */
  onDelete?: () => void;

  /**
   * Additional CSS class
   */
  className?: string;
}

export const TransactionDetail = forwardRef<HTMLDivElement, TransactionDetailProps>(
  ({ 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id, 
    description, 
    amount, 
    date, 
    category, 
    type, 
    account, 
    notes,
    destinationAccount,
    onEdit,
    onDelete,
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

    // Get badge variant based on category and type
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

    // Format date to localized string
    const formatDate = (date: Date) => {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Format transaction type to display format
    const formatTransactionType = (type: string) => {
      switch (type) {
        case 'income':
          return 'Income';
        case 'expense':
          return 'Expense';
        case 'transfer':
          return 'Transfer';
        case 'debt':
          return 'Debt';
        default:
          return type.charAt(0).toUpperCase() + type.slice(1);
      }
    };

    return (
      <Card ref={ref} className={className}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">{description}</h3>
            <Badge variant={getCategoryBadgeVariant(category, type)}>{category}</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Description</span>
              <span className="font-medium">{description}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Amount</span>
              <span className={`font-bold ${getAmountColorClass(type)}`}>
                {formatAmount(amount)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Date</span>
              <span>{formatDate(date)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Category</span>
              <span>{category}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Type</span>
              <span>{formatTransactionType(type)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Account</span>
              <span>{account || '-'}</span>
            </div>
            
            {type === 'transfer' && destinationAccount && (
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Destination Account</span>
                <span>{destinationAccount}</span>
              </div>
            )}
            
            {notes && (
              <div className="flex flex-col py-2">
                <span className="text-muted-foreground mb-1">Notes</span>
                <p className="text-foreground bg-card-hover p-3 rounded-md">{notes}</p>
              </div>
            )}
          </div>
        </CardBody>
        
        {(onEdit || onDelete) && (
          <CardFooter>
            <div className="flex justify-end gap-2">
              {onDelete && (
                <Button variant="outline" onClick={onDelete}>Delete</Button>
              )}
              {onEdit && (
                <Button variant="primary" onClick={onEdit}>Edit</Button>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    );
  }
);

TransactionDetail.displayName = 'TransactionDetail'; 