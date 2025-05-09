import { FC } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardHeader, CardBody } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { ProgressBar } from '@/shared/ui';
import { useDashboardData } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
import { Target, Plus } from 'lucide-react';
import Link from 'next/link';

// Extended interface for potential goal properties
interface GoalWithExtendedProps {
  id: string;
  title?: string;
  current?: number;
  target?: number;
  currentAmount?: number;
  targetAmount?: number;
  deadline?: string;
}

interface GoalsSectionProps {
  locale: Locale;
  t: {
    goals: string;
    viewAll: string;
    loading: string;
    error: string;
    noGoalsYet: string;
    createGoal: string;
    completed: string;
    daysLeft: string;
    noDeadline: string;
    goalAchieved: string;
    complete: string;
    viewMore: string;
  };
}

export const GoalsSection: FC<GoalsSectionProps> = ({ locale, t }) => {
  const { goals, isLoading, hasErrors } = useDashboardData();
  
  // Helper to safely get current amount from a goal
  const getCurrentAmount = (goal: GoalWithExtendedProps): number => {
    // Check both possible property names
    if (typeof goal.current === 'number') return goal.current;
    if (typeof goal.currentAmount === 'number') return goal.currentAmount;
    return 0;
  };
  
  // Helper to safely get target amount from a goal
  const getTargetAmount = (goal: GoalWithExtendedProps): number => {
    // Check both possible property names
    if (typeof goal.target === 'number') return goal.target;
    if (typeof goal.targetAmount === 'number') return goal.targetAmount;
    return 1; // Default to 1 to avoid division by zero
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.goals}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center p-8">
            <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
            <span className="sr-only">{t.loading}</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Error state
  if (hasErrors) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.goals}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
            {goals.error || t.error}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Empty state
  if (!goals.data || goals.data.length === 0) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t.goals}</h2>
          <Link href={`/${locale}/dashboard/goals`} passHref>
            <Button variant="ghost" size="sm" className="hover:bg-accent">
              {t.viewAll}
            </Button>
          </Link>
        </CardHeader>
        <CardBody className="text-center py-6">
          <div className="mb-4 mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
            <Target className="text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-muted-foreground mb-4">{t.noGoalsYet}</p>
          <Button 
            variant="outline" 
            className="inline-flex items-center gap-1"
            leftIcon={<Plus size={16} />}
          >
            {t.createGoal}
          </Button>
        </CardBody>
      </Card>
    );
  }
  
  // Sort goals by progress percentage (highest first)
  const sortedGoals = [...goals.data].sort((a, b) => {
    // Get current and target values safely
    const currentA = getCurrentAmount(a);
    const targetA = getTargetAmount(a);
    const currentB = getCurrentAmount(b);
    const targetB = getTargetAmount(b);
    
    const progressA = currentA / targetA;
    const progressB = currentB / targetB;
    return progressB - progressA;
  });
  
  // Show only top 3 goals
  const topGoals = sortedGoals.slice(0, 3);
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t.goals}</h2>
        <Link href={`/${locale}/dashboard/goals`} passHref>
          <Button variant="ghost" size="sm" className="hover:bg-accent">
            {t.viewAll}
          </Button>
        </Link>
      </CardHeader>
      <CardBody className="space-y-4">
        {topGoals.map((goal) => {
          // Get current and target amounts safely
          const current = getCurrentAmount(goal);
          const target = getTargetAmount(goal);
          const progress = (current / target) * 100;
          const isCompleted = progress >= 100;
          const progressVariant = 
            progress >= 100 ? 'success' : 
            progress >= 75 ? 'primary' : 
            progress >= 50 ? 'info' : 
            progress >= 25 ? 'warning' : 
            'error';
            
          const deadlineDate = goal.deadline ? new Date(goal.deadline) : null;
          const daysLeft = deadlineDate 
            ? Math.max(0, Math.floor((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
            : 0;
          
          return (
            <motion.div
              key={goal.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="p-4 bg-card-hover rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-md">{goal.title || 'Goal'}</h3>
                {isCompleted && (
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
                    {t.completed}
                  </span>
                )}
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>${current.toFixed(2)}</span>
                  <span className="text-muted-foreground">${target.toFixed(2)}</span>
                </div>
                <ProgressBar 
                  value={current} 
                  max={target} 
                  size="sm" 
                  variant={progressVariant}
                />
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  {Math.min(Math.round(progress), 100)}% {t.complete}
                </span>
                <span>
                  {isCompleted ? t.goalAchieved : deadlineDate ? `${daysLeft} ${t.daysLeft}` : t.noDeadline}
                </span>
              </div>
            </motion.div>
          );
        })}
        
        {goals.data.length > 3 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm">
              {t.viewMore.replace('{count}', (goals.data.length - 3).toString())}
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}; 