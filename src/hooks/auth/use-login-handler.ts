
import { useDemoLogin } from './use-demo-login';
import { useRegularLogin } from './use-regular-login';
import { useSignup } from './use-signup';
import { LoginFormValues } from '@/components/auth/login-schema';
import { SignupFormValues } from '@/components/auth/signup-schema';
import { UserRole } from '@/types';

export const useLoginHandler = () => {
  const { isSubmitting: demoIsSubmitting, handleDemoLogin } = useDemoLogin();
  const { isSubmitting: regularIsSubmitting, handleLogin } = useRegularLogin();
  const { isSubmitting: signupIsSubmitting, handleSignup } = useSignup();

  // Use the most restrictive isSubmitting state
  const isSubmitting = demoIsSubmitting || regularIsSubmitting || signupIsSubmitting;

  return {
    isSubmitting,
    handleLogin,
    handleDemoLogin,
    handleSignup
  };
};
