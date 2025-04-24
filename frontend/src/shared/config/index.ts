export const config = {
  app: {
    name: 'AqshaTracker',
    description: 'Personal finance tracking application',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
};

export const routes = {
  home: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  dashboard: '/dashboard',
  transactions: '/transactions',
  accounts: '/accounts',
}; 