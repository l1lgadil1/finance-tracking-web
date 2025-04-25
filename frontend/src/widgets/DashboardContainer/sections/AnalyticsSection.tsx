import { FC } from 'react';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';

const analyticsTranslations = {
  en: {
    monthlyAnalytics: 'Monthly Analytics',
    income: 'Income',
    expenses: 'Expenses',
    spentLess: 'In this month you spent 30% less',
  },
  ru: {
    monthlyAnalytics: 'Месячная аналитика',
    income: 'Доходы',
    expenses: 'Расходы',
    spentLess: 'В этом месяце вы потратили на 30% меньше',
  }
};

interface AnalyticsSectionProps {
  locale: Locale;
}

export const AnalyticsSection: FC<AnalyticsSectionProps> = ({ locale }) => {
  const t = analyticsTranslations[locale] || analyticsTranslations.en;
  
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{t.monthlyAnalytics}</h2>
        </div>
      </CardHeader>
      <CardBody>
        {/* AI Insight Box */}
        <div className="mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center">
          <div className="mr-3 w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
            AI
          </div>
          <p className="text-sm">{t.spentLess}</p>
        </div>
      
        {/* Chart placeholder */}
        <div className="h-60 w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Bar chart mockup */}
          <div className="h-full w-full p-4 flex items-end justify-around">
            {/* Generate 15 fake bars for the chart */}
            {Array.from({ length: 15 }).map((_, index) => {
              // Generate random heights for income and expense bars
              const incomeHeight = 30 + Math.random() * 70;
              const expenseHeight = 20 + Math.random() * 60;
              
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div className="flex items-end gap-1">
                    {/* Income bar */}
                    <div 
                      className="w-4 bg-primary-500 rounded-t"
                      style={{ height: `${incomeHeight}%` }}
                    ></div>
                    {/* Expense bar */}
                    <div 
                      className="w-4 bg-red-500 rounded-t"
                      style={{ height: `${expenseHeight}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{index + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-500 mr-2"></div>
            <span className="text-sm">{t.income}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 mr-2"></div>
            <span className="text-sm">{t.expenses}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 