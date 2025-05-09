'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAppStore } from '@/store/app-store';
import { Locale, translations } from '@/lib/i18n';
import { Button } from '@/shared/ui/Button';
import { Card, CardBody } from '@/shared/ui/Card';
import { Avatar } from '@/shared/ui/Avatar';
import { 
  FaChartLine, 
  FaRobot, 
  FaBullseye, 
  FaUsers, 
  FaChartBar, 
  FaClipboardList,
  FaUserGraduate,
  FaUserTie,
  FaLaptopCode,
  FaUsers as FaFamily,
  FaLightbulb
} from 'react-icons/fa';

// Type for nested translations
type NestedMessages = {
  [key: string]: string | NestedMessages;
};

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

// Localization dictionaries
const landingPageTranslations = {
  en: {
    nav: {
      features: 'Features',
      whoFor: 'Who it\'s for',
      compare: 'Compare',
      reviews: 'Reviews'
    },
    hero: {
      title: 'Take control of your finances',
      titleHighlight: 'with AI',
      subtitle: 'AqshaTracker helps you understand your money, reach your goals, and build financial freedom.',
      startButton: 'Start for Free',
      howItWorks: 'How It Works',
      mockupLabel: 'App Interface Mockup',
      aiInsight: 'AI Insight',
      aiMessage: 'You\'ve spent 35% more on dining this month than your average. Want to create a dining budget?'
    },
    features: {
      title: 'Smart features for your finances',
      subtitle: 'Powerful tools to help you manage your money efficiently and reach your financial goals.',
      items: [
        {
          title: 'Smart Tracking',
          description: 'Automatically categorize and track your income & expenses',
          icon: FaChartLine
        },
        {
          title: 'AI Assistant',
          description: 'Get personalized financial insights and recommendations',
          icon: FaRobot
        },
        {
          title: 'Goal Setting',
          description: 'Set financial goals and track your progress',
          icon: FaBullseye
        },
        {
          title: 'Multiple Profiles',
          description: 'Manage personal, family, or business finances separately',
          icon: FaUsers
        },
        {
          title: 'In-depth Analytics',
          description: 'Visualize your spending patterns and financial health',
          icon: FaChartBar
        },
        {
          title: 'Transaction History',
          description: 'View and search your complete financial history',
          icon: FaClipboardList
        }
      ]
    },
    audiences: {
      title: 'Who is AqshaTracker for?',
      subtitle: 'Financial management tailored to your specific needs.',
      items: [
        {
          type: 'Students',
          caption: 'Master your stipend',
          icon: FaUserGraduate
        },
        {
          type: 'Professionals',
          caption: 'Save for what matters',
          icon: FaUserTie
        },
        {
          type: 'Entrepreneurs',
          caption: 'Know your profit',
          icon: FaLaptopCode
        },
        {
          type: 'Families',
          caption: 'Coordinate a shared budget',
          icon: FaFamily
        }
      ]
    },
    userStory: {
      quote: 'I always felt like I had no money. AqshaTracker showed me where it all went — now I\'m saving with purpose.',
      author: 'Amelia, Graphic Designer'
    },
    comparison: {
      title: 'How AqshaTracker Compares',
      subtitle: 'See why AqshaTracker is the smart choice for modern financial management.',
      tableHeaders: {
        feature: 'Feature',
        aqsha: 'AqshaTracker',
        excel: 'Excel',
        others: 'Other Apps'
      },
      items: [
        { feature: 'AI-powered insights', aqsha: true, excel: false, others: false },
        { feature: 'Multi-profile support', aqsha: true, excel: false, others: 'Limited' },
        { feature: 'User-friendly interface', aqsha: true, excel: false, others: 'Varies' },
        { feature: 'Goal tracking', aqsha: true, excel: 'Manual', others: 'Basic' },
        { feature: 'Free plan', aqsha: true, excel: 'Paid', others: 'Limited' }
      ]
    },
    testimonials: {
      title: 'What Our Users Say',
      subtitle: 'Real stories from people who transformed their financial lives with AqshaTracker.',
      items: [
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
      ]
    },
    cta: {
      title: 'Ready to master your money?',
      subtitle: 'Try AqshaTracker today — it\'s free.',
      button: 'Get Started Now'
    },
    footer: {
      copyright: '© 2025 AqshaTracker. All rights reserved.',
      links: {
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        contact: 'Contact'
      }
    },
    auth: {
      login: {
        title: 'Login'
      },
      register: {
        title: 'Register'
      }
    },
    dashboard: {
      title: 'Dashboard',
      transactions: 'Transactions',
      analytics: 'Analytics',
      profile: 'Profile',
      logout: 'Logout'
    }
  },
  ru: {
    nav: {
      features: 'Функции',
      whoFor: 'Для кого',
      compare: 'Сравнение',
      reviews: 'Отзывы'
    },
    hero: {
      title: 'Возьмите под контроль свои финансы',
      titleHighlight: 'с ИИ',
      subtitle: 'АкшаТрекер помогает понять ваши финансы, достичь целей и построить финансовую свободу.',
      startButton: 'Начать бесплатно',
      howItWorks: 'Как это работает',
      mockupLabel: 'Макет интерфейса приложения',
      aiInsight: 'ИИ инсайт',
      aiMessage: 'Вы потратили на 35% больше на питание в этом месяце, чем в среднем. Хотите создать бюджет на питание?'
    },
    features: {
      title: 'Умные функции для ваших финансов',
      subtitle: 'Мощные инструменты для эффективного управления деньгами и достижения финансовых целей.',
      items: [
        {
          title: 'Умное отслеживание',
          description: 'Автоматически категоризируйте и отслеживайте доходы и расходы',
          icon: FaChartLine
        },
        {
          title: 'ИИ ассистент',
          description: 'Получайте персонализированные финансовые аналитики и рекомендации',
          icon: FaRobot
        },
        {
          title: 'Постановка целей',
          description: 'Установите финансовые цели и отслеживайте свой прогресс',
          icon: FaBullseye
        },
        {
          title: 'Несколько профилей',
          description: 'Управляйте личными, семейными или бизнес-финансами отдельно',
          icon: FaUsers
        },
        {
          title: 'Глубокая аналитика',
          description: 'Визуализируйте свои расходы и финансовое здоровье',
          icon: FaChartBar
        },
        {
          title: 'История транзакций',
          description: 'Просматривайте и ищите вашу полную финансовую историю',
          icon: FaClipboardList
        }
      ]
    },
    audiences: {
      title: 'Для кого подходит АкшаТрекер?',
      subtitle: 'Финансовое управление, адаптированное к вашим конкретным потребностям.',
      items: [
        {
          type: 'Студенты',
          caption: 'Управляйте стипендией',
          icon: FaUserGraduate
        },
        {
          type: 'Профессионалы',
          caption: 'Откладывайте на важное',
          icon: FaUserTie
        },
        {
          type: 'Предприниматели',
          caption: 'Знайте свою прибыль',
          icon: FaLaptopCode
        },
        {
          type: 'Семьи',
          caption: 'Координируйте общий бюджет',
          icon: FaFamily
        }
      ]
    },
    userStory: {
      quote: 'Мне всегда казалось, что у меня нет денег. АкшаТрекер показал, куда они уходят — теперь я коплю целенаправленно.',
      author: 'Амелия, Графический дизайнер'
    },
    comparison: {
      title: 'Сравнение АкшаТрекера',
      subtitle: 'Узнайте, почему АкшаТрекер - умный выбор для современного управления финансами.',
      tableHeaders: {
        feature: 'Функция',
        aqsha: 'АкшаТрекер',
        excel: 'Excel',
        others: 'Другие приложения'
      },
      items: [
        { feature: 'ИИ-аналитика', aqsha: true, excel: false, others: false },
        { feature: 'Поддержка нескольких профилей', aqsha: true, excel: false, others: 'Ограничено' },
        { feature: 'Удобный интерфейс', aqsha: true, excel: false, others: 'Различается' },
        { feature: 'Отслеживание целей', aqsha: true, excel: 'Вручную', others: 'Базовое' },
        { feature: 'Бесплатный план', aqsha: true, excel: 'Платно', others: 'Ограничено' }
      ]
    },
    testimonials: {
      title: 'Что говорят наши пользователи',
      subtitle: 'Реальные истории людей, которые преобразили свою финансовую жизнь с АкшаТрекером.',
      items: [
        {
          name: 'Сара К.',
          role: 'Маркетинг-менеджер',
          comment: 'АкшаТрекер помог мне накопить на отпуск мечты. Аналитика ИИ открыла глаза!',
          avatar: '👩‍🦰'
        },
        {
          name: 'Михаил Т.',
          role: 'Аспирант',
          comment: 'Управлять студенческими кредитами и расходами стало проще. Это приложение - спасение!',
          avatar: '👨‍🎓'
        },
        {
          name: 'Жессика Л.',
          role: 'Владелец малого бизнеса',
          comment: 'Наконец-то я могу разделить бизнес и личные финансы с разными профилями. Игра изменилась!',
          avatar: '👩‍💼'
        }
      ]
    },
    cta: {
      title: 'Готовы управлять своими деньгами?',
      subtitle: 'Попробуйте АкшаТрекер сегодня — это бесплатно.',
      button: 'Начать сейчас'
    },
    footer: {
      copyright: '© 2025 АкшаТрекер. Все права защищены.',
      links: {
        privacy: 'Политика конфиденциальности',
        terms: 'Условия использования',
        contact: 'Контакты'
      }
    },
    auth: {
      login: {
        title: 'Войти'
      },
      register: {
        title: 'Регистрация'
      }
    },
    dashboard: {
      title: 'Панель управления',
      transactions: 'Транзакции',
      analytics: 'Аналитика',
      profile: 'Профиль',
      logout: 'Выйти'
    }
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ params }) => {
  const router = useRouter();
  const { setLocale, locale, isAuthenticated, user, logout } = useAppStore();
  console.log(isAuthenticated,'isAuthenticated');
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

  // Get localized text based on current locale
  const t = landingPageTranslations[locale as Locale] || landingPageTranslations.en;

  const handleStartClick = () => {
    router.push(`/${locale}/auth/register`);
  };

  const handleHowItWorksClick = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    logout();
    router.push(`/${locale}/auth/login`);
  };

  const handleDashboardClick = () => {
    router.push(`/${locale}/dashboard`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Navigation */}
      <nav className="w-full px-4 py-4 flex justify-between items-center bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <h1 
            className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent cursor-pointer"
            onClick={() => router.push('/')}
          >
            {((translations[locale as Locale]?.common as NestedMessages)?.title as string) || 'AqshaTracker'}
          </h1>
        </motion.div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            // Authenticated Navigation
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex space-x-6">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/${locale}/dashboard`)}
                > 
                  {t.dashboard.title}
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/${locale}/dashboard/transactions`)}
                >
                  {t.dashboard.transactions}
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/${locale}/dashboard/analytics`)}
                >
                  {t.dashboard.analytics}
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <ThemeToggle />
                  <LanguageSwitcher 
                    currentLocale={locale as Locale} 
                    onChange={(newLocale) => setLocale(newLocale)}
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 cursor-pointer relative group"
                  onClick={() => router.push(`/${locale}/profile`)}
                >
                  <Avatar 
                    src={user?.avatar}
                    name={user?.name}
                    size="sm"
                  />
                  <span className="hidden md:inline font-medium">{user?.name}</span>
                  <motion.div 
                    className="absolute right-0 top-full mt-2 w-48 py-2 bg-card rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                    initial={false}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full text-left px-4 py-2 hover:bg-primary-100 dark:hover:bg-primary-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/${locale}/dashboard`);
                      }}
                    >
                      {t.dashboard.title}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full text-left px-4 py-2 hover:bg-primary-100 dark:hover:bg-primary-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                      }}
                    >
                      {t.dashboard.logout}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-6">
                <a href="#features" className="text-foreground hover:text-primary-500 transition-colors">{t.nav.features}</a>
                <a href="#audiences" className="text-foreground hover:text-primary-500 transition-colors">{t.nav.whoFor}</a>
                <a href="#comparison" className="text-foreground hover:text-primary-500 transition-colors">{t.nav.compare}</a>
                <a href="#testimonials" className="text-foreground hover:text-primary-500 transition-colors">{t.nav.reviews}</a>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <ThemeToggle />
                  <LanguageSwitcher 
                    currentLocale={locale as Locale} 
                    onChange={(newLocale) => setLocale(newLocale)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => router.push(`/${locale}/auth/login`)}
                    >
                      {t.auth.login.title}
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => router.push(`/${locale}/auth/register`)}
                    >
                      {t.auth.register.title}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

        <>
          {/* Hero Section */}
          <section className="w-full flex flex-col items-center justify-center py-20 px-4 md:px-8 bg-gradient-to-b from-background to-card">
            <motion.div
              className="max-w-5xl mx-auto text-center"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {t.hero.title} <span className="text-primary-500">{t.hero.titleHighlight}</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg"
                    onClick={handleStartClick}
                  >
                    {t.hero.startButton}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleHowItWorksClick}
                  >
                    {t.hero.howItWorks}
                  </Button>
                </motion.div>
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
                      <p className="text-sm text-gray-500 mb-1">{t.hero.mockupLabel}</p>
                      <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-500">
                            <FaLightbulb />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium">{t.hero.aiInsight}</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-300">{t.hero.aiMessage}</p>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.features.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t.features.subtitle}
                </p>
              </motion.div>
              
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {t.features.items.map((feature, index) => (
                  <motion.div key={index} variants={fadeIn}>
                    <Card hoverable className="h-full">
                      <CardBody>
                        <div className="text-4xl mb-4 text-primary-500">
                          <feature.icon />
                        </div>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.audiences.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t.audiences.subtitle}
                </p>
              </motion.div>
              
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {t.audiences.items.map((audience, index) => (
                  <motion.div key={index} variants={fadeIn}>
                    <Card hoverable className="text-center p-6">
                      <div className="text-5xl mb-4 text-primary-500">
                        <audience.icon />
                      </div>
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
                    &ldquo;{t.userStory.quote}&rdquo;
                  </blockquote>
                  <p className="text-right font-medium">— {t.userStory.author}</p>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.comparison.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t.comparison.subtitle}
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
                      <th className="py-4 px-4 text-left border-b border-border">{t.comparison.tableHeaders.feature}</th>
                      <th className="py-4 px-4 text-center border-b border-border">{t.comparison.tableHeaders.aqsha}</th>
                      <th className="py-4 px-4 text-center border-b border-border">{t.comparison.tableHeaders.excel}</th>
                      <th className="py-4 px-4 text-center border-b border-border">{t.comparison.tableHeaders.others}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.comparison.items.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-background dark:bg-gray-800/30' : ''}>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.testimonials.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t.testimonials.subtitle}
                </p>
              </motion.div>
              
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {t.testimonials.items.map((testimonial, index) => (
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.cta.title}</h2>
                <p className="text-xl mb-8">{t.cta.subtitle}</p>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white text-primary-600 hover:bg-gray-100 dark:bg-white dark:text-primary-600 dark:hover:bg-gray-100"
                >
                  {t.cta.button}
                </Button>
              </motion.div>
            </div>
          </section>
        </>

      {/* Footer */}
      <footer className="w-full py-8 px-4 bg-card border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">{t.footer.copyright}</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-primary-500">{t.footer.links.privacy}</a>
              <a href="#" className="text-gray-500 hover:text-primary-500">{t.footer.links.terms}</a>
              <a href="#" className="text-gray-500 hover:text-primary-500">{t.footer.links.contact}</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}; 