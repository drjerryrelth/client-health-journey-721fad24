
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface ExerciseTrackingChartProps {
  data: any[];
}

const ExerciseTrackingChart: React.FC<ExerciseTrackingChartProps> = ({ data }) => {
  // Format data for the chart
  const chartData = data
    .filter((item) => item.exercise_minutes !== null && item.exercise_minutes !== undefined)
    .map((item) => ({
      date: item.date,
      minutes: parseFloat(item.exercise_minutes) || 0,
      formattedDate: format(new Date(item.date), 'MMM dd'),
      type: item.exercise_type || 'Not specified'
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <p>No exercise data available</p>
      </div>
    );
  }

  // Calculate statistics
  const totalMinutes = chartData.reduce((sum, item) => sum + item.minutes, 0);
  const averageMinutes = totalMinutes / chartData.length;
  const activeDays = chartData.filter(item => item.minutes > 0).length;
  
  // Get exercise types and count
  const exerciseTypes = chartData.reduce((acc: Record<string, number>, item) => {
    if (item.type && item.minutes > 0) {
      acc[item.type] = (acc[item.type] || 0) + 1;
    }
    return acc;
  }, {});
  
  const favoriteTypeEntry = Object.entries(exerciseTypes).sort((a, b) => b[1] - a[1])[0];
  const favoriteType = favoriteTypeEntry ? favoriteTypeEntry[0] : 'None';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Weekly Exercise</p>
              <h3 className="text-2xl font-bold">{totalMinutes} min</h3>
            </div>
            <Activity className="h-10 w-10 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Active Days</p>
            <h3 className="text-2xl font-bold">{activeDays}/{chartData.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Favorite Type</p>
            <h3 className="text-xl font-bold">{favoriteType}</h3>
          </CardContent>
        </Card>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="formattedDate" />
            <YAxis tickFormatter={(value) => `${value}m`} />
            <Tooltip
              formatter={(value) => [`${value} minutes`, 'Exercise']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar 
              dataKey="minutes" 
              fill="#22c55e" 
              name="Exercise Minutes"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chartData.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.formattedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.minutes} minutes</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExerciseTrackingChart;
