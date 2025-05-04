'use client';

import React from 'react';
import { FiHelpCircle, FiMessageCircle, FiFileText, FiYoutube, FiExternalLink, FiMail } from 'react-icons/fi';
import { Card, CardHeader, CardBody, Button } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';

interface SupportSectionProps {
  locale: Locale;
}

type SupportResource = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
  actionUrl: string;
};

export const SupportSection = ({ locale }: SupportSectionProps) => {
  const supportResources: SupportResource[] = [
    {
      id: 'contact',
      title: 'Contact Support',
      description: 'Have a question or issue? Our support team is here to help.',
      icon: <FiMessageCircle className="w-5 h-5" />,
      actionLabel: 'Send a Message',
      actionUrl: '/support/contact'
    },
    {
      id: 'documentation',
      title: 'Documentation',
      description: 'Explore our comprehensive guides and documentation.',
      icon: <FiFileText className="w-5 h-5" />,
      actionLabel: 'Read Docs',
      actionUrl: '/docs'
    },
    {
      id: 'tutorials',
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides to master AqshaTracker.',
      icon: <FiYoutube className="w-5 h-5" />,
      actionLabel: 'Watch Tutorials',
      actionUrl: '/tutorials'
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions about AqshaTracker.',
      icon: <FiHelpCircle className="w-5 h-5" />,
      actionLabel: 'View FAQs',
      actionUrl: '/faq'
    }
  ];

  // Mock FAQ data
  const faqItems = [
    {
      question: 'How do I add a new account?',
      answer: 'Go to Accounts and click on the "Add Account" button. Fill in the required information and save.'
    },
    {
      question: 'Can I import transactions from my bank?',
      answer: 'Yes! Go to the Data Management section in Settings and use the import feature to upload data from your bank in CSV format.'
    },
    {
      question: 'How do I recover my password?',
      answer: 'On the login page, click on "Forgot Password" and follow the instructions sent to your email.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Support Resources */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Help & Support</h2>
        </CardHeader>
        <CardBody>
          <p className="text-muted-foreground mb-6">
            Get help with AqshaTracker. Find resources and support options below.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportResources.map((resource) => (
              <div 
                key={resource.id}
                className="border border-border rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
              >
                <div className="flex">
                  <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-md mr-4 text-primary-600 dark:text-primary-400 flex-shrink-0">
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      {resource.description}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      rightIcon={<FiExternalLink />}
                      className="px-0 hover:bg-transparent hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {resource.actionLabel}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Frequently Asked Questions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium text-lg mb-2">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Direct Contact */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Email Support</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1">Need direct assistance?</p>
              <p className="text-muted-foreground">Our support team is available 24/7 to help you.</p>
            </div>
            <Button 
              variant="primary"
              leftIcon={<FiMail />}
            >
              Email Support
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}; 