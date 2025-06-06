import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useDashboardData } from '../providers/DashboardDataProvider';
import { GoalModal } from '@/entities/goal/ui/GoalModal';

interface GoalsSectionProps {
  locale: Locale;
  t: {
    goals: string;
    viewAll: string;
  };
}

// Extra translations needed for this component
const goalsTranslations = {
  en: {
    daysLeft: 'days left',
    saved: 'saved',
    goal: 'goal',
    addGoal: 'Add Goal',
    loading: 'Loading goals...',
    error: 'Error loading goals',
    noGoals: 'No financial goals found. Create your first goal to track your progress.',
  },
  ru: {
    daysLeft: 'дней осталось',
    saved: 'накоплено',
    goal: 'цель',
    addGoal: 'Добавить цель',
    loading: 'Загрузка целей...',
    error: 'Ошибка загрузки целей',
    noGoals: 'Финансовые цели не найдены. Создайте свою первую цель для отслеживания прогресса.',
  }
};

export const GoalsSection: FC<GoalsSectionProps> = ({ t, locale }) => {
  // Get goals data from the dashboard data provider
  const { goals } = useDashboardData();
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  
  // Get additional translations
  const gt = goalsTranslations[locale === 'ru' ? 'ru' : 'en'];
  
  // Calculate progress percentage
  const calculateProgress = (current: number | null | undefined, target: number | null | undefined): number => {
    if (!current || !target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  const handleOpenModal = () => {
    setIsGoalModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsGoalModalOpen(false);
  };
  
  // Loading state
  if (goals.loading) {
    return (
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t.goals}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center p-8">
            <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Error state
  if (goals.error) {
    return (
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t.goals}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
            {goals.error}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Empty state
  if (goals.data.length === 0) {
    return (
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t.goals}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-background text-center rounded-md mb-4">
            {gt.noGoals}
          </div>
          <Button fullWidth variant="outline" onClick={handleOpenModal}>{gt.addGoal}</Button>
          
          {/* Goal Modal */}
          <GoalModal
            isOpen={isGoalModalOpen}
            onClose={handleCloseModal}
            locale={locale}
          />
        </CardBody>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t.goals}</h2>
        <Button variant="ghost" size="sm">
          {t.viewAll}
        </Button>
      </CardHeader>
      <CardBody className="space-y-4">
        {goals.data.map((goal) => {
          if (!goal) return null;
          
          const progress = calculateProgress(goal.current, goal.target);
          
          // Get color based on progress
          let progressColor = 'bg-red-500';
          if (progress >= 75) {
            progressColor = 'bg-green-500';
          } else if (progress >= 40) {
            progressColor = 'bg-yellow-500';
          }
          
          // Calculate days remaining
          const today = new Date();
          const deadline = goal.deadline ? new Date(goal.deadline) : new Date();
          const daysRemaining = Math.max(
            0,
            Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          );
          
          return (
            <motion.div 
              key={goal.id}
              className="p-4 bg-background rounded-lg"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-foreground">{goal.title || 'Unnamed Goal'}</h3>
                <Badge variant="primary" size="sm">
                  {daysRemaining} {gt.daysLeft}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${(goal.current || 0).toFixed(2)} {gt.saved}</span>
                  <span>${(goal.target || 0).toFixed(2)} {gt.goal}</span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2.5">
                  <motion.div 
                    className={`h-2.5 rounded-full ${progressColor}`}
                    style={{ width: `${progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                
                <div className="text-right text-sm font-medium text-primary-600 dark:text-primary-400">
                  {progress}%
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Add Goal button */}
        <Button
          fullWidth
          variant="outline"
          className="mt-2"
          onClick={handleOpenModal}
        >
          + {gt.addGoal}
        </Button>
        
        {/* Goal Modal */}
        <GoalModal
          isOpen={isGoalModalOpen}
          onClose={handleCloseModal}
          locale={locale}
        />
      </CardBody>
    </Card>
  );
}; 