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
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.aqshaAI}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center p-8" aria-live="polite" aria-busy="true">
            <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin" role="progressbar" aria-label={t.loading}></div>
            <span className="sr-only">{t.loading}</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Error state
  if (transactions.error || aiRecommendations.error) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.aqshaAI}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md" role="alert" aria-live="assertive">
            {t.error}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Empty state (no transactions)
  if (transactions.data.length === 0) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.aqshaAI}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-background text-center rounded-md">
            {t.noData}
          </div>
        </CardBody>
      </Card>
    );
  }
  
  // Render insights from the AI
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <h2 className="text-xl font-semibold">{t.aqshaAI}</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <section aria-labelledby="insights-title">
          <h3 id="insights-title" className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
            {t.insights.title}
          </h3>
          
          <div className="space-y-3">
            {aiRecommendations.data?.insights.map((insight) => (
              <motion.div 
                key={insight.id}
                className="flex items-start gap-3 p-3 bg-background rounded-lg hover:bg-card-hover transition-colors"
                whileHover={{ scale: 1.01, x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                tabIndex={0}
                role="article"
              >
                <div 
                  className="w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-xl text-primary-700 dark:text-primary-300 flex-shrink-0" 
                  aria-hidden="true"
                >
                  {insight.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t.insights[insight.type as keyof typeof t.insights]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {insight.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        <section aria-labelledby="tips-title">
          <h3 id="tips-title" className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3 mt-4">
            {t.tips.title}
          </h3>
          
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            {aiRecommendations.data?.tips.map((tip, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 3 }}
              >
                {tip}
              </motion.li>
            ))}
          </ul>
        </section>
      </CardBody>
    </Card>
  );
}; 