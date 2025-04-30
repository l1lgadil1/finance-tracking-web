import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';
import { Button, Avatar } from '@/shared/ui';
import { Locale, defaultLocale, translations } from '@/shared/lib/i18n';
import { config } from '@/shared/config';
import { useAppStore } from '@/shared/model/store';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  locale: Locale;
  onChangeLocale: (locale: Locale) => void;
}

// Navigation items with their respective paths
const navigationItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Transactions', path: '/transactions' },
  { label: 'Accounts', path: '/accounts' },
  { label: 'Analytics', path: '/analytics' },
];

export const Header = ({ locale = defaultLocale, onChangeLocale }: HeaderProps) => {
  const router = useRouter();
  const { isAuthenticated, userProfile } = useAppStore();
  const { logout } = useAuth(locale);
  const t = translations[locale];

  // Animation variants
  const navItemVariants = {
    hover: { scale: 1.05, color: 'var(--color-primary-600)' },
    tap: { scale: 0.95 }
  };

  const handleLogout = () => {
    logout();
    router.push(`/${locale}`);
  };

  return (
    <motion.header 
      className="w-full border-b border-border bg-background shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mr-8"
          >
            <Link href={`/${locale}`} className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                {config.app.name}
              </span>
            </Link>
          </motion.div>
          
          <nav className="hidden md:flex space-x-6">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover="hover"
                whileTap="tap"
                variants={navItemVariants}
              >
                <Link 
                  href={`/${locale}${item.path}`} 
                  className="text-foreground transition-colors hover:text-primary-600"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <LanguageSwitcher 
            currentLocale={locale} 
            onChange={onChangeLocale}
          />
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Avatar 
                  name={userProfile?.name || 'User'}
                  size="sm"
                  status="online"
                  className="cursor-pointer"
                  onClick={() => router.push(`/${locale}/profile`)}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                >
                  {t.auth.logout || 'Logout'}
                </Button>
              </motion.div>
            </div>
          ) : (
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
                  {t.auth.login.title || 'Log In'}
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
                  {t.auth.register.title || 'Sign Up'}
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}; 