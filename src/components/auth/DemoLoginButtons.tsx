
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DemoLoginButtonsProps {
  handleDemoLogin: (type: UserRole, email: string) => Promise<void>;
  isSubmitting: boolean;
}

const DemoLoginButtons = ({ handleDemoLogin, isSubmitting }: DemoLoginButtonsProps) => {
  // Define demo emails for each role
  const demoEmails = {
    admin: 'drrelth@contourlight.com',
    coach: 'support@practicenaturals.cm',
    client: 'drjerryrelth@gmail.com'
  };
  
  return (
    <div className="mt-8">
      <p className="text-sm text-center text-gray-500 mb-4">Demo Account Login</p>
      
      <Alert className="mb-4 bg-yellow-50 border-yellow-200">
        <AlertDescription className="text-xs text-yellow-800">
          Using specific emails for each role type. Email confirmation in Supabase is required.
          If login fails, please check the Supabase dashboard to confirm the email manually.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-3 gap-3">
        <Button 
          variant="outline"
          onClick={() => handleDemoLogin('admin', demoEmails.admin)}
          disabled={isSubmitting}
          className="text-xs"
        >
          Login as Admin
        </Button>
        <Button 
          variant="outline"
          onClick={() => handleDemoLogin('coach', demoEmails.coach)}
          disabled={isSubmitting}
          className="text-xs"
        >
          Login as Coach
        </Button>
        <Button 
          variant="outline"
          onClick={() => handleDemoLogin('client', demoEmails.client)}
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
