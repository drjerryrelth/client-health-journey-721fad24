
import { useDemoLogin } from './use-demo-login';
import { useRegularLogin } from './use-regular-login';
import { useSignup } from './use-signup';
import { cleanupAuthState } from '@/utils/auth-utils';

// Re-export cleanupAuthState for backward compatibility
export { cleanupAuthState };

export const useLoginHandler = () => {
  // Import hooks directly without creating circular dependencies
  const demoLoginHook = useDemoLogin();
  const regularLoginHook = useRegularLogin();
  const signupHook = useSignup();

  // Use the most restrictive isSubmitting state
  const isSubmitting = 
    demoLoginHook.isSubmitting || 
    regularLoginHook.isSubmitting || 
    signupHook.isSubmitting;

  return {
    isSubmitting,
    handleLogin: regularLoginHook.handleLogin,
    handleDemoLogin: demoLoginHook.handleDemoLogin,
    handleSignup: signupHook.handleSignup,
    cleanupAuthState
  };
};
