import { FC } from 'react';

interface HeaderProps {
  username: string;
  email: string;
  pageName: string;
}

export const Header: FC<HeaderProps> = ({ username, email, pageName }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{pageName}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-800 font-bold">
            {username.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium">{username}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 