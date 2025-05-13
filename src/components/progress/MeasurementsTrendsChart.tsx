import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MeasurementsTrendsChartProps {
  data: any[];
}

const MeasurementsTrendsChart: React.FC<MeasurementsTrendsChartProps> = ({ data }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['waist', 'chest']);
  
  const metrics = [
    { id: 'waist', name: 'Waist', color: '#3b82f6' },
    { id: 'hips', name: 'Hips', color: '#f59e0b' },
    { id: 'chest', name: 'Chest', color: '#10b981' },
    { id: 'thighs', name: 'Thighs', color: '#8b5cf6' },
    { id: 'arms', name: 'Arms', color: '#f43f5e' },
  ];

  // Format data for the chart
  const chartData = data
    .map((item) => ({
      date: item.date,
      formattedDate: format(new Date(item.date), 'MMM dd, yyyy'),
      waist: parseFloat(item.waist) || null,
      hips: parseFloat(item.hips) || null,
      chest: parseFloat(item.chest) || null,
      thighs: parseFloat(item.thighs) || null,
      arms: parseFloat(item.arms) || null,
    }))
    .filter(item => {
      // Keep only items that have at least one selected metric
      return selectedMetrics.some(metric => item[metric] !== null);
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleMetricChange = (value: string) => {
    // Split the comma-separated values into an array
    const metrics = value.split(',');
    setSelectedMetrics(metrics);
  };

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <p>No measurement data available</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Measurements:</label>
        <Select 
          defaultValue={selectedMetrics.join(',')}
          onValueChange={handleMetricChange}
        >
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Select metrics" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="waist,chest">Waist & Chest</SelectItem>
              <SelectItem value="waist,hips">Waist & Hips</SelectItem>
              <SelectItem value="chest,arms">Chest & Arms</SelectItem>
              <SelectItem value="waist,chest,hips">Waist, Chest & Hips</SelectItem>
              <SelectItem value="waist,hips,thighs">Waist, Hips & Thighs</SelectItem>
              <SelectItem value="waist,chest,hips,thighs,arms">All Measurements</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
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
                if (window.innerWidth < 768) {
                  return format(new Date(value), 'MM/dd');
                }
                return value;
              }}
            />
            <YAxis 
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={(value) => `${value} in`}
            />
            <Tooltip formatter={(value) => [`${value} in`, '']} />
            <Legend />
            
            {metrics.map(metric => (
              selectedMetrics.includes(metric.id) && (
                <Line
                  key={metric.id}
                  type="monotone"
                  dataKey={metric.id}
                  name={metric.name}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={{ stroke: metric.color, strokeWidth: 2, r: 4 }}
                  connectNulls
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default MeasurementsTrendsChart;
