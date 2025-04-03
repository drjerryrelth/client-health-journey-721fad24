
import React from 'react';
import { Building } from 'lucide-react';

const SignupHeader = () => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Building size={20} className="text-primary" />
      <h3 className="text-lg font-medium">Clinic Registration</h3>
    </div>
  );
};

export default SignupHeader;
