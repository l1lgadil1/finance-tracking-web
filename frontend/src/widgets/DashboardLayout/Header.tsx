import { FC, ReactNode } from 'react';

interface HeaderProps {
  username: string;
  email: string;
  pageName: string;
  children?: ReactNode;
}

export const Header: FC<HeaderProps> = ({ username, email, pageName, children }) => {
  return (
    <header 
      className="p-4 bg-card border-b border-border flex justify-between items-center transition-colors duration-200" 
      role="banner"
      aria-label="Dashboard header"
    >
      <div className="flex items-center">
        {children}
        <h1 className="text-xl font-semibold text-foreground">{pageName}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold transition-colors duration-200"
            aria-hidden="true"
          >
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{username}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}; 