'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';

import { Button, Card, CardBody, CardFooter, CardHeader, Input, Checkbox } from '@/shared/ui';
import { authApi, LoginCredentials } from '../auth-api';
import { useAppStore } from '@/shared/model';

// API error interface
interface ApiError {
  statusCode: number;
  message: string;
}

// Login form validation schema
const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Translations
const translations = {
  en: {
    title: 'Sign In',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    rememberMe: 'Remember me',
    submitButton: 'Sign In',
    registerLink: "Don't have an account? Sign Up",
    forgotPassword: 'Forgot password?',
    errorTitle: 'Login failed',
    invalidCredentials: 'Invalid email or password',
    tooManyAttempts: 'Too many login attempts. Please try again later.',
    genericError: 'An error occurred. Please try again later.',
  },
  ru: {
    title: 'Вход',
    emailLabel: 'Эл. почта',
    emailPlaceholder: 'Введите эл. почту',
    passwordLabel: 'Пароль',
    passwordPlaceholder: 'Введите пароль',
    rememberMe: 'Запомнить меня',
    submitButton: 'Войти',
    registerLink: 'Нет аккаунта? Зарегистрироваться',
    forgotPassword: 'Забыли пароль?',
    errorTitle: 'Ошибка входа',
    invalidCredentials: 'Неверный email или пароль',
    tooManyAttempts: 'Слишком много попыток входа. Попробуйте позже.',
    genericError: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
  },
};

interface LoginFormProps {
  locale?: 'en' | 'ru';
  onSuccess?: () => void;
}

export const LoginForm = ({ locale = 'en', onSuccess }: LoginFormProps) => {
  const t = translations[locale];
  const { setIsAuthenticated } = useAppStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    // Check for too many login attempts
    if (loginAttempts >= 5) {
      setError(t.tooManyAttempts);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      };

      const response = await authApi.login(credentials);
      
      // Save the tokens
      authApi.saveTokens(response);
      setIsAuthenticated(true);
      
      // Reset login attempts on success
      setLoginAttempts(0);

      // Trigger success callback or redirect
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/${locale}/dashboard`);
      }
    } catch (err: unknown) {
      // Increment login attempts
      setLoginAttempts(prev => prev + 1);

      // Handle different error types
      if (err && typeof err === 'object' && 'statusCode' in err) {
        const apiError = err as ApiError;
        if (apiError.statusCode === 401) {
          setError(t.invalidCredentials);
        } else if (apiError.statusCode === 429) {
          setError(t.tooManyAttempts);
        } else {
          setError(t.genericError);
        }
      } else {
        setError(t.genericError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card>
        <CardHeader className="text-center">
          <motion.h2 
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {t.title}
          </motion.h2>
        </CardHeader>
        
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-error/10 text-error p-3 rounded-md text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                label={t.emailLabel}
                placeholder={t.emailPlaceholder}
                leftIcon={<FiMail />}
                error={errors.email?.message}
                fullWidth
                autoComplete="email"
                {...register('email')}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <Input
                type={showPassword ? 'text' : 'password'}
                label={t.passwordLabel}
                placeholder={t.passwordPlaceholder}
                leftIcon={<FiLock />}
                rightIcon={
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                }
                error={errors.password?.message}
                fullWidth
                autoComplete="current-password"
                {...register('password')}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex items-center justify-between"
            >
              <Checkbox
                label={t.rememberMe}
                {...register('rememberMe')}
              />
              <Link
                href={`/${locale}/auth/forgot-password`}
                className="text-sm text-primary-500 hover:underline"
              >
                {t.forgotPassword}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                rightIcon={<FiLogIn />}
                disabled={loginAttempts >= 5}
              >
                {t.submitButton}
              </Button>
            </motion.div>
          </form>
        </CardBody>
        
        <CardFooter className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link 
              href={`/${locale}/auth/register`}
              className="text-primary-500 hover:underline text-sm"
            >
              {t.registerLink}
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}; 