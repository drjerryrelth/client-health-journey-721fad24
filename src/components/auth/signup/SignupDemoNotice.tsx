
import React from 'react';

const SignupDemoNotice = () => {
  return (
    <div className="bg-blue-50 p-3 rounded-md mb-4">
      <p className="text-sm text-blue-700">
        <span className="font-semibold">Demo Mode:</span> To create a demo clinic without email verification, 
        use any email ending with <code>@example.com</code>
      </p>
      <p className="text-xs text-blue-600 mt-1">
        <span className="font-medium">Recommended:</span> Use a simple email like <code>demo@example.com</code> or <code>clinic@example.com</code>. 
        Avoid special characters in the email address.
      </p>
    </div>
  );
};

export default SignupDemoNotice;
