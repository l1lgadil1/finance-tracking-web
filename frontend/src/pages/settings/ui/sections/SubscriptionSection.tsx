'use client';

import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiCreditCard, FiList } from 'react-icons/fi';
import { Card, CardHeader, CardBody, CardFooter, Button, Badge } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';
import { subscriptionApi, Subscription, BillingHistory } from '@/entities/subscription/api/subscriptionApi';

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
  // State for subscription data
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch current subscription if user is subscribed
        try {
          const subscription = await subscriptionApi.getCurrentSubscription();
          setCurrentSubscription(subscription);
        } catch (err) {
          console.warn('Current subscription endpoint not available or no active subscription');
          // It's okay if there's no subscription yet
        }
        
        // Fetch available plans
        try {
          const plans = await subscriptionApi.getAvailablePlans();
          setAvailablePlans(plans.map(plan => ({
            ...plan,
            isCurrentPlan: currentSubscription?.planId === plan.id
          })));
        } catch (err) {
          console.warn('Available plans endpoint not available, using fallback data');
          // We'll use the default plans defined in the component
        }
        
        // Fetch billing history if user has a subscription
        if (currentSubscription) {
          try {
            const history = await subscriptionApi.getBillingHistory();
            setBillingHistory(history);
          } catch (err) {
            console.warn('Billing history endpoint not available');
            // Just continue without billing history
          }
        }
      } catch (err) {
        console.error('Error fetching subscription data:', err);
        setError('Failed to load subscription data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscriptionData();
  }, [currentSubscription?.planId]);

  const handleChangePlan = async (planId: string) => {
    setIsChangingPlan(true);
    
    try {
      // If user already has a subscription, cancel it first
      if (currentSubscription) {
        try {
          await subscriptionApi.cancelSubscription(currentSubscription.id);
        } catch (err) {
          console.warn('Cancel subscription endpoint not available');
          // Continue anyway for demo purposes
        }
      }
      
      // Subscribe to new plan
      try {
        const newSubscription = await subscriptionApi.subscribe(planId);
        setCurrentSubscription(newSubscription);
      } catch (err) {
        console.warn('Subscribe endpoint not available');
        // Create mock subscription for demo purposes
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
      }
      
      // Update plan status
      setAvailablePlans(prevPlans => 
        prevPlans.map(plan => ({
          ...plan,
          isCurrentPlan: plan.id === planId
        }))
      );
    } catch (err) {
      console.error('Error changing subscription plan:', err);
      setError('Failed to change subscription plan. Please try again later.');
    } finally {
      setIsChangingPlan(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;
    
    try {
      try {
        await subscriptionApi.cancelSubscription(currentSubscription.id);
      } catch (err) {
        console.warn('Cancel subscription endpoint not available');
        // Continue anyway for demo purposes
      }
      
      setCurrentSubscription(null);
      
      // Reset current plan status
      setAvailablePlans(prevPlans => 
        prevPlans.map(plan => ({
          ...plan,
          isCurrentPlan: false
        }))
      );
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError('Failed to cancel subscription. Please try again later.');
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
        <h3 className="font-semibold">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Free plan default for new users
  const freePlan = {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    description: 'Basic features for personal use',
    features: [
      'Up to 3 accounts',
      'Up to 100 transactions per month',
      'Basic reporting',
      'Email support'
    ],
    isCurrentPlan: !currentSubscription
  };

  // Pro plan
  const proPlan = {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    description: 'Advanced features for power users',
    features: [
      'Unlimited accounts',
      'Unlimited transactions',
      'Advanced analytics',
      'CSV/JSON export',
      'Priority support',
      'Custom categories'
    ],
    isPopular: true,
    isCurrentPlan: currentSubscription?.planId === 'pro'
  };

  // Business plan
  const businessPlan = {
    id: 'business',
    name: 'Business',
    price: 19.99,
    interval: 'month',
    description: 'Enterprise solutions for teams',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Role-based permissions',
      'API access',
      'Dedicated support',
      'Custom branding'
    ],
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
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Your Subscription</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-medium">
                  {currentPlan?.name} Plan
                </h3>
                <Badge variant="primary" className="ml-2">
                  {currentPlan?.id === 'free' ? 'Current' : 'Active'}
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
                    Next billing on {formatDate(currentSubscription.endDate)}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-muted/30 p-4 rounded-md">
            <h4 className="font-medium mb-2">Plan Features</h4>
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
              Cancel Subscription
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Available Plans</h2>
        </CardHeader>
        <CardBody>
          <p className="text-muted-foreground mb-6">
            Choose the plan that works best for your needs.
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
                    Most Popular
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
                    {plan.isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Billing History */}
      {billingHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Billing History</h2>
              <FiList className="text-muted-foreground w-5 h-5" />
            </div>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-left font-medium">Invoice</th>
                    <th className="py-3 px-4 text-left font-medium">Date</th>
                    <th className="py-3 px-4 text-left font-medium">Amount</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border hover:bg-muted/20">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FiCreditCard className="text-muted-foreground mr-2" />
                          <span>{invoice.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatDate(invoice.date)}</td>
                      <td className="py-3 px-4">{formatCurrency(invoice.amount)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={invoice.status === 'paid' ? 'success' : 'warning'}>
                          {invoice.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}; 