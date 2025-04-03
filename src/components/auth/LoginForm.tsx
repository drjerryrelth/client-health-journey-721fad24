
import React from 'react';
import LoginHeader from './LoginHeader';
import LoginFormFields from './LoginFormFields';
import DemoLoginButtons from './DemoLoginButtons';
import { useLoginHandler } from '@/hooks/auth';

const LoginForm = () => {
  const { isSubmitting, handleLogin, handleDemoLogin } = useLoginHandler();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <LoginHeader />
          <LoginFormFields 
            onSubmit={handleLogin} 
            isSubmitting={isSubmitting} 
          />
          <DemoLoginButtons 
            handleDemoLogin={handleDemoLogin} 
            isSubmitting={isSubmitting} 
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
