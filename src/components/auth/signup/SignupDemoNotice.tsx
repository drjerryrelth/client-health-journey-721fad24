
import React from 'react';

const SignupDemoNotice = () => {
  return (
    <div className="bg-blue-50 p-3 rounded-md mb-4">
      <p className="text-sm text-blue-700">
        <span className="font-semibold">Demo Mode:</span> To create a demo clinic without email verification, 
        use an email ending with <code>@example.com</code> (like <code>demo@example.com</code>)
      </p>
      <p className="text-xs text-blue-600 mt-1">
        <span className="font-medium">Important:</span> Any email ending with <code>@example.com</code> will work. 
        Simple emails like <code>clinic@example.com</code> or <code>demo@example.com</code> work best.
      </p>
    </div>
  );
};

export default SignupDemoNotice;
