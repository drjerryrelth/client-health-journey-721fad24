
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface WeightTrendsChartProps {
  data: any[];
}

const WeightTrendsChart: React.FC<WeightTrendsChartProps> = ({ data }) => {
  // Filter only check-ins with weight data and sort by date
  const chartData = data
    .filter(checkIn => checkIn.weight)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(checkIn => ({
      date: checkIn.date,
      weight: checkIn.weight
    }));
  
  // Calculate stats
  const firstWeight = chartData.length > 0 ? chartData[0].weight : 0;
  const currentWeight = chartData.length > 0 ? chartData[chartData.length - 1].weight : 0;
  const weightChange = currentWeight - firstWeight;
  
  // Format the tooltip display
  const renderTooltip = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow text-xs">
          <p>{format(new Date(label), 'MMM d, yyyy')}</p>
          <p className="font-bold">{`Weight: ${payload[0].value} lbs`}</p>
        </div>
      );
    }
    return null;
  };
  
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-500">
        No weight data recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <p className="text-sm text-gray-500">Current Weight</p>
          <p className="text-2xl font-bold">{currentWeight} lbs</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Change</p>
          <p className={`text-2xl font-bold ${weightChange < 0 ? 'text-green-600' : weightChange > 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} lbs
          </p>
        </div>
      </div>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'MMM d')} 
              tick={{ fontSize: 12 }}
            />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 12 }} />
            <Tooltip content={renderTooltip} />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightTrendsChart;
