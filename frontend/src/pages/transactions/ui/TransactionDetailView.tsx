import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { 
  FiX, 
  FiAlertTriangle, 
  FiCalendar, 
  FiDollarSign,
  FiCreditCard,
  FiTag,
  FiArrowDown,
  FiArrowUp,
  FiRepeat,
  FiArrowRight,
  FiArrowLeft,
  FiRotateCw,
  FiEdit2,
  FiTrash2
} from 'react-icons/fi';
import { Locale } from '@/shared/lib/i18n';
import { Transaction } from '@/shared/api/types';

// Translations
const translations = {
  en: {
    transactionDetails: 'Transaction Details',
    close: 'Close',
    edit: 'Edit',
    delete: 'Delete',
    description: 'Description',
    amount: 'Amount',
    date: 'Date',
    category: 'Category',
    type: 'Type',
    account: 'Account',
    fromAccount: 'From Account',
    toAccount: 'To Account',
    notes: 'Notes',
    noNotes: 'No notes provided',
    deleteConfirmation: 'Are you sure you want to delete this transaction?',
    deleteWarning: 'This action cannot be undone.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    types: {
      income: 'Income',
      expense: 'Expense',
      transfer: 'Transfer',
      debt_give: 'Debt Given',
      debt_take: 'Debt Taken',
      debt_repay: 'Debt Repaid'
    }
  },
  ru: {
    transactionDetails: 'Детали транзакции',
    close: 'Закрыть',
    edit: 'Изменить',
    delete: 'Удалить',
    description: 'Описание',
    amount: 'Сумма',
    date: 'Дата',
    category: 'Категория',
    type: 'Тип',
    account: 'Счет',
    fromAccount: 'Со счета',
    toAccount: 'На счет', 
    notes: 'Заметки',
    noNotes: 'Заметки отсутствуют',
    deleteConfirmation: 'Вы уверены, что хотите удалить эту транзакцию?',
    deleteWarning: 'Это действие невозможно отменить.',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    types: {
      income: 'Доход',
      expense: 'Расход',
      transfer: 'Перевод',
      debt_give: 'Долг выдан',
      debt_take: 'Долг взят',
      debt_repay: 'Долг погашен'
    }
  }
};

interface TransactionDetailViewProps {
  /**
   * Transaction data to display
   */
  transaction: Transaction | null;
  
  /**
   * Whether the detail view is open
   */
  isOpen: boolean;
  
  /**
   * Function to call when the detail view is closed
   */
  onClose: () => void;
  
  /**
   * Function to call when the edit button is clicked
   */
  onEdit?: () => void;
  
  /**
   * Function to call when the delete button is clicked
   */
  onDelete?: () => void;
  
  /**
   * Current locale
   */
  locale: Locale;
}

