import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardHeader, CardBody } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useDashboardData } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
import { BrainCircuit, ArrowRight, TrendingUp, ArrowDownRight, PiggyBank, MessageCircle } from 'lucide-react';
import { AIAssistantModal } from '@/features/ai-assistant/ui/AIAssistantModal';
import { aiAssistantApi } from '@/entities/ai/api/aiAssistantApi';

const aiTranslations = {
  en: {
    aqshaAI: 'Aqsha AI',
    insights: 'Financial Insights',
    loading: 'Loading insights...',
    error: 'Error loading insights',
    noInsights: 'No insights available',
    tryAgain: 'Try Again',
    seeTips: 'See All Tips',
    openAssistant: 'Ask Aqsha AI',
    basedOn: 'Based on your recent activity',
    savingTip: 'Saving Opportunity',
    spendingAlert: 'Spending Alert',
    budgetTip: 'Budget Tip',
    investmentTip: 'Investment Tip',
    refreshing: 'Refreshing insights...'
  },
  ru: {
    aqshaAI: 'Aqsha ИИ',
    insights: 'Финансовые идеи',
    loading: 'Загрузка идей...',
    error: 'Ошибка загрузки идей',
    noInsights: 'Нет доступных идей',
    tryAgain: 'Попробовать снова',
    seeTips: 'Все советы',
    openAssistant: 'Спросить Aqsha ИИ',
    basedOn: 'На основе вашей недавней активности',
    savingTip: 'Возможность сбережения',
    spendingAlert: 'Предупреждение о расходах',
    budgetTip: 'Совет по бюджету',
    investmentTip: 'Совет по инвестициям',
    refreshing: 'Обновление идей...'
  }
};

// Extended interface for potential additional properties in AIInsight
interface ExtendedAIInsight {
  description?: string;
  amount?: number;
}

interface AqshaAISectionProps {
  locale: Locale;
}

export const AqshaAISection: FC<AqshaAISectionProps> = ({ locale }) => {
  const t = aiTranslations[locale] || aiTranslations.en;
  const { aiRecommendations, isLoading, hasErrors, refresh } = useDashboardData();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Function to generate fresh AI insights
  const handleRefreshInsights = async () => {
    try {
      setIsRefreshing(true);
      // Get spending analysis for the last 30 days
      const endDate = new Date().toISOString();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      // Get spending analysis 
      await aiAssistantApi.analyzeSpending(startDate.toISOString(), endDate);
      
      // Refresh dashboard data
      refresh();
    } catch (error) {
      console.error('Error refreshing insights:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Loading state
  if (isLoading || isRefreshing) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-primary-500" size={20} />
            <h2 className="text-xl font-semibold">{t.aqshaAI}</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center p-8">
            <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
            <span className="sr-only">{isRefreshing ? t.refreshing : t.loading}</span>
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
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-primary-500" size={20} />
            <h2 className="text-xl font-semibold">{t.aqshaAI}</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
            {aiRecommendations.error || t.error}
          </div>
          <Button 
            variant="outline" 
            className="mt-3 w-full"
            onClick={handleRefreshInsights}
          >
            {t.tryAgain}
          </Button>
        </CardBody>
      </Card>
    );
  }

  // Empty state or no recommendations
  if (!aiRecommendations.data || !aiRecommendations.data.insights || aiRecommendations.data.insights.length === 0) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-primary-500" size={20} />
            <h2 className="text-xl font-semibold">{t.aqshaAI}</h2>
          </div>
        </CardHeader>
        <CardBody className="text-center py-6">
          <div className="mb-4 mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
            <BrainCircuit className="text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-muted-foreground mb-4">{t.noInsights}</p>
          <Button 
            variant="outline"
            onClick={handleRefreshInsights}
          >
            {t.tryAgain}
          </Button>
        </CardBody>
      </Card>
    );
  }
  
  // Helper to get icon by insight type
  const getInsightIcon = (type: string = '') => {
    switch (type) {
      case 'saving': return <PiggyBank size={16} className="text-green-500" />;
      case 'spending': return <ArrowDownRight size={16} className="text-red-500" />;
      case 'budget': return <TrendingUp size={16} className="text-blue-500" />;
      case 'investment': return <TrendingUp size={16} className="text-purple-500" />;
      default: return <ArrowRight size={16} className="text-primary-500" />;
    }
  };
  
  // Helper to get text by insight type
  const getInsightText = (type: string = '') => {
    switch (type) {
      case 'saving': return t.savingTip;
      case 'spending': return t.spendingAlert;
      case 'budget': return t.budgetTip;
      case 'investment': return t.investmentTip;
      default: return '';
    }
  };
  
  // Helper to get class by insight type
  const getInsightClass = (type: string = '') => {
    switch (type) {
      case 'saving': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'spending': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'budget': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'investment': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      default: return 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300';
    }
  };
  
  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-primary-500" size={20} />
            <h2 className="text-xl font-semibold">{t.aqshaAI}</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{t.basedOn}</p>
        </CardHeader>
        <CardBody className="space-y-3">
          {(aiRecommendations.data.insights || []).slice(0, 3).map((insight, index) => {
            if (!insight) return null;
            
            // Get insight properties safely with TypeScript type checking
            const insightType = insight.type || '';
            const insightText = insight.message || ''; 
            
            // These properties might not exist in the standard AIInsight type
            // Use type assertion with our extended interface
            const extendedInsight = insight as ExtendedAIInsight;
            const description = extendedInsight.description;
            const amount = extendedInsight.amount;
            
            // Use additional properties if available, otherwise fallback
            const displayText = insightText || description || '';
            const savingAmount = typeof amount === 'number' ? amount : 0;
            
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex items-start gap-3 p-3 bg-card-hover rounded-lg cursor-pointer"
              >
                <div className={`p-2 rounded-full ${getInsightClass(insightType)}`}>
                  {getInsightIcon(insightType)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                      {getInsightText(insightType)}
                    </p>
                    {savingAmount > 0 && (
                      <span className="text-xs font-semibold text-green-600">
                        +${savingAmount.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-1">{displayText}</p>
                </div>
              </motion.div>
            );
          })}
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-1" 
              size="sm"
              onClick={() => handleRefreshInsights()}
            >
              {t.seeTips}
              <ArrowRight size={14} />
            </Button>
            
            <Button 
              variant="primary" 
              className="flex items-center justify-center gap-1" 
              size="sm"
              onClick={() => setIsAssistantOpen(true)}
            >
              {t.openAssistant}
              <MessageCircle size={14} />
            </Button>
          </div>
        </CardBody>
      </Card>
      
      {/* AI Assistant Modal */}
      <AIAssistantModal 
        isOpen={isAssistantOpen} 
        onClose={() => setIsAssistantOpen(false)} 
        locale={locale}
      />
    </>
  );
}; 