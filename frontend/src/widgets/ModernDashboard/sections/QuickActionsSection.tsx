import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardHeader, CardBody } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { PlusCircle, Target, TrendingUp, TrendingDown, CreditCard, ArrowUpRight, BarChart4 } from 'lucide-react';
import Link from 'next/link';
import { TransactionModal } from '@/features/transaction/ui/TransactionModal';
import { TransactionType } from '@/shared/constants/finance';

const quickActionsTranslations = {
  en: {
    quickActions: 'Quick Actions',
    addGoal: 'Add Goal',
    addIncome: 'Add Income',
    addExpense: 'Add Expense',
    addAccount: 'Add Account',
    addTransfer: 'Add Transfer',
    addBudget: 'Add Budget',
    viewMore: 'More Actions',
  },
  ru: {
    quickActions: 'Быстрые действия',
    addGoal: 'Добавить цель',
    addIncome: 'Добавить доход',
    addExpense: 'Добавить расход',
    addAccount: 'Добавить счет',
    addTransfer: 'Добавить перевод',
    addBudget: 'Добавить бюджет',
    viewMore: 'Больше действий',
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

// Button hover animations
const buttonVariants = {
  hover: { 
    y: -5,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 15
    }
  }
};

interface QuickActionsSectionProps {
  locale: Locale;
  onActionClick?: (action: string) => void;
  onDataRefresh?: () => Promise<void>;
}

export const QuickActionsSection: FC<QuickActionsSectionProps> = ({ 
  locale, 
  onActionClick = () => {},
  onDataRefresh
}) => {
  const t = quickActionsTranslations[locale] || quickActionsTranslations.en;
  const [modalState, setModalState] = useState<null | TransactionType>(null);
  
  // Quick action handlers
  const handleAddGoal = () => onActionClick('addGoal');
  const handleAddIncome = () => setModalState(TransactionType.INCOME);
  const handleAddExpense = () => setModalState(TransactionType.EXPENSE);
  const handleAddAccount = () => onActionClick('addAccount');
  const handleAddTransfer = () => setModalState(TransactionType.TRANSFER);
  const handleAddBudget = () => onActionClick('addBudget');
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <CardHeader className="flex justify-between items-center pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary-100 dark:bg-primary-900/30 w-8 h-8 rounded-full flex items-center justify-center">
            <PlusCircle className="text-primary-600 dark:text-primary-400" size={18} />
          </div>
          <h2 className="text-xl font-semibold">{t.quickActions}</h2>
        </div>
        <Link href="#" passHref>
          <Button variant="ghost" size="sm" className="group">
            {t.viewMore}
            <ArrowUpRight size={14} className="ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardBody className="pt-3">
        <motion.div 
          className="grid grid-cols-1 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Primary actions row */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <motion.div whileHover="hover" variants={buttonVariants}>
              <Button 
                variant="primary" 
                onClick={handleAddGoal}
                className="w-full flex items-center justify-center gap-2 py-6 font-medium transition-all"
              >
                <Target className="h-6 w-6" />
                <span>{t.addGoal}</span>
              </Button>
            </motion.div>
            
            <motion.div whileHover="hover" variants={buttonVariants}>
              <Button 
                variant="secondary" 
                onClick={handleAddIncome}
                className="w-full flex items-center justify-center gap-2 py-6 font-medium bg-green-600 hover:bg-green-700 text-white border-0 transition-all"
              >
                <TrendingUp className="h-6 w-6" />
                <span>{t.addIncome}</span>
              </Button>
            </motion.div>
            
            <motion.div whileHover="hover" variants={buttonVariants}>
              <Button 
                variant="destructive" 
                onClick={handleAddExpense}
                className="w-full flex items-center justify-center gap-2 py-6 font-medium transition-all"
              >
                <TrendingDown className="h-6 w-6" />
                <span>{t.addExpense}</span>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Secondary actions row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <motion.div whileHover="hover" variants={buttonVariants}>
              <Button 
                variant="outline" 
                onClick={handleAddAccount}
                className="w-full flex items-center justify-center gap-2 py-4 text-sm transition-all"
              >
                <CreditCard size={18} />
                <span>{t.addAccount}</span>
              </Button>
            </motion.div>
            
            <motion.div whileHover="hover" variants={buttonVariants}>
              <Button 
                variant="outline" 
                onClick={handleAddTransfer}
                className="w-full flex items-center justify-center gap-2 py-4 text-sm transition-all"
              >
                <ArrowUpRight size={18} />
                <span>{t.addTransfer}</span>
              </Button>
            </motion.div>
            
            <motion.div whileHover="hover" variants={buttonVariants}>
              <Button 
                variant="outline" 
                onClick={handleAddBudget}
                className="w-full flex items-center justify-center gap-2 py-4 text-sm transition-all"
              >
                <BarChart4 size={18} />
                <span>{t.addBudget}</span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </CardBody>
      {/* Transaction Modals for quick actions */}
      {modalState && (
        <TransactionModal
          isOpen={!!modalState}
          onClose={() => setModalState(null)}
          locale={locale}
          defaultTransactionType={modalState}
          onSuccess={async () => {
            setModalState(null);
            if (onDataRefresh) await onDataRefresh();
          }}
        />
      )}
    </Card>
  );
}; 