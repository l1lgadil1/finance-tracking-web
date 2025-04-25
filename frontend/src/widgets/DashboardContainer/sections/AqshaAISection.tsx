import { FC } from 'react';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { motion } from 'framer-motion';

const aiTranslations = {
  en: {
    aqshaAI: 'AqshaAI',
    spentLess: 'In this month you spent 30% less',
    goToAI: 'Go to',
  },
  ru: {
    aqshaAI: 'АкшаИИ',
    spentLess: 'В этом месяце вы потратили на 30% меньше',
    goToAI: 'Перейти',
  }
};

interface AqshaAISectionProps {
  locale: Locale;
}

export const AqshaAISection: FC<AqshaAISectionProps> = ({ locale }) => {
  const t = aiTranslations[locale] || aiTranslations.en;
  
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{t.aqshaAI}</h2>
          <motion.div
            whileHover={{ rotate: 10 }}
            className="cursor-help"
          >
            ℹ️
          </motion.div>
        </div>
        <Button variant="ghost" size="sm" rightIcon={<span>→</span>}>
          {t.goToAI}
        </Button>
      </CardHeader>
      <CardBody className="p-4">
        <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg flex items-start gap-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center shrink-0 mt-1">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <p className="text-gray-800 dark:text-gray-200">
              {t.spentLess}
            </p>
            
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="col-span-2 bg-white dark:bg-gray-800 rounded p-2 text-center text-sm">
                <span className="block font-medium text-green-600">-30%</span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-2 text-center text-sm">
                <span className="block font-medium text-primary-600">$1,850</span>
                <span className="text-xs text-gray-500">total spent</span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 