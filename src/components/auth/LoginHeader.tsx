
import React from 'react';
import { Weight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LoginHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
        <Weight className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-center text-gray-800">Client Health Tracker™</h1>
      <p className="text-gray-500 text-center mt-1">Log in to your account</p>
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/progress-preview')}
          className="text-sm"
        >
          View Progress Page Preview
        </Button>
      </div>
    </div>
  );
};

export default LoginHeader;
