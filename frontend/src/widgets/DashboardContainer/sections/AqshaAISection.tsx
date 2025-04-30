import { FC } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { useDashboardData } from '../providers/DashboardDataProvider';

const aiTranslations = {
  en: {
    aqshaAI: 'AqshaAI Insights',
    loading: 'Analyzing your financial data...',
    error: 'Could not generate insights at this time',
    noData: 'Add transactions to get personalized insights',
    insights: {
      title: 'Financial Insights',
      highExpense: 'High expense category',
      savingOpportunity: 'Saving opportunity',
      budgetAlert: 'Budget alert',
      positiveTrend: 'Positive trend',
    },
    tips: {
      title: 'Money-Saving Tips',
    },
  },
  ru: {
    aqshaAI: 'Аналитика AqshaAI',
    loading: 'Анализ ваших финансовых данных...',
    error: 'Не удалось создать аналитику',
    noData: 'Добавьте транзакции, чтобы получить персонализированные советы',
    insights: {
      title: 'Финансовые инсайты',
      highExpense: 'Высокие расходы',
      savingOpportunity: 'Возможность сэкономить',
      budgetAlert: 'Предупреждение о бюджете',
      positiveTrend: 'Положительная тенденция',
    },
    tips: {
      title: 'Советы по экономии',
    },
  }
};

interface AqshaAISectionProps {
  locale: Locale;
}

export const AqshaAISection: FC<AqshaAISectionProps> = ({ locale }) => {
  const t = aiTranslations[locale] || aiTranslations.en;
  const { transactions, aiRecommendations } = useDashboardData();
  
  // Loading state
  if (transactions.loading || aiRecommendations.loading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.aqshaAI}</h2>
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
  if (transactions.error || aiRecommendations.error) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.aqshaAI}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
            {t.error}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Empty state (no transactions)
  if (transactions.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.aqshaAI}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 text-center rounded-md">
            {t.noData}
          </div>
        </CardBody>
      </Card>
    );
  }
  
  // Render insights from the AI
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">{t.aqshaAI}</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">
          {t.insights.title}
        </h3>
        
        <div className="space-y-3">
          {aiRecommendations.data?.insights.map((insight) => (
            <motion.div 
              key={insight.id}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              whileHover={{ scale: 1.01, x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-xl">
                {insight.icon}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {t.insights[insight.type as keyof typeof t.insights]}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {insight.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mt-4">
          {t.tips.title}
        </h3>
        
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          {aiRecommendations.data?.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}; 