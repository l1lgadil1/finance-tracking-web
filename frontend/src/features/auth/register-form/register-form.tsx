'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FiMail, FiLock, FiUserPlus } from 'react-icons/fi';

import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@/shared/ui';
import { authApi, RegisterCredentials } from '../auth-api';

// API error interface
interface ApiError {
  statusCode: number;
  message: string;
}

// Registration form validation schema
const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Translations
const translations = {
  en: {
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
    genericError: 'An error occurred. Please try again later.',
  },
  ru: {
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
    genericError: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
  },
};

interface RegisterFormProps {
  locale?: 'en' | 'ru';
  onSuccess?: () => void;
}

export const RegisterForm = ({ locale = 'en', onSuccess }: RegisterFormProps) => {
  const t = translations[locale];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const credentials: RegisterCredentials = {
        email: data.email,
        password: data.password,
      };

      const response = await authApi.register(credentials);
      
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
        if (apiError.statusCode === 409) {
          setError(t.emailExists);
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
              <Input
                type="password"
                label={t.confirmPasswordLabel}
                placeholder={t.confirmPasswordPlaceholder}
                leftIcon={<FiLock />}
                error={errors.confirmPassword?.message}
                fullWidth
                {...register('confirmPassword')}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                rightIcon={<FiUserPlus />}
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
            transition={{ delay: 0.6 }}
          >
            <Link 
              href={`/${locale}/auth/login`}
              className="text-primary-500 hover:underline text-sm"
            >
              {t.loginLink}
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}; 