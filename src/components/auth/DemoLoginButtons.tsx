
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { useDemoLogin } from '@/hooks/auth';
import { demoEmails } from '@/services/auth/demo';

interface DemoLoginButtonsProps {
  handleDemoLogin?: (type: UserRole, email: string) => Promise<void>;
  isSubmitting?: boolean;
}

const DemoLoginButtons = ({ handleDemoLogin: propHandleDemoLogin, isSubmitting: propIsSubmitting }: DemoLoginButtonsProps = {}) => {
  // Use the hook's login handler if no prop handler is provided
  const { handleDemoLogin: hookLoginHandler, isSubmitting: hookIsSubmitting } = useDemoLogin();
  
  // Use prop isSubmitting if provided, otherwise use the hook's isSubmitting
  const isSubmitting = propIsSubmitting !== undefined ? propIsSubmitting : hookIsSubmitting;
  
  const handleLogin = async (type: UserRole, email: string) => {
    console.log(`Demo login clicked for ${type} with email ${email}`);
    if (propHandleDemoLogin) {
      await propHandleDemoLogin(type, email);
    } else {
      // If no handler provided, use the hook's handler
      await hookLoginHandler(type, email);
    }
  };
  
  return (
    <div className="mt-8">
      <p className="text-sm text-center text-gray-500 mb-4">Quick Demo Account Access</p>
      
      <Alert className="mb-4 bg-yellow-50 border-yellow-200">
        <InfoIcon className="h-4 w-4 text-yellow-800" />
        <AlertTitle className="text-yellow-800">Demo Accounts</AlertTitle>
        <AlertDescription className="text-xs text-yellow-800">
          Use these buttons to instantly access demo accounts. All demo accounts use the password "password123".
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-3 gap-3">
        <Button 
          variant="outline"
          onClick={() => handleLogin('admin', demoEmails.admin)}
          disabled={isSubmitting}
          className="text-xs"
        >
          Login as Admin
        </Button>
        <Button 
          variant="outline"
          onClick={() => handleLogin('coach', demoEmails.coach)}
          disabled={isSubmitting}
          className="text-xs"
        >
          Login as Coach
        </Button>
        <Button 
          variant="outline"
          onClick={() => handleLogin('client', demoEmails.client)}
          disabled={isSubmitting}
          className="text-xs"
        >
          Login as Client
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <Button 
          variant="outline"
          onClick={() => handleLogin('coach', demoEmails.coachAlt)}
          disabled={isSubmitting}
          className="text-xs"
        >
          Login as Alt Coach
        </Button>
        <Button 
          variant="outline"
          onClick={() => handleLogin('client', demoEmails.clientAlt)}
          disabled={isSubmitting}
          className="text-xs"
        >
          Login as Alt Client
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3">
        <Button 
          variant="outline"
          onClick={() => handleLogin('clinic_admin', demoEmails.clinicAdmin)}
          disabled={isSubmitting}
          className="text-xs"
        >
          Login as Clinic Admin
        </Button>
      </div>
    </div>
  );
};

export default DemoLoginButtons;
