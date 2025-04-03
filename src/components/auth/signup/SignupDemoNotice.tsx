
import React from 'react';

const SignupDemoNotice = () => {
  return (
    <div className="bg-blue-50 p-3 rounded-md mb-4">
      <p className="text-sm text-blue-700">
        <span className="font-semibold">Demo Mode:</span> To create a demo clinic without email verification, 
        use any email ending with <code>@example.com</code>
      </p>
      <p className="text-xs text-blue-600 mt-1">
        <span className="font-medium">Note:</span> Each demo account needs a unique email address. 
        For example: <code>demo123@example.com</code> or <code>mydemo@example.com</code>
      </p>
    </div>
  );
};

export default SignupDemoNotice;
