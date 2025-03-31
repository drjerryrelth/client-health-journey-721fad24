
import React from 'react';
import CheckInForm from '@/components/check-ins/CheckInForm';

const CheckIn = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Check-in</h1>
        <p className="text-gray-500">Track your progress for today or update previous days</p>
      </div>
      
      <CheckInForm />
    </div>
  );
};

export default CheckIn;
