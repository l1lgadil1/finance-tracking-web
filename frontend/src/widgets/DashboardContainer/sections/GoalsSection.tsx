import { FC } from 'react';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

interface GoalsSectionProps {
  locale: Locale; // Kept for consistency with other sections
  t: {
    goals: string;
    viewAll: string;
  };
}

export const GoalsSection: FC<GoalsSectionProps> = ({ t }) => {
  // Mock data for goals
  const goals = [
    {
      id: 1,
      name: 'Subscriptions',
      current: 25,
      target: 50,
      left: 25,
      color: 'primary',
    },
    {
      id: 2,
      name: 'Food and booze',
      current: 880,
      target: 1000,
      left: 120,
      color: 'error',
    },
    {
      id: 3,
      name: 'Savings',
      current: 1950,
      target: 2000,
      left: 50,
      color: 'success',
    },
  ];
  
  // Function to calculate progress percentage
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t.goals}</h2>
        <Button variant="ghost" size="sm">
          {t.viewAll}
        </Button>
      </CardHeader>
      <CardBody className="space-y-4">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target);
          
          // Determine color class based on goal color
          const colorClass = 
            goal.color === 'primary' ? 'bg-primary-500' :
            goal.color === 'error' ? 'bg-red-500' :
            goal.color === 'success' ? 'bg-green-500' :
            'bg-blue-500';
            
          return (
            <div key={goal.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                  <span className="font-medium">{goal.name}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ${goal.left} left
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${colorClass}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}; 