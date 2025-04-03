
import React from 'react';

const SignupDemoNotice = () => {
  return (
    <div className="bg-blue-50 p-3 rounded-md mb-4">
      <p className="text-sm text-blue-700">
        <span className="font-semibold">Demo Mode:</span> To create a demo clinic without email verification, 
        use an email ending with <code>.demo@example.com</code> (e.g., myclinic.demo@example.com)
      </p>
    </div>
  );
};

export default SignupDemoNotice;
