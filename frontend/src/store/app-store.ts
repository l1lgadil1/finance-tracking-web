import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Locale, defaultLocale } from '@/lib/i18n';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AppState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale) => set({ locale }),
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user: User, token: string) => set({ isAuthenticated: true, user, token }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        locale: state.locale,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
); 