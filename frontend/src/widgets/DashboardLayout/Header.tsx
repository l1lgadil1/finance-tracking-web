import { FC, ReactNode } from 'react';
import { Locale } from '@/shared/lib/i18n';
import { NotificationDropdown } from '@/entities/notification/ui/NotificationDropdown';

interface HeaderProps {
  username: string;
  email: string;
  pageName: string;
  locale: Locale;
  children?: ReactNode;
}

export const Header: FC<HeaderProps> = ({ username, email, pageName, locale, children }) => {
  return (
    <header 
      className="h-16 px-4 bg-card border-b border-border flex justify-between items-center transition-colors duration-200" 
      role="banner"
      aria-label="Dashboard header"
    >
      <div className="flex items-center">
        {children}
        <h1 className="text-xl font-semibold text-foreground truncate">
          {typeof pageName === 'string' ? 
            pageName === 'Dashboard' ? 
              locale === 'ru' ? 'Панель управления' : pageName :
              locale === 'ru' ? 
                pageName.charAt(0).toUpperCase() + pageName.slice(1) : 
                pageName
          : pageName}
        </h1>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Notification dropdown */}
        <NotificationDropdown locale={locale} />
        
        {/* User profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div 
            className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold transition-colors duration-200"
            aria-hidden="true"
          >
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">{username}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}; 