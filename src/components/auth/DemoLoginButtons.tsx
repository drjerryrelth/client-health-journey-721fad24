
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DemoLoginButtonsProps {
  handleDemoLogin: (type: UserRole) => Promise<void>;
  isSubmitting: boolean;
}

const DemoLoginButtons = ({ handleDemoLogin, isSubmitting }: DemoLoginButtonsProps) => {
  return (
    <div className="mt-8">
      <p className="text-sm text-center text-gray-500 mb-4">Demo Account Login</p>
      
      <Alert className="mb-4 bg-yellow-50 border-yellow-200">
        <AlertDescription className="text-xs text-yellow-800">
          Using email: drrelth@contourlight.com for demo login. Email confirmation in Supabase is required.
          If login fails, please check the Supabase dashboard to confirm the email manually.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-3 gap-3">
        <Button 
          variant="outline"
          onClick={() => handleDemoLogin('admin')}
          disabled={isSubmitting}
          className="text-xs"
        >
          Login as Admin
        </Button>
        <Button 
          variant="outline"
          onClick={() => handleDemoLogin('coach')}
          disabled={isSubmitting}
          className="text-xs"
        >
          Login as Coach
        </Button>
        <Button 
          variant="outline"
          onClick={() => handleDemoLogin('client')}
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
