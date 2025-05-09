import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody } from '@/shared/ui/Card';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { Badge } from '@/shared/ui/Badge';
import { Goal, GoalStatus } from '@/store/goals-store';
import { Locale } from '@/shared/lib/i18n';

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  locale: Locale;
}

const goalCardTranslations = {
  en: {
    status: {
      ongoing: 'Ongoing',
      completed: 'Completed',
      paused: 'Paused'
    },
    category: {
      savings: 'Savings',
      debt: 'Debt',
      investment: 'Investment',
      purchase: 'Purchase',
      emergency: 'Emergency',
      other: 'Other'
    },
    progress: 'Progress',
    of: 'of',
    dueDateLabel: 'Target date',
    noTargetDate: 'No target date',
    edit: 'Edit',
    delete: 'Delete'
  },
  ru: {
    status: {
      ongoing: 'В процессе',
      completed: 'Завершено',
      paused: 'Приостановлено'
    },
    category: {
      savings: 'Сбережения',
      debt: 'Долги',
      investment: 'Инвестиции',
      purchase: 'Покупка',
      emergency: 'Чрезвычайный',
      other: 'Другое'
    },
    progress: 'Прогресс',
    of: 'из',
    dueDateLabel: 'Целевая дата',
    noTargetDate: 'Без целевой даты',
    edit: 'Изменить',
    delete: 'Удалить'
  }
};

export const GoalCard: FC<GoalCardProps> = ({ goal, onClick, onEdit, onDelete, locale }) => {
  const t = goalCardTranslations[locale] || goalCardTranslations.en;
  
  const progressPercentage = goal.target > 0 
    ? Math.min(Math.round((goal.saved / goal.target) * 100), 100) 
    : 0;
  
  const getStatusVariant = (status: GoalStatus) => {
    switch (status) {
      case 'completed': return 'success';
      case 'ongoing': return 'primary';
      case 'paused': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'savings': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'debt': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'investment': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'purchase': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'emergency': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDueDate = (date?: Date) => {
    if (!date) return t.noTargetDate;
    
    return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(new Date(date));
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card 
        className="h-full cursor-pointer hover:shadow-md transition-shadow duration-200"
        onClick={onClick}
        style={{ borderLeft: goal.colorHex ? `5px solid ${goal.colorHex}` : undefined }}
      >
        <CardBody className="flex flex-col h-full p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{goal.title}</h3>
            <Badge variant={getStatusVariant(goal.status)}>{t.status[goal.status]}</Badge>
          </div>
          
          {goal.description && (
            <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
          )}
          
          <div className="flex items-center mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(goal.category)}`}>
              {t.category[goal.category]}
            </span>
          </div>
          
          <div className="mt-auto">
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{t.progress}</span>
                <span>{progressPercentage}%</span>
              </div>
              <ProgressBar 
                value={progressPercentage} 
                variant={goal.status === 'completed' ? 'success' : 'primary'}
              />
            </div>

            <div className="flex justify-between text-sm font-medium">
              <span>${(goal?.saved || 0).toLocaleString()}</span>
              <span className="text-muted-foreground">{t.of} ${(goal?.target || 0).toLocaleString()}</span>
            </div>
            
            {goal.targetDate && (
              <div className="mt-3 text-xs text-muted-foreground">
                <span>{t.dueDateLabel}: {formatDueDate(goal.targetDate)}</span>
              </div>
            )}
            
            {(onEdit || onDelete) && (
              <div className="flex justify-end gap-2 mt-3">
                {onEdit && (
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="text-xs text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                  >
                    {t.edit}
                  </motion.button>
                )}
                
                {onDelete && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    {t.delete}
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}; 