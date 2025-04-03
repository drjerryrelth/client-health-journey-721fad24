
import React from 'react';

const SignupDemoNotice = () => {
  return (
    <div className="bg-blue-50 p-3 rounded-md mb-4">
      <p className="text-sm text-blue-700">
        <span className="font-semibold">Demo Mode:</span> To create a demo clinic without email verification, 
        use an email with format <code>demo@example.com</code> or <code>name@demo.com</code>
      </p>
      <p className="text-xs text-blue-600 mt-1">
        Note: Supabase has strict email validation. Please avoid using formats with hyphens or numbers 
        like "clinic01-demo@example.com" which may be rejected. Try <code>demo@example.com</code> or <code>clinic@demo.com</code> instead.
      </p>
    </div>
  );
};

export default SignupDemoNotice;
