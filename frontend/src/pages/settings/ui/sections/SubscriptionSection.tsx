'use client';

import React, { useState, useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { Card, CardHeader, CardBody, CardFooter, Button, Badge } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';
import { Subscription } from '@/entities/subscription/api/subscriptionApi';

// Define translations
const translations = {
  en: {
    yourSubscription: 'Your Subscription',
    availablePlans: 'Available Plans',
    billingHistory: 'Billing History',
    current: 'Current',
    active: 'Active',
    nextBilling: 'Next billing on',
    planFeatures: 'Plan Features',
    cancelSubscription: 'Cancel Subscription',
    choosePlan: 'Choose the plan that works best for your needs.',
    currentPlan: 'Current Plan',
    upgradeTo: 'Upgrade to',
    mostPopular: 'Most Popular',
    invoice: 'Invoice',
    date: 'Date',
    amount: 'Amount', 
    status: 'Status',
    download: 'Download',
    error: 'Error',
    failedToLoad: 'Failed to load subscription data. Please try again later.',
    plan: 'Plan',
    planSuffix: 'Plan',
    free: {
      name: 'Free',
      description: 'Basic features for personal use',
      features: [
        'Up to 3 accounts',
        'Up to 100 transactions per month',
        'Basic reporting',
        'Email support'
      ]
    },
    pro: {
      name: 'Pro',
      description: 'Advanced features for power users',
      features: [
        'Unlimited accounts',
        'Unlimited transactions',
        'Advanced analytics',
        'CSV/JSON export',
        'Priority support',
        'Custom categories'
      ]
    },
    business: {
      name: 'Business',
      description: 'Enterprise solutions for teams',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Role-based permissions',
        'API access',
        'Dedicated support',
        'Custom branding'
      ]
    }
  },
  ru: {
    yourSubscription: 'Ваша подписка',
    availablePlans: 'Доступные планы',
    billingHistory: 'История платежей',
    current: 'Текущий',
    active: 'Активный',
    nextBilling: 'Следующий платеж',
    planFeatures: 'Возможности плана',
    cancelSubscription: 'Отменить подписку',
    choosePlan: 'Выберите план, который лучше всего соответствует вашим потребностям.',
    currentPlan: 'Текущий план',
    upgradeTo: 'Обновить до',
    mostPopular: 'Самый популярный',
    invoice: 'Счет',
    date: 'Дата',
    amount: 'Сумма',
    status: 'Статус',
    download: 'Скачать',
    error: 'Ошибка',
    failedToLoad: 'Не удалось загрузить данные подписки. Пожалуйста, попробуйте позже.',
    plan: 'План',
    planSuffix: '',
    free: {
      name: 'Бесплатный',
      description: 'Базовые функции для личного использования',
      features: [
        'До 3 счетов',
        'До 100 транзакций в месяц',
        'Базовая отчетность',
        'Поддержка по электронной почте'
      ]
    },
    pro: {
      name: 'Про',
      description: 'Расширенные функции для опытных пользователей',
      features: [
        'Неограниченное количество счетов',
        'Неограниченное количество транзакций',
        'Расширенная аналитика',
        'Экспорт в CSV/JSON',
        'Приоритетная поддержка',
        'Пользовательские категории'
      ]
    },
    business: {
      name: 'Бизнес',
      description: 'Корпоративные решения для команд',
      features: [
        'Все из тарифа Про',
        'Командное сотрудничество',
        'Ролевые разрешения',
        'Доступ к API',
        'Выделенная поддержка',
        'Собственный брендинг'
      ]
    }
  }
};

interface SubscriptionSectionProps {
  locale: Locale;
}

type Plan = {
  id: string;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
};

