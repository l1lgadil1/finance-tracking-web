import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Locale, defaultLocale } from '@/lib/i18n';

interface AppState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userProfile: {
    id: string;
    name: string;
    email: string;
  } | null;
  setUserProfile: (profile: AppState['userProfile']) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale) => set({ locale }),
      isAuthenticated: false,
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ locale: state.locale }),
    }
  )
); 