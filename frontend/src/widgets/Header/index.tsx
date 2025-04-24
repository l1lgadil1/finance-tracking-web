import { motion } from 'framer-motion';
import Link from 'next/link';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';
import { Button, Avatar } from '@/shared/ui';
import { Locale, defaultLocale } from '@/shared/lib/i18n';
import { config } from '@/shared/config';
import { useAppStore } from '@/shared/model/store';

interface HeaderProps {
  locale: Locale;
  onChangeLocale: (locale: Locale) => void;
}

export const Header = ({ locale = defaultLocale, onChangeLocale }: HeaderProps) => {
  const { isAuthenticated, userProfile } = useAppStore();

  return (
    <header className="w-full border-b border-border bg-background shadow-sm">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mr-8"
          >
            <span className="text-2xl font-bold text-primary-600">
              {config.app.name}
            </span>
          </motion.div>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-foreground hover:text-primary-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/transactions" className="text-foreground hover:text-primary-600 transition-colors">
              Transactions
            </Link>
            <Link href="/accounts" className="text-foreground hover:text-primary-600 transition-colors">
              Accounts
            </Link>
            <Link href="/analytics" className="text-foreground hover:text-primary-600 transition-colors">
              Analytics
            </Link>
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
              <Avatar 
                name={userProfile?.name || 'User'}
                size="sm"
                status="online"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
              <Button variant="primary" size="sm">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}; 