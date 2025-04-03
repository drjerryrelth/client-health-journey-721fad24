
import React from 'react';

const SignupDemoNotice = () => {
  return (
    <div className="bg-blue-50 p-3 rounded-md mb-4">
      <p className="text-sm text-blue-700">
        <span className="font-semibold">Demo Mode:</span> To create a demo clinic without email verification, 
        use an email ending with <code>.demo@example.com</code> (e.g., myclinic.demo@example.com)
      </p>
      <p className="text-xs text-blue-600 mt-1">
        Note: The email format must be valid. For example, "01clinic.demo@example.com" is valid, 
        but "01.demo@example.com" may be rejected as invalid.
      </p>
    </div>
  );
};

export default SignupDemoNotice;
