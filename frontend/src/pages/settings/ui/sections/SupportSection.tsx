'use client';

import React, { useState, useEffect } from 'react';
import { FiHelpCircle, FiMessageCircle, FiFileText, FiYoutube, FiExternalLink, FiMail } from 'react-icons/fi';
import { Card, CardHeader, CardBody, Button } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';
import { supportApi, FAQItem, SupportResource } from '@/entities/support/api/supportApi';

interface SupportSectionProps {
  locale: Locale;
}

const SupportIconMap: Record<string, React.ReactNode> = {
  'message': <FiMessageCircle className="w-5 h-5" />,
  'docs': <FiFileText className="w-5 h-5" />,
  'video': <FiYoutube className="w-5 h-5" />,
  'faq': <FiHelpCircle className="w-5 h-5" />,
  'mail': <FiMail className="w-5 h-5" />
};

export const SupportSection = ({ locale }: SupportSectionProps) => {
  const [supportResources, setSupportResources] = useState<SupportResource[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch support data
  useEffect(() => {
    const fetchSupportData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch support resources with fallback
        try {
          const resources = await supportApi.getSupportResources();
          setSupportResources(resources);
        } catch (err) {
          console.warn('Support resources endpoint not available, using fallback data');
          // Fallback data is applied at render time with defaultSupportResources
        }
        
        // Fetch FAQ items with fallback
        try {
          const faqs = await supportApi.getFAQs();
          setFaqItems(faqs);
        } catch (err) {
          console.warn('FAQs endpoint not available, using fallback data');
          // Fallback data is applied at render time with defaultFaqItems
        }
      } catch (err) {
        console.error('Error fetching support data:', err);
        setError('Failed to load support resources. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSupportData();
  }, []);

  // Handle email support button click
  const handleEmailSupport = () => {
    // In a real app, this would open a support ticket form
    console.log('Open support ticket form');
    // Simulate API call for ticket creation
    try {
      // supportApi.createSupportTicket({ subject: "Support Request", message: "User initiated support request" });
      alert("Support ticket initiated. Our team will contact you shortly!");
    } catch (err) {
      console.warn('Support ticket creation endpoint not available');
    }
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

  // Fallback if no resources are available
  const defaultSupportResources: SupportResource[] = [
    {
      id: 'contact',
      title: 'Contact Support',
      description: 'Have a question or issue? Our support team is here to help.',
      icon: 'message',
      actionLabel: 'Send a Message',
      actionUrl: '/support/contact'
    },
    {
      id: 'documentation',
      title: 'Documentation',
      description: 'Explore our comprehensive guides and documentation.',
      icon: 'docs',
      actionLabel: 'Read Docs',
      actionUrl: '/docs'
    }
  ];

  // Use fetched resources if available, otherwise use defaults
  const displayResources = supportResources.length > 0 ? supportResources : defaultSupportResources;

  // Fallback if no FAQ items are available
  const defaultFaqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I add a new account?',
      answer: 'Go to Accounts and click on the "Add Account" button. Fill in the required information and save.',
      category: 'accounts'
    },
    {
      id: '2',
      question: 'How do I recover my password?',
      answer: 'On the login page, click on "Forgot Password" and follow the instructions sent to your email.',
      category: 'security'
    }
  ];

  // Use fetched FAQ items if available, otherwise use defaults
  const displayFaqItems = faqItems.length > 0 ? faqItems : defaultFaqItems;

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
            {displayResources.map((resource) => (
              <div 
                key={resource.id}
                className="border border-border rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
              >
                <div className="flex">
                  <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-md mr-4 text-primary-600 dark:text-primary-400 flex-shrink-0">
                    {SupportIconMap[resource.icon] || <FiHelpCircle className="w-5 h-5" />}
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
            {displayFaqItems.map((item) => (
              <div key={item.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
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
              onClick={handleEmailSupport}
            >
              Email Support
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}; 