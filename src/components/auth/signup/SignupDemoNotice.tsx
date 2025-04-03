
import React from 'react';

const SignupDemoNotice = () => {
  return (
    <div className="bg-blue-50 p-3 rounded-md mb-4">
      <p className="text-sm text-blue-700">
        <span className="font-semibold">Demo Mode:</span> To create a demo clinic without email verification, 
        use an email containing "demo" (e.g., "my-clinic-demo@example.com" or "demo-clinic@example.com")
      </p>
      <p className="text-xs text-blue-600 mt-1">
        Note: Supabase may reject certain email formats. If you experience issues, try a standard format like 
        "demo-clinic@example.com" instead.
      </p>
    </div>
  );
};

export default SignupDemoNotice;
