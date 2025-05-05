// Simple date formatting function that accepts a format string pattern
export const formatDate = (date: Date, formatStr: string): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  // Pad with leading zero if needed
  const pad = (num: number): string => num.toString().padStart(2, '0');
  
  // Replace format tokens with their values
  return formatStr
    .replace('yyyy', year.toString())
    .replace('MM', pad(month))
    .replace('dd', pad(day))
    .replace('HH', pad(hours))
    .replace('mm', pad(minutes))
    .replace('ss', pad(seconds));
};

// Format the date relative to now (e.g., "2 hours ago", "just now")
export const getRelativeTime = (dateStr: string, locale: string = 'en'): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Translations for time units
  const translations: Record<string, Record<string, string>> = {
    en: {
      justNow: 'just now',
      seconds: 'seconds ago',
      minute: 'a minute ago',
      minutes: 'minutes ago',
      hour: 'an hour ago',
      hours: 'hours ago',
      day: 'a day ago',
      days: 'days ago',
      week: 'a week ago',
      weeks: 'weeks ago',
      month: 'a month ago',
      months: 'months ago',
      year: 'a year ago',
      years: 'years ago',
    },
    ru: {
      justNow: 'только что',
      seconds: 'секунд назад',
      minute: 'минуту назад',
      minutes: 'минут назад',
      hour: 'час назад',
      hours: 'часов назад',
      day: 'день назад',
      days: 'дней назад',
      week: 'неделю назад',
      weeks: 'недель назад',
      month: 'месяц назад',
      months: 'месяцев назад',
      year: 'год назад',
      years: 'лет назад',
    }
  };
  
  // Get appropriate translation set
  const t = translations[locale] || translations.en;
  
  // Less than 60 seconds
  if (diffInSeconds < 30) {
    return t.justNow;
  }
  
  // Less than 60 seconds
  if (diffInSeconds < 60) {
    return `${diffInSeconds} ${t.seconds}`;
  }
  
  // Less than 60 minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes === 1) {
    return t.minute;
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${t.minutes}`;
  }
  
  // Less than 24 hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) {
    return t.hour;
  }
  if (diffInHours < 24) {
    return `${diffInHours} ${t.hours}`;
  }
  
  // Less than 7 days
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return t.day;
  }
  if (diffInDays < 7) {
    return `${diffInDays} ${t.days}`;
  }
  
  // Less than 30 days
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 1) {
    return t.week;
  }
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${t.weeks}`;
  }
  
  // Less than 12 months
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths === 1) {
    return t.month;
  }
  if (diffInMonths < 12) {
    return `${diffInMonths} ${t.months}`;
  }
  
  // More than 12 months
  const diffInYears = Math.floor(diffInDays / 365);
  if (diffInYears === 1) {
    return t.year;
  }
  return `${diffInYears} ${t.years}`;
};

// Format date for display in a user-friendly format
export const formatDisplayDate = (dateStr: string, locale: string = 'en'): string => {
  const date = new Date(dateStr);
  
  // Format options based on how long ago the date was
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
  const isThisYear = date.getFullYear() === new Date().getFullYear();
  
  // Return appropriate format based on the date
  if (isToday) {
    return locale === 'ru' ? 'Сегодня' : 'Today';
  } else if (isYesterday) {
    return locale === 'ru' ? 'Вчера' : 'Yesterday';
  } else if (isThisYear) {
    // Format: "Jan 15" or "15 янв"
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', options);
  } else {
    // Format: "Jan 15, 2022" or "15 янв 2022"
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', options);
  }
}; 