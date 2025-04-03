
import React, { useState } from 'react';
import LoginHeader from './LoginHeader';
import LoginFormFields from './LoginFormFields';
import SignupFormFields from './SignupFormFields';
import DemoLoginButtons from './DemoLoginButtons';
import { useLoginHandler } from '@/hooks/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginForm = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { isSubmitting, handleLogin, handleDemoLogin, handleSignup } = useLoginHandler();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <LoginHeader />
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-4">
              <LoginFormFields 
                onSubmit={handleLogin} 
                isSubmitting={isSubmitting} 
              />
            </TabsContent>
            
            <TabsContent value="signup" className="mt-4">
              <SignupFormFields
                onSubmit={handleSignup}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </Tabs>
          
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
