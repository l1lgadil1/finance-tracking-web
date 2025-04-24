'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAppStore } from '@/store/app-store';
import { Locale } from '@/lib/i18n';
import { Button } from '@/shared/ui/Button';
import { Card, CardBody } from '@/shared/ui/Card';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface LandingPageProps {
  params?: {
    locale?: Locale;
  };
}

export const LandingPage: React.FC<LandingPageProps> = ({ params }) => {
  const { setLocale, locale } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Set locale from params if provided
  useEffect(() => {
    if (params?.locale) {
      setLocale(params.locale);
    }
  }, [params, setLocale]);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Features data
  const features = [
    {
      title: 'Smart Tracking',
      description: 'Automatically categorize and track your income & expenses',
      icon: '📊'
    },
    {
      title: 'AI Assistant',
      description: 'Get personalized financial insights and recommendations',
      icon: '🤖'
    },
    {
      title: 'Goal Setting',
      description: 'Set financial goals and track your progress',
      icon: '🎯'
    },
    {
      title: 'Multiple Profiles',
      description: 'Manage personal, family, or business finances separately',
      icon: '👥'
    },
    {
      title: 'In-depth Analytics',
      description: 'Visualize your spending patterns and financial health',
      icon: '📈'
    },
    {
      title: 'Transaction History',
      description: 'View and search your complete financial history',
      icon: '📝'
    }
  ];

  // Target audience data
  const audiences = [
    {
      type: 'Students',
      caption: 'Master your stipend',
      avatar: '👨‍🎓'
    },
    {
      type: 'Professionals',
      caption: 'Save for what matters',
      avatar: '👩‍💼'
    },
    {
      type: 'Entrepreneurs',
      caption: 'Know your profit',
      avatar: '👨‍💻'
    },
    {
      type: 'Families',
      caption: 'Coordinate a shared budget',
      avatar: '👨‍👩‍👧‍👦'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Sarah K.',
      role: 'Marketing Manager',
      comment: 'AqshaTracker helped me save for my dream vacation. The AI insights were eye-opening!',
      avatar: '👩‍🦰'
    },
    {
      name: 'Michael T.',
      role: 'Graduate Student',
      comment: 'Managing my student loans and expenses has never been easier. This app is a lifesaver!',
      avatar: '👨‍🎓'
    },
    {
      name: 'Jessica L.',
      role: 'Small Business Owner',
      comment: 'I can finally separate my business and personal finances with multiple profiles. Game changer!',
      avatar: '👩‍💼'
    }
  ];

  // Comparison table data
  const comparisonItems = [
    { feature: 'AI-powered insights', aqsha: true, excel: false, others: false },
    { feature: 'Multi-profile support', aqsha: true, excel: false, others: 'Limited' },
    { feature: 'User-friendly interface', aqsha: true, excel: false, others: 'Varies' },
    { feature: 'Goal tracking', aqsha: true, excel: 'Manual', others: 'Basic' },
    { feature: 'Free plan', aqsha: true, excel: 'Paid', others: 'Limited' }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Navigation */}
      <nav className="w-full px-4 py-4 flex justify-between items-center bg-card border-b border-border sticky top-0 z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            AqshaTracker
          </h1>
        </motion.div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="text-foreground hover:text-primary-500 transition-colors">Features</a>
            <a href="#audiences" className="text-foreground hover:text-primary-500 transition-colors">Who it&apos;s for</a>
            <a href="#comparison" className="text-foreground hover:text-primary-500 transition-colors">Compare</a>
            <a href="#testimonials" className="text-foreground hover:text-primary-500 transition-colors">Reviews</a>
          </div>
          <div className="flex space-x-2">
            <ThemeToggle />
            <LanguageSwitcher 
              currentLocale={locale as Locale} 
              onChange={(newLocale) => setLocale(newLocale)}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-20 px-4 md:px-8 bg-gradient-to-b from-background to-card">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Take control of your finances <span className="text-primary-500">with AI</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            AqshaTracker helps you understand your money, reach your goals, and build financial freedom.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button size="lg">Start for Free</Button>
            <Button variant="outline" size="lg">How It Works</Button>
          </div>
          
          {/* App Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative mx-auto max-w-3xl"
          >
            <div className="bg-card border border-border shadow-lg rounded-xl p-4 overflow-hidden">
              <div className="h-[400px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-sm text-gray-500 mb-1">App Interface Mockup</p>
                  <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-500">
                        💡
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">AI Insight</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300">You&apos;ve spent 35% more on dining this month than your average. Want to create a dining budget?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart features for your finances</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful tools to help you manage your money efficiently and reach your financial goals.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card hoverable className="h-full">
                  <CardBody>
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Target Audiences Section */}
      <section id="audiences" className="w-full py-16 px-4 bg-card">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who is AqshaTracker for?</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Financial management tailored to your specific needs.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {audiences.map((audience, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card hoverable className="text-center p-6">
                  <div className="text-5xl mb-4">{audience.avatar}</div>
                  <h3 className="text-xl font-semibold mb-2">{audience.type}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{audience.caption}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* User Story Section */}
      <section className="w-full py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-500 flex items-center justify-center text-5xl">
                👩
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <blockquote className="text-xl md:text-2xl italic mb-4">
                &ldquo;I always felt like I had no money. AqshaTracker showed me where it all went — now I&apos;m saving with purpose.&rdquo;
              </blockquote>
              <p className="text-right font-medium">— Amelia, Graphic Designer</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="w-full py-16 px-4 bg-card">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How AqshaTracker Compares</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See why AqshaTracker is the smart choice for modern financial management.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-full border-collapse">
              <thead>
                <tr className="bg-primary-50 dark:bg-primary-900/30">
                  <th className="py-4 px-4 text-left border-b border-border">Feature</th>
                  <th className="py-4 px-4 text-center border-b border-border">AqshaTracker</th>
                  <th className="py-4 px-4 text-center border-b border-border">Excel</th>
                  <th className="py-4 px-4 text-center border-b border-border">Other Apps</th>
                </tr>
              </thead>
              <tbody>
                {comparisonItems.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/30' : ''}>
                    <td className="py-3 px-4 border-b border-border">{item.feature}</td>
                    <td className="py-3 px-4 text-center border-b border-border">
                      {item.aqsha === true ? (
                        <span className="text-success">✓</span>
                      ) : item.aqsha === false ? (
                        <span className="text-error">✗</span>
                      ) : (
                        item.aqsha
                      )}
                    </td>
                    <td className="py-3 px-4 text-center border-b border-border">
                      {item.excel === true ? (
                        <span className="text-success">✓</span>
                      ) : item.excel === false ? (
                        <span className="text-error">✗</span>
                      ) : (
                        item.excel
                      )}
                    </td>
                    <td className="py-3 px-4 text-center border-b border-border">
                      {item.others === true ? (
                        <span className="text-success">✓</span>
                      ) : item.others === false ? (
                        <span className="text-error">✗</span>
                      ) : (
                        item.others
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real stories from people who transformed their financial lives with AqshaTracker.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card hoverable className="h-full">
                  <CardBody>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-500 flex items-center justify-center text-xl mr-3">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="italic">&ldquo;{testimonial.comment}&rdquo;</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-16 px-4 bg-primary-500 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to master your money?</h2>
            <p className="text-xl mb-8">Try AqshaTracker today — it&apos;s free.</p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary-600 hover:bg-gray-100 dark:bg-white dark:text-primary-600 dark:hover:bg-gray-100"
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-4 bg-card border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">© 2023 AqshaTracker. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-primary-500">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-primary-500">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-primary-500">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}; 