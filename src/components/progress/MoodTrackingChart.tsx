
import React from 'react';
import { CheckIn } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodTrackingChartProps {
  checkInsData: CheckIn[];
}

const MoodTrackingChart: React.FC<MoodTrackingChartProps> = ({ checkInsData }) => {
  // Sort check-ins by date
  const sortedData = [...checkInsData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Format data for the chart
  const chartData = sortedData.map(checkIn => ({
    date: new Date(checkIn.date).toLocaleDateString(),
    moodScore: checkIn.moodScore || 0,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="moodScore" 
            stroke="#ff7300" 
            activeDot={{ r: 8 }} 
            name="Mood Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTrackingChart;
