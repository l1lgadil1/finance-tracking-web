import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Locale, defaultLocale } from '@/shared/lib/i18n';
import { UserProfile } from '@/entities/user/api/userApi';

interface AppState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
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