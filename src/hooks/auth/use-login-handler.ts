
import { useDemoLogin } from './use-demo-login';
import { useRegularLogin } from './use-regular-login';
import { useSignup } from './use-signup';
import { LoginFormValues } from '@/components/auth/login-schema';
import { SignupFormValues } from '@/components/auth/signup-schema';
import { UserRole } from '@/types';

// Create a utility function to clean up auth state that is not dependent on any hooks
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
};

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
    handleSignup,
    cleanupAuthState
  };
};
