import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody, CardFooter } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { 
  FiEdit2, 
  FiTrash2, 
  FiCalendar, 
  FiDollarSign, 
  FiTag, 
  FiCreditCard, 
  FiArrowRight, 
  FiArrowLeft, 
  FiRotateCw, 
  FiFileText, 
  FiRepeat, 
  FiArrowUp, 
  FiArrowDown 
} from 'react-icons/fi';
import { Locale } from '@/shared/lib/i18n';
import { useTransactionDetail, transactionDetailTranslations } from './useTransactionDetail';

// Type definitions
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
   * Optional from account name for transfers
   */
  fromAccountName?: string;
  
  /**
   * Optional to account name for transfers
   */
  toAccountName?: string;

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

  /**
   * Locale for internationalization
   */
  locale?: Locale;
}

// Export translations for external use
export { transactionDetailTranslations };

export const TransactionDetail = forwardRef<HTMLDivElement, TransactionDetailProps>(
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
    notes,
    destinationAccount,
    onEdit,
    onDelete,
    className = '',
    locale = 'en'
  }, ref) => {
    // Use our custom hook to extract business logic
    const {
      t,
      formattedAmount,
      amountColorClass,
      categoryBadgeVariant,
      formattedDate,
      transactionTypeLabel,
      transactionIconBg,
      borderTopColor,
      animations
    } = useTransactionDetail({
      type,
      amount,
      date,
      category: categoryName || category || '',
      locale
    });

    // Get transaction type icon
    const getTransactionTypeIcon = () => {
      switch (type) {
        case 'income':
          return <FiArrowDown className="text-success" />;
        case 'expense':
          return <FiArrowUp className="text-error" />;
        case 'transfer':
          return <FiRepeat className="text-primary-500" />;
        case 'debt_give':
          return <FiArrowRight className="text-warning" />;
        case 'debt_take':
          return <FiArrowLeft className="text-info" />;
        case 'debt_repay':
          return <FiRotateCw className="text-warning" />;
        default:
          return <FiDollarSign />;
      }
    };

    return (
      <motion.div
        ref={ref}
        className={`${className} overflow-hidden`}
        initial="hidden"
        animate="visible"
        variants={animations.cardVariants}
      >
        <Card className="overflow-hidden border-t-4 shadow-lg dark:shadow-gray-800/10" 
          style={{ borderTopColor }}
        >
          {/* Header */}
          <CardHeader className="relative p-6 bg-card dark:bg-gray-800/50">
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              variants={animations.itemVariants}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transactionIconBg}`}>
                  <span className="text-xl">{getTransactionTypeIcon()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-foreground truncate">{description}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={categoryBadgeVariant}
                      className="mr-2"
                    >
                      {categoryName || category || transactionTypeLabel}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{formattedDate}</span>
                  </div>
                </div>
              </div>
              <motion.div 
                className={`text-2xl font-bold ${amountColorClass} md:text-right whitespace-nowrap`}
                variants={animations.itemVariants}
              >
                {formattedAmount}
              </motion.div>
            </motion.div>
          </CardHeader>

          {/* Body */}
          <CardBody className="p-0">
            <div className="divide-y divide-border">
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0 p-6">
                {/* Transaction Type */}
                <motion.div 
                  className="flex items-center py-3 gap-3"
                  variants={animations.itemVariants}
                >
                  <div className="flex items-center gap-2 text-muted-foreground min-w-[120px]">
                    <FiTag className="w-4 h-4" />
                    <span>{t.type}</span>
                  </div>
                  <span className="font-medium">{transactionTypeLabel}</span>
                </motion.div>

                {/* Category */}
                <motion.div 
                  className="flex items-center py-3 gap-3"
                  variants={animations.itemVariants}
                >
                  <div className="flex items-center gap-2 text-muted-foreground min-w-[120px]">
                    <FiTag className="w-4 h-4" />
                    <span>{t.category}</span>
                  </div>
                  <span className="font-medium">{categoryName || category || '-'}</span>
                </motion.div>

                {/* Date */}
                <motion.div 
                  className="flex items-center py-3 gap-3"
                  variants={animations.itemVariants}
                >
                  <div className="flex items-center gap-2 text-muted-foreground min-w-[120px]">
                    <FiCalendar className="w-4 h-4" />
                    <span>{t.date}</span>
                  </div>
                  <span className="font-medium">{formattedDate}</span>
                </motion.div>

                {/* Account */}
                {(type !== 'transfer' && (accountName || account)) && (
                  <motion.div 
                    className="flex items-center py-3 gap-3"
                    variants={animations.itemVariants}
                  >
                    <div className="flex items-center gap-2 text-muted-foreground min-w-[120px]">
                      <FiCreditCard className="w-4 h-4" />
                      <span>{t.account}</span>
                    </div>
                    <span className="font-medium">{accountName || account}</span>
                  </motion.div>
                )}

                {/* From Account (for transfers) */}
                {(type === 'transfer' && fromAccountName) && (
                  <motion.div 
                    className="flex items-center py-3 gap-3"
                    variants={animations.itemVariants}
                  >
                    <div className="flex items-center gap-2 text-muted-foreground min-w-[120px]">
                      <FiArrowRight className="w-4 h-4" />
                      <span>{t.fromAccount}</span>
                    </div>
                    <span className="font-medium">{fromAccountName}</span>
                  </motion.div>
                )}

                {/* To Account (for transfers) */}
                {(type === 'transfer' && (toAccountName || destinationAccount)) && (
                  <motion.div 
                    className="flex items-center py-3 gap-3"
                    variants={animations.itemVariants}
                  >
                    <div className="flex items-center gap-2 text-muted-foreground min-w-[120px]">
                      <FiArrowLeft className="w-4 h-4" />
                      <span>{t.toAccount}</span>
                    </div>
                    <span className="font-medium">{toAccountName || destinationAccount}</span>
                  </motion.div>
                )}
              </div>

              {/* Notes Section */}
              {(notes || true) && (
                <motion.div 
                  className="p-6 bg-card/50 dark:bg-gray-800/25"
                  variants={animations.itemVariants}
                >
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <FiFileText className="w-4 h-4" />
                    <span>{t.notes}</span>
                  </div>
                  <p className="text-foreground whitespace-pre-line">
                    {notes || <span className="text-muted-foreground italic">{t.noNotes}</span>}
                  </p>
                </motion.div>
              )}
            </div>
          </CardBody>

          {/* Footer with actions */}
          {(onEdit || onDelete) && (
            <CardFooter className="p-4 flex justify-end gap-3 bg-card dark:bg-gray-800/50">
              {onEdit && (
                <motion.div variants={animations.buttonVariants}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onEdit}
                    leftIcon={<FiEdit2 />}
                  >
                    {t.edit}
                  </Button>
                </motion.div>
              )}
              {onDelete && (
                <motion.div variants={animations.buttonVariants}>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={onDelete}
                    leftIcon={<FiTrash2 />}
                  >
                    {t.delete}
                  </Button>
                </motion.div>
              )}
            </CardFooter>
          )}
        </Card>
      </motion.div>
    );
  }
);

TransactionDetail.displayName = 'TransactionDetail'; 