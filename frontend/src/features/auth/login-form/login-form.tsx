'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@/shared/ui';
import { authApi, LoginCredentials } from '../auth-api';

// API error interface
interface ApiError {
  statusCode: number;
  message: string;
}

// Login form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
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
    submitButton: 'Sign In',
    registerLink: "Don't have an account? Sign Up",
    errorTitle: 'Login failed',
    invalidCredentials: 'Invalid email or password',
    genericError: 'An error occurred. Please try again later.',
  },
  ru: {
    title: 'Вход',
    emailLabel: 'Эл. почта',
    emailPlaceholder: 'Введите эл. почту',
    passwordLabel: 'Пароль',
    passwordPlaceholder: 'Введите пароль',
    submitButton: 'Войти',
    registerLink: 'Нет аккаунта? Зарегистрироваться',
    errorTitle: 'Ошибка входа',
    invalidCredentials: 'Неверный email или пароль',
    genericError: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
  },
};

interface LoginFormProps {
  locale?: 'en' | 'ru';
  onSuccess?: () => void;
}

export const LoginForm = ({ locale = 'en', onSuccess }: LoginFormProps) => {
  const t = translations[locale];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password,
      };

      const response = await authApi.login(credentials);
      
      // Save the token
      authApi.saveToken(response.accessToken);
      
      // Trigger success callback or redirect
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/${locale}/dashboard`);
      }
    } catch (err: unknown) {
      // Handle different error types
      if (err && typeof err === 'object' && 'statusCode' in err) {
        const apiError = err as ApiError;
        if (apiError.statusCode === 401) {
          setError(t.invalidCredentials);
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
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-error/10 text-error p-3 rounded-md text-sm"
              >
                {error}
              </motion.div>
            )}

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
                {...register('email')}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                type="password"
                label={t.passwordLabel}
                placeholder={t.passwordPlaceholder}
                leftIcon={<FiLock />}
                error={errors.password?.message}
                fullWidth
                {...register('password')}
              />
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