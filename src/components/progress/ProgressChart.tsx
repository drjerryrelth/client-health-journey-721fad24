
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressChart = () => {
  // Mock weight data
  const data = [
    { day: 'Day 1', weight: 185 },
    { day: 'Day 5', weight: 183 },
    { day: 'Day 10', weight: 180 },
    { day: 'Day 15', weight: 178 },
    { day: 'Day 20', weight: 176 },
    { day: 'Day 25', weight: 174 },
    { day: 'Day 30', weight: 172 },
  ];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          domain={['dataMin - 5', 'dataMax + 5']}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} lbs`}
        />
        <Tooltip 
          formatter={(value) => [`${value} lbs`, 'Weight']}
          contentStyle={{ 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            border: 'none'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="weight" 
          stroke="#1eaedb" 
          strokeWidth={2}
          activeDot={{ r: 6, fill: '#1eaedb', stroke: '#fff', strokeWidth: 2 }}
          dot={{ r: 4, fill: '#1eaedb', stroke: '#fff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
