import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'ru'] as const;
export const defaultLocale = 'en';

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales });

export type Locale = (typeof locales)[number]; 