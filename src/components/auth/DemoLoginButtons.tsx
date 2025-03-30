
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';

interface DemoLoginButtonsProps {
  handleDemoLogin: (type: UserRole) => Promise<void>;
  isSubmitting: boolean;
}

const DemoLoginButtons = ({ handleDemoLogin, isSubmitting }: DemoLoginButtonsProps) => {
  return (
    <div className="mt-8">
      <p className="text-sm text-center text-gray-500 mb-4">Demo Accounts</p>
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
