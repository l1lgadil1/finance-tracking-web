import { FC } from 'react';
import Link from 'next/link';
import { RiHome5Line, RiWallet3Line, RiPieChartLine, RiExchangeDollarLine, RiSettings4Line } from 'react-icons/ri';
import { IconType } from 'react-icons';

interface SidebarProps {
  locale: string;
  activeHref: string;
}

interface NavigationItem {
  icon: IconType;
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { icon: RiHome5Line, label: 'Home', href: '/dashboard' },
  { icon: RiWallet3Line, label: 'Accounts', href: '/dashboard/accounts' },
  { icon: RiPieChartLine, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: RiExchangeDollarLine, label: 'Transactions', href: '/dashboard/transactions' },
  { icon: RiSettings4Line, label: 'Settings', href: '/dashboard/settings' },
];

export const Sidebar: FC<SidebarProps> = ({ locale, activeHref }) => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link 
          href={`/${locale}`}
          className="flex items-center gap-2 text-primary-600 dark:text-primary-400"
        >
          <span className="text-xl font-semibold">AqshaTracker</span>
        </Link>
      </div>
      
      {/* Navigation items */}
      <div className="py-4">
        <ul>
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <Link 
                  href={`/${locale}${item.href}`}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    ${item.href === activeHref ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : ''}
                  `}
                >
                  <Icon className="text-xl" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}; 