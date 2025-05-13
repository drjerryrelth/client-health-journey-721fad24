
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface WeightTrendsChartProps {
  data: any[];
}

const WeightTrendsChart: React.FC<WeightTrendsChartProps> = ({ data }) => {
  // Format data for the chart
  const chartData = data
    .filter((item) => item.weight !== null) // Filter out entries without weight
    .map((item) => ({
      date: item.date,
      weight: parseFloat(item.weight) || 0,
      formattedDate: format(new Date(item.date), 'MMM dd, yyyy')
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <p>No weight data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              // Show shorter format on small screens
              if (window.innerWidth < 768) {
                return format(new Date(value), 'MM/dd');
              }
              return value;
            }}
          />
          <YAxis 
            tickFormatter={(value) => `${value} ${chartData[0]?.unit || 'lbs'}`}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip
            formatter={(value) => [`${value} lbs`, 'Weight']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2, fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightTrendsChart;
