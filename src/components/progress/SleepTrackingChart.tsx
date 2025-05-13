
import React from 'react';
import { CheckIn } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SleepTrackingChartProps {
  checkInsData: CheckIn[];
}

const SleepTrackingChart: React.FC<SleepTrackingChartProps> = ({ checkInsData }) => {
  // Sort check-ins by date
  const sortedData = [...checkInsData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Format data for the chart
  const chartData = sortedData.map(checkIn => ({
    date: new Date(checkIn.date).toLocaleDateString(),
    sleepHours: checkIn.sleepHours || 0,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 12]} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="sleepHours" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            name="Sleep Hours"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SleepTrackingChart;