export const SubscriptionSection = ({ locale }: SubscriptionSectionProps) => {
  const t = translations[locale];
  
  // State for subscription data
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch subscription data
  useEffect(() => {
    // Simulate API data loading with a timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAvailablePlans([]);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChangePlan = async (planId: string) => {
    setIsChangingPlan(true);
    
    // Simulate processing
    setTimeout(() => {
      const mockSubscription: Subscription = {
        id: `sub-${Math.random().toString(36).substr(2, 9)}`,
        userId: 'current-user',
        planId: planId,
        planNameSnapshot: allPlans.find(p => p.id === planId)?.name || 'Unknown Plan',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days later
        status: 'active',
        autoRenew: true,
        price: allPlans.find(p => p.id === planId)?.price || 0
      };
      
      setCurrentSubscription(mockSubscription);
      
      // Update plan status
      setAvailablePlans(prevPlans => 
        prevPlans.map(plan => ({
          ...plan,
          isCurrentPlan: plan.id === planId
        }))
      );
      
      setIsChangingPlan(false);
    }, 1500);
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;
    
    // Simulate processing
    setTimeout(() => {
      setCurrentSubscription(null);
      
      // Reset current plan status
      setAvailablePlans(prevPlans => 
        prevPlans.map(plan => ({
          ...plan,
          isCurrentPlan: false
        }))
      );
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Free plan default for new users
  const freePlan: Plan = {
    id: 'free',
    name: t.free.name,
    price: 0,
    interval: 'month',
    description: t.free.description,
    features: t.free.features,
    isCurrentPlan: !currentSubscription
  };

  // Pro plan
  const proPlan: Plan = {
    id: 'pro',
    name: t.pro.name,
    price: 9.99,
    interval: 'month',
    description: t.pro.description,
    features: t.pro.features,
    isPopular: true,
    isCurrentPlan: currentSubscription?.planId === 'pro'
  };

  // Business plan
  const businessPlan: Plan = {
    id: 'business',
    name: t.business.name,
    price: 19.99,
    interval: 'month',
    description: t.business.description,
    features: t.business.features,
    isCurrentPlan: currentSubscription?.planId === 'business'
  };

  // Ensure we always have plans
  const allPlans = availablePlans.length > 0 
    ? [freePlan, ...availablePlans.filter(plan => plan.id !== 'free')]
    : [freePlan, proPlan, businessPlan];

  // Current plan
  const currentPlan = currentSubscription 
    ? allPlans.find(p => p.id === currentSubscription.planId) 
    : freePlan;

  return (
    <div className="space-y-8">
      {/* Demo Mode Notification */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200">
        <h3 className="font-medium text-lg mb-1">Demo Mode</h3>
        <p className="mb-2">This subscription section is operating in demo mode with mocked data. No actual subscription or payment processing is performed.</p>
        <p className="text-sm">When clicking on any plan or button, the UI will update to simulate the experience, but no backend operations will occur.</p>
      </div>
      
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.yourSubscription}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-medium">
                  {currentPlan?.name} {t.planSuffix}
                </h3>
                <Badge variant="primary" className="ml-2">
                  {currentPlan?.id === 'free' ? t.current : t.active}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                {currentPlan?.description}
              </p>
            </div>
            
            {currentSubscription && (
              <div className="mt-4 sm:mt-0 text-right">
                <span className="text-lg font-medium">
                  {formatCurrency(currentSubscription.price)}
                </span>
                <span className="text-muted-foreground">/{currentPlan?.interval}</span>
                {currentSubscription.endDate && (
                  <p className="text-sm text-muted-foreground">
                    {t.nextBilling} {formatDate(currentSubscription.endDate)}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-muted/30 p-4 rounded-md">
            <h4 className="font-medium mb-2">{t.planFeatures}</h4>
            <ul className="space-y-2">
              {currentPlan?.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <FiCheckCircle className="text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardBody>
        <CardFooter>
          {currentSubscription && (
            <Button 
              variant="outline" 
              className="text-error"
              onClick={handleCancelSubscription}
            >
              {t.cancelSubscription}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.availablePlans}</h2>
        </CardHeader>
        <CardBody>
          <p className="text-muted-foreground mb-6">
            {t.choosePlan}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allPlans.map((plan) => (
              <div 
                key={plan.id}
                className={`border rounded-lg overflow-hidden ${
                  plan.isPopular 
                    ? 'border-primary-500 shadow-md relative' 
                    : 'border-border'
                }`}
              >
                {plan.isPopular && (
                  <div className="bg-primary-500 text-white text-xs font-medium py-1 px-3 absolute top-0 right-0 rounded-bl-lg">
                    {t.mostPopular}
                  </div>
                )}
                
                <div className="p-5">
                  <h3 className="text-lg font-medium">{plan.name}</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-2xl font-bold">{formatCurrency(plan.price)}</span>
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <FiCheckCircle className="text-success mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={plan.isCurrentPlan ? 'outline' : 'primary'}
                    fullWidth
                    isLoading={isChangingPlan}
                    disabled={plan.isCurrentPlan || isChangingPlan}
                    onClick={() => handleChangePlan(plan.id)}
                  >
                    {plan.isCurrentPlan ? t.currentPlan : `${t.upgradeTo} ${plan.name}`}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* No Billing History in Demo Mode */}
    </div>
  );
}; 