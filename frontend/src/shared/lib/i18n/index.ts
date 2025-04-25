export const locales = ['en', 'ru'] as const;
export type Locale = typeof locales[number];
export const defaultLocale = 'en';

type Messages = {
  [key: string]: string | Messages;
};

type TranslationsType = {
  [locale in Locale]: Messages;
};

export const translations: TranslationsType = {
  en: {
    common: {
      title: 'AqshaTracker',
      theme: {
        light: 'Light',
        dark: 'Dark',
        system: 'System'
      },
      language: {
        en: 'English',
        ru: 'Russian'
      }
    },
    auth: {
      login: {
        title: 'Sign In',
        emailLabel: 'Email',
        emailPlaceholder: 'Enter your email',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        submitButton: 'Sign In',
        registerLink: "Don't have an account? Sign Up",
        errorTitle: 'Login failed',
        invalidCredentials: 'Invalid email or password',
        genericError: 'An error occurred. Please try again later.'
      },
      register: {
        title: 'Sign Up',
        emailLabel: 'Email',
        emailPlaceholder: 'Enter your email',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        confirmPasswordLabel: 'Confirm Password',
        confirmPasswordPlaceholder: 'Confirm your password',
        submitButton: 'Sign Up',
        loginLink: 'Already have an account? Sign In',
        errorTitle: 'Registration failed',
        emailExists: 'Email is already registered',
        genericError: 'An error occurred. Please try again later.'
      }
    }
  },
  ru: {
    common: {
      title: 'АкшаТрекер',
      theme: {
        light: 'Светлая',
        dark: 'Темная',
        system: 'Системная'
      },
      language: {
        en: 'Английский',
        ru: 'Русский'
      }
    },
    auth: {
      login: {
        title: 'Вход',
        emailLabel: 'Эл. почта',
        emailPlaceholder: 'Введите эл. почту',
        passwordLabel: 'Пароль',
        passwordPlaceholder: 'Введите пароль',
        submitButton: 'Войти',
        registerLink: 'Нет аккаунта? Зарегистрироваться',
        errorTitle: 'Ошибка входа',
        invalidCredentials: 'Неверный email или пароль',
        genericError: 'Произошла ошибка. Пожалуйста, попробуйте позже.'
      },
      register: {
        title: 'Регистрация',
        emailLabel: 'Эл. почта',
        emailPlaceholder: 'Введите эл. почту',
        passwordLabel: 'Пароль',
        passwordPlaceholder: 'Введите пароль',
        confirmPasswordLabel: 'Подтвердите пароль',
        confirmPasswordPlaceholder: 'Введите пароль ещё раз',
        submitButton: 'Зарегистрироваться',
        loginLink: 'Уже есть аккаунт? Войти',
        errorTitle: 'Ошибка регистрации',
        emailExists: 'Данный email уже зарегистрирован',
        genericError: 'Произошла ошибка. Пожалуйста, попробуйте позже.'
      }
    }
  }
}; 