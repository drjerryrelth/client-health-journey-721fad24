
import React from 'react';
import { CheckIn } from '@/types';

interface ExerciseTrackingChartProps {
  checkInsData: CheckIn[];
}

const ExerciseTrackingChart: React.FC<ExerciseTrackingChartProps> = ({ checkInsData }) => {
  // Component implementation
  return (
    <div>
      <p>Exercise tracking chart will go here</p>
    </div>
  );
};

export default ExerciseTrackingChart;
