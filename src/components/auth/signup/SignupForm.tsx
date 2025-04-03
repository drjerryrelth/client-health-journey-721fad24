
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the multi-tab clinic signup form
    navigate('/signup/clinic', { replace: true });
  }, [navigate]);
  
  // Return a simple loading state while redirecting
  return (
    <div className="flex justify-center items-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      <span className="ml-3">Redirecting to clinic registration...</span>
    </div>
  );
};

export default SignupForm;
