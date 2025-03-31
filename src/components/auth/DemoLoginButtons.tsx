
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoginHandler } from '@/hooks/use-login-handler';

interface DemoLoginButtonsProps {
  handleDemoLogin?: (type: UserRole, email: string) => Promise<void>;
  isSubmitting?: boolean;
}

const DemoLoginButtons = ({ handleDemoLogin, isSubmitting }: DemoLoginButtonsProps = {}) => {
  // Define demo emails for each role
  const demoEmails = {
    admin: 'drrelth@contourlight.com',
    coach: 'support@practicenaturals.com',
    client: 'drjerryrelth@gmail.com'
  };
  
  // Use login handler if no handler is provided (for homepage use)
  const navigate = useNavigate();
  const loginHandler = useLoginHandler();
  
  const handleLogin = async (type: UserRole, email: string) => {
    if (handleDemoLogin) {
      await handleDemoLogin(type, email);
    } else {
      // If no handler provided, use the hook's handler
      await loginHandler.handleDemoLogin(type, email);
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
          If login fails, it may be because email confirmation is required in Supabase.
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
    </div>
  );
};

export default DemoLoginButtons;
