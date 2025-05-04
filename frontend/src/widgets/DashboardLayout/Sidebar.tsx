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
    <aside className="w-64 bg-card border-r border-border transition-colors duration-200" role="navigation" aria-label="Main Navigation">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link 
          href={`/${locale}`}
          className="flex items-center gap-2 text-primary-600 dark:text-primary-400 transition-colors duration-200"
          aria-label="Go to home page"
        >
          <span className="text-xl font-semibold">AqshaTracker</span>
        </Link>
      </div>
      
      {/* Navigation items */}
      <nav className="py-4">
        <ul role="menu">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            // Check if the current path includes the item path
            // Special case for dashboard as it's a prefix for all routes
            const isActive = item.href === '/dashboard' 
              ? activeHref === '/dashboard' || activeHref === '/'
              : activeHref.includes(item.href);
            
            return (
              <li key={index} role="none">
                <Link 
                  href={`/${locale}${item.href}`}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-foreground
                    hover:bg-accent transition-colors duration-150
                    ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 font-medium' : ''}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                  role="menuitem"
                >
                  <Icon className="text-xl flex-shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}; 