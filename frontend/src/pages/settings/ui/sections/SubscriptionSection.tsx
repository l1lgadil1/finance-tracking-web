'use client';

import React, { useState } from 'react';
import { FiCheckCircle, FiCreditCard, FiList, FiArrowRight } from 'react-icons/fi';
import { Card, CardHeader, CardBody, CardFooter, Button, Badge } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';

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
  // Mock subscription data
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  const plans: Plan[] = [
    {
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
      isCurrentPlan: currentPlan === 'free'
    },
    {
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
      isCurrentPlan: currentPlan === 'pro'
    },
    {
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
      isCurrentPlan: currentPlan === 'business'
    }
  ];

  const handleChangePlan = (planId: string) => {
    setIsChangingPlan(true);
    
    // Simulate API call
    setTimeout(() => {
      setCurrentPlan(planId);
      setIsChangingPlan(false);
    }, 1000);
  };

  // Mock billing history
  const billingHistory = [
    {
      id: 'inv-001',
      date: 'May 1, 2023',
      amount: 9.99,
      status: 'Paid',
      planName: 'Pro'
    },
    {
      id: 'inv-002',
      date: 'June 1, 2023',
      amount: 9.99,
      status: 'Paid',
      planName: 'Pro'
    },
    {
      id: 'inv-003',
      date: 'July 1, 2023',
      amount: 9.99,
      status: 'Paid',
      planName: 'Pro'
    }
  ];

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

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
                  {plans.find(p => p.id === currentPlan)?.name} Plan
                </h3>
                <Badge variant="primary" className="ml-2">
                  {currentPlan === 'free' ? 'Current' : 'Active'}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                {plans.find(p => p.id === currentPlan)?.description}
              </p>
            </div>
            
            {currentPlan !== 'free' && (
              <div className="mt-4 sm:mt-0 text-right">
                <span className="text-lg font-medium">
                  {formatCurrency(plans.find(p => p.id === currentPlan)?.price || 0)}
                </span>
                <span className="text-muted-foreground">/{plans.find(p => p.id === currentPlan)?.interval}</span>
                <p className="text-sm text-muted-foreground">Next billing on August 1, 2023</p>
              </div>
            )}
          </div>
          
          <div className="bg-muted/30 p-4 rounded-md">
            <h4 className="font-medium mb-2">Plan Features</h4>
            <ul className="space-y-2">
              {plans.find(p => p.id === currentPlan)?.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <FiCheckCircle className="text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardBody>
        <CardFooter>
          {currentPlan !== 'free' && (
            <Button variant="outline" className="text-error">
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
            {plans.map((plan) => (
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
                    isLoading={isChangingPlan && currentPlan !== plan.id}
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
                  <th className="py-3 px-4 text-left font-medium">Plan</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border">
                    <td className="py-3 px-4 font-medium">{invoice.id}</td>
                    <td className="py-3 px-4">{invoice.date}</td>
                    <td className="py-3 px-4">{formatCurrency(invoice.amount)}</td>
                    <td className="py-3 px-4">{invoice.planName}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-success/20 text-success rounded-full">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" rightIcon={<FiArrowRight />}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Payment Methods</h2>
            <FiCreditCard className="text-muted-foreground w-5 h-5" />
          </div>
        </CardHeader>
        <CardBody>
          <div className="border border-border rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded mr-4 flex items-center justify-center text-lg">
                💳
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 04/2025</p>
              </div>
            </div>
            <Badge variant="success">Default</Badge>
          </div>
        </CardBody>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Update Payment Method</Button>
          <Button variant="outline">Add New Card</Button>
        </CardFooter>
      </Card>
    </div>
  );
}; 