
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const handleGoBack = () => {
    // Redirect based on user role
    if (user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'coach') {
        navigate('/coach-dashboard');
      } else if (user.role === 'client') {
        navigate('/client');
      } else {
        navigate(-1); // Fall back to previous page if role unknown
      }
    } else {
      navigate(-1); // Fall back to previous page if no user
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">
          Sorry, you don't have permission to access this page.
          {user && (
            <span className="block mt-2">
              You are logged in as: <strong>{user.name}</strong> ({user.role})
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button onClick={handleGoBack}>
            Go to Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
