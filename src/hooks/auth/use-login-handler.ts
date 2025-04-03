
import { useDemoLogin } from './use-demo-login';
import { useRegularLogin } from './use-regular-login';
import { LoginFormValues } from '@/components/auth/login-schema';
import { UserRole } from '@/types';

export const useLoginHandler = () => {
  const { isSubmitting: demoIsSubmitting, handleDemoLogin } = useDemoLogin();
  const { isSubmitting: regularIsSubmitting, handleLogin } = useRegularLogin();

  // Use the most restrictive isSubmitting state
  const isSubmitting = demoIsSubmitting || regularIsSubmitting;

  return {
    isSubmitting,
    handleLogin,
    handleDemoLogin
  };
};
