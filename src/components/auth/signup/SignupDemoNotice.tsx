
import React from 'react';

const SignupDemoNotice = () => {
  return (
    <div className="bg-blue-50 p-3 rounded-md mb-4">
      <p className="text-sm text-blue-700">
        <span className="font-semibold">Demo Mode:</span> To create a demo clinic without email verification, 
        use an email with format <code>demo@example.com</code> or <code>yourname@demo.com</code>
      </p>
      <p className="text-xs text-blue-600 mt-1">
        <span className="font-medium">Important:</span> Due to Supabase email validation, please use simple formats without 
        hyphens, numbers, or special characters. Valid examples: <code>demo@example.com</code>, <code>clinic@demo.com</code>, 
        or <code>test@example.com</code>.
      </p>
    </div>
  );
};

export default SignupDemoNotice;
