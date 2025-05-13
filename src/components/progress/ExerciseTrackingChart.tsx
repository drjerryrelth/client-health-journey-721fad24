
import React from 'react';
import { CheckIn } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ExerciseTrackingChartProps {
  checkInsData: CheckIn[];
}

const ExerciseTrackingChart: React.FC<ExerciseTrackingChartProps> = ({ checkInsData }) => {
  // This is a placeholder implementation since our CheckIn type doesn't have exercise minutes
  // We're using energy score as a proxy to demonstrate the chart
  
  // Sort check-ins by date
  const sortedData = [...checkInsData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Format data for the chart
  const chartData = sortedData.map(checkIn => ({
    date: new Date(checkIn.date).toLocaleDateString(),
    energyScore: checkIn.energyScore || 0,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Bar 
            dataKey="energyScore" 
            fill="#82ca9d" 
            name="Energy Score (proxy for exercise)"
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-center text-sm text-gray-500 mt-2">
        Using energy scores as a proxy for exercise levels
      </p>
    </div>
  );
};

export default ExerciseTrackingChart;
