
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './LoginHeader';
import LoginFormFields from './LoginFormFields';
import DemoLoginButtons from './DemoLoginButtons';
import { useLoginHandler } from '@/hooks/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginForm = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { isSubmitting, handleLogin, handleDemoLogin } = useLoginHandler();
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    if (value === 'signup') {
      // Redirect to clinic signup page instead of showing the simple form
      navigate('/signup/clinic');
    } else {
      setActiveTab(value as 'login' | 'signup');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <LoginHeader />
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Register Your Clinic</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-4">
              <LoginFormFields 
                onSubmit={handleLogin} 
                isSubmitting={isSubmitting} 
              />
              <div className="text-center text-sm text-gray-500 mt-2">
                <p>Demo accounts: test@example.com / coach@example.com</p>
                <p>Password for all demo accounts: password123</p>
              </div>
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
