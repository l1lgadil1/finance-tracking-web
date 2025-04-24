import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, Locale } from '@/shared/lib/i18n';

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Skip if the request is for public or API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(png|jpg|svg|ico|json|js|css)$/)
  ) {
    return NextResponse.next();
  }

  // Get the preferred locale from the request cookies
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  
  // Get the preferred locale from the accept-language header
  const acceptLanguage = request.headers.get('accept-language')?.split(',')[0].split('-')[0];
  
  // Get the preferred locale from the request path
  const pathLocale = pathname.split('/')[1];
  
  // Determine the preferred locale
  let preferredLocale: Locale;
  
  // Check if the path locale is valid
  if (pathLocale && locales.includes(pathLocale as Locale)) {
    return NextResponse.next();
  }
  
  // Use cookie locale if available and valid
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    preferredLocale = cookieLocale as Locale;
  } 
  // Or use accept-language header if available and valid
  else if (acceptLanguage && locales.includes(acceptLanguage as Locale)) {
    preferredLocale = acceptLanguage as Locale;
  } 
  // Otherwise use default locale
  else {
    preferredLocale = defaultLocale;
  }
  
  // Rewrite the URL with the preferred locale
  return NextResponse.redirect(
    new URL(`/${preferredLocale}${pathname}`, request.url)
  );
} 