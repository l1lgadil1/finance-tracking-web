'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/shared/model/store';
import { Header } from '@/widgets/Header';
import { TransactionChart } from '@/widgets/TransactionChart';
import { Locale, defaultLocale } from '@/shared/lib/i18n';
import { Card, CardBody, Button } from '@/shared/ui';

interface HomePageProps {
  params: {
    locale: Locale;
  };
}

export const HomePage = ({ params }: HomePageProps) => {
  const { locale, setLocale } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const currentLocale = locale || params?.locale || defaultLocale;

  // Set the locale from the URL parameter
  useEffect(() => {
    if (params?.locale) {
      setLocale(params.locale);
    }
  }, [params?.locale, setLocale]);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        locale={currentLocale} 
        onChangeLocale={setLocale}
      />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardBody className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
                <p className="text-2xl font-bold">$12,560.80</p>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
                <p className="text-2xl font-bold">$3,850.20</p>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expenses</p>
                <p className="text-2xl font-bold">$2,150.45</p>
              </div>
            </CardBody>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TransactionChart />
          </div>
          
          <Card>
            <CardBody>
              <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Grocery Shopping</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Jun 1, 2023</p>
                      </div>
                    </div>
                    <span className="text-red-500 font-medium">-$125.00</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" fullWidth>View All Transactions</Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          <p>Connect to the backend API at /api/...</p>
          <p className="mt-2">
            <a href="/ui-showcase" className="text-primary-500 hover:underline">
              View UI Components Showcase
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}; 