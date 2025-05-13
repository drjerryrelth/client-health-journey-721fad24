
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Bed } from 'lucide-react';

interface SleepTrackingChartProps {
  data: any[];
}

const SleepTrackingChart: React.FC<SleepTrackingChartProps> = ({ data }) => {
  // Format data for the chart
  const chartData = data
    .filter((item) => item.sleep_hours !== null && item.sleep_hours !== undefined)
    .map((item) => ({
      date: item.date,
      hours: parseFloat(item.sleep_hours) || 0,
      formattedDate: format(new Date(item.date), 'MMM dd')
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <p>No sleep data available</p>
      </div>
    );
  }

  // Calculate average sleep
  const totalSleep = chartData.reduce((sum, item) => sum + item.hours, 0);
  const averageSleep = totalSleep / chartData.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Sleep</p>
              <h3 className="text-2xl font-bold">{averageSleep.toFixed(1)} hours</h3>
            </div>
            <Bed className="h-10 w-10 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Sleep Quality</p>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs
                    ${i < Math.round(averageSleep/8 * 5) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="formattedDate" />
            <YAxis
              domain={[0, 12]}
              tickCount={7}
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip
              formatter={(value) => [`${value} hours`, 'Sleep']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <p className="text-sm font-medium">Sleep insights:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>You average {averageSleep.toFixed(1)} hours of sleep per night</li>
          <li>Your best night was {chartData.reduce((max, item) => item.hours > max.hours ? item : max, chartData[0]).hours} hours</li>
          <li>{averageSleep >= 7 ? 'Great job maintaining healthy sleep patterns!' : 'Try to get closer to 7-8 hours of sleep for better recovery'}</li>
        </ul>
      </div>
    </div>
  );
};

export default SleepTrackingChart;