export function TransactionDetailView({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  locale
}: TransactionDetailViewProps) {
  const t = translations[locale] || translations.en;
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  
  // Safeguard against null transaction
  if (!transaction) {
    return null;
  }
  
  // Handler for delete button click
  const handleDeleteClick = () => {
    setIsDeleteConfirmVisible(true);
  };
  
  // Handler for delete confirmation
  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };
  
  // Handler for delete cancellation
  const handleCancelDelete = () => {
    setIsDeleteConfirmVisible(false);
  };
  
  // Prepare transaction date (convert string to Date object)
  const transactionDate = new Date(transaction.date);
  
  // Format date string
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', options);
  };
  
  // Format amount with currency
  const formatAmount = (amount: number) => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    const formattedAmount = absAmount.toFixed(2);
    return `${isNegative ? '-' : ''}$${formattedAmount}`;
  };
  
  // Get transaction type icon
  const getTransactionTypeIcon = () => {
    switch (transaction.type) {
      case 'income':
        return <FiArrowDown className="w-6 h-6 text-success" />;
      case 'expense':
        return <FiArrowUp className="w-6 h-6 text-error" />;
      case 'transfer':
        return <FiRepeat className="w-6 h-6 text-primary-500" />;
      case 'debt_give':
        return <FiArrowRight className="w-6 h-6 text-warning" />;
      case 'debt_take':
        return <FiArrowLeft className="w-6 h-6 text-info" />;
      case 'debt_repay':
        return <FiRotateCw className="w-6 h-6 text-warning" />;
      default:
        return <FiDollarSign className="w-6 h-6" />;
    }
  };
  
  // Get transaction type text
  const getTransactionTypeText = () => {
    return t.types[transaction.type] || transaction.type;
  };
  
  // Get background color based on transaction type
  const getTypeBackgroundColor = () => {
    switch (transaction.type) {
      case 'income':
        return 'bg-success/10 text-success';
      case 'expense':
        return 'bg-error/10 text-error';
      case 'transfer':
        return 'bg-primary-100/10 text-primary-500';
      case 'debt_give':
        return 'bg-warning/10 text-warning';
      case 'debt_take':
        return 'bg-info/10 text-info';
      case 'debt_repay':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-gray-100/10 text-gray-500';
    }
  };
  
  // Get badge variant based on transaction type
  const getBadgeVariant = () => {
    switch (transaction.type) {
      case 'income': return 'success';
      case 'expense': return 'error';
      case 'transfer': return 'primary';
      case 'debt_give': 
      case 'debt_repay': return 'warning';
      case 'debt_take': return 'info';
      default: return 'secondary';
    }
  };
  
  // Get amount color class
  const getAmountColorClass = () => {
    switch (transaction.type) {
      case 'income': return 'text-success';
      case 'expense': return 'text-error';
      case 'transfer': return 'text-primary-500';
      case 'debt_give': return 'text-warning';
      case 'debt_take': return 'text-info';
      case 'debt_repay': return 'text-warning';
      default: return 'text-foreground';
    }
  };
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05
      } 
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      transition: { duration: 0.2 } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.2 } 
    }
  };
  
  const confirmationVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto', 
      marginTop: 16,
      transition: { duration: 0.2 } 
    },
    exit: { 
      opacity: 0, 
      height: 0, 
      marginTop: 0,
      transition: { duration: 0.15 } 
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={onClose}
          />
          
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <div className="w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col bg-card dark:bg-gray-800 shadow-2xl sm:rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="relative px-4 sm:px-6 py-4 border-b border-border bg-card dark:bg-gray-800/80 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold">{t.transactionDetails}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    leftIcon={<FiX />}
                    aria-label={t.close}
                  >
                    <span className="sr-only">{t.close}</span>
                  </Button>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="overflow-y-auto">
                {/* Summary Banner */}
                <motion.div 
                  className={`px-4 sm:px-8 py-6 sm:py-10 border-b border-border flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8`}
                  variants={itemVariants}
                >
                  {/* Type Icon */}
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${getTypeBackgroundColor()}`}>
                    {getTransactionTypeIcon()}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <Badge variant={getBadgeVariant()}>
                        {getTransactionTypeText()}
                      </Badge>
                      {transaction.categoryName && (
                        <Badge variant="secondary">
                          {transaction.categoryName}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1 truncate">
                      {transaction.description || 'Unnamed Transaction'}
                    </h1>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FiCalendar className="mr-1" />
                      <span>{formatDate(transactionDate)}</span>
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <div className="text-right">
                    <div className={`text-2xl sm:text-3xl font-bold ${getAmountColorClass()}`}>
                      {formatAmount(transaction.amount)}
                    </div>
                  </div>
                </motion.div>
                
                {/* Details Section */}
                <motion.div 
                  className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4"
                  variants={itemVariants}
                >
                  {/* Account Info */}
                  {transaction.type !== 'transfer' && transaction.accountName && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500">
                        <FiCreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t.account}</div>
                        <div className="font-medium">{transaction.accountName}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* From Account (for transfers) */}
                  {transaction.type === 'transfer' && transaction.fromAccountName && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500">
                        <FiArrowRight className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t.fromAccount}</div>
                        <div className="font-medium">{transaction.fromAccountName}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* To Account (for transfers) */}
                  {transaction.type === 'transfer' && transaction.toAccountName && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500">
                        <FiArrowLeft className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t.toAccount}</div>
                        <div className="font-medium">{transaction.toAccountName}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Category */}
                  {transaction.categoryName && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                        <FiTag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t.category}</div>
                        <div className="font-medium">{transaction.categoryName}</div>
                      </div>
                    </div>
                  )}
                </motion.div>
                
                {/* Notes Section */}
                <motion.div 
                  className="px-4 sm:px-8 pb-4 sm:pb-8"
                  variants={itemVariants}
                >
                  <h3 className="text-lg font-medium mb-3">{t.notes}</h3>
                  <div className="bg-card/50 dark:bg-gray-700/20 rounded-lg p-4 border border-border">
                    {transaction.description ? (
                      <p className="whitespace-pre-line text-foreground">{transaction.description}</p>
                    ) : (
                      <p className="text-muted-foreground italic">{t.noNotes}</p>
                    )}
                  </div>
                </motion.div>
                
                {/* Delete Confirmation */}
                <AnimatePresence>
                  {isDeleteConfirmVisible && (
                    <motion.div 
                      className="mx-4 sm:mx-8 mb-4 sm:mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                      variants={confirmationVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-red-500 mt-1">
                          <FiAlertTriangle size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
                            {t.deleteConfirmation}
                          </h3>
                          <p className="text-red-700 dark:text-red-400 mt-1 mb-4">
                            {t.deleteWarning}
                          </p>
                          <div className="flex justify-end gap-3">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={handleCancelDelete}
                            >
                              {t.cancel}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={handleConfirmDelete}
                            >
                              {t.confirm}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Footer with Actions */}
              <div className="px-4 sm:px-8 py-4 border-t border-border bg-card/50 dark:bg-gray-800/50 backdrop-blur-sm flex justify-end gap-3">
                {onEdit && (
                  <Button 
                    variant="outline" 
                    onClick={onEdit}
                    leftIcon={<FiEdit2 />}
                  >
                    {t.edit}
                  </Button>
                )}
                {onDelete && !isDeleteConfirmVisible && (
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteClick}
                    leftIcon={<FiTrash2 />}
                  >
                    {t.delete}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 