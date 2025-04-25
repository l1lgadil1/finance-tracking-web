import { FC } from 'react';
import Link from 'next/link';

interface SidebarProps {
  locale: string;
  activeHref: string;
}

interface NavigationItem {
  icon: string;
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { icon: '🏠', label: 'Home', href: '/dashboard' },
  { icon: '💰', label: 'Accounts', href: '/accounts' },
  { icon: '📊', label: 'Analytics', href: '/analytics' },
  { icon: '💸', label: 'Transactions', href: '/transactions' },
  { icon: '⚙️', label: 'Settings', href: '/settings' },
];

export const Sidebar: FC<SidebarProps> = ({ locale, activeHref }) => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link 
          href={`/${locale}/dashboard`}
          className="flex items-center gap-2 text-primary-600 dark:text-primary-400"
        >
          <span className="text-2xl">💰</span>
          <span className="text-xl font-semibold">Aqsha</span>
        </Link>
      </div>
      
      {/* Navigation items */}
      <div className="py-4">
        <ul>
          {navigationItems.map((item, index) => (
            <li key={index}>
              <Link 
                href={`/${locale}${item.href}`}
                className={`
                  flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  ${item.href === activeHref ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : ''}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 