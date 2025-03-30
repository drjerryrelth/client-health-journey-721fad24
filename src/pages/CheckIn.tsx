
import React from 'react';
import CheckInForm from '@/components/check-ins/CheckInForm';

const CheckIn = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Daily Check-in</h1>
        <p className="text-gray-500">Track your progress and stay on course with your wellness journey</p>
      </div>
      
      <CheckInForm />
    </div>
  );
};

export default CheckIn;
