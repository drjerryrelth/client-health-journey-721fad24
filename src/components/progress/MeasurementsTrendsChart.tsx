
import React, { useState } from 'react';
import { CheckIn } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MeasurementsTrendsChartProps {
  checkInsData: CheckIn[];
}

const MeasurementsTrendsChart: React.FC<MeasurementsTrendsChartProps> = ({ checkInsData }) => {
  const [selectedMeasurement, setSelectedMeasurement] = useState<string>('waist');
  
  // Sort check-ins by date
  const sortedData = [...checkInsData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Format data for the chart
  const chartData = sortedData.map(checkIn => {
    const measurements = checkIn.measurements || {};
    return {
      date: new Date(checkIn.date).toLocaleDateString(),
      waist: measurements.waist || 0,
      chest: measurements.chest || 0,
      hips: measurements.hips || 0,
      thighs: measurements.thighs || 0,
      arms: measurements.arms || 0,
    };
  });

  // Colors for different measurements
  const measurementColors: Record<string, string> = {
    waist: '#8884d8',
    chest: '#82ca9d',
    hips: '#ffc658',
    thighs: '#ff7300',
    arms: '#0088fe',
  };

  // Readable labels for dropdown
  const measurementLabels: Record<string, string> = {
    waist: 'Waist',
    chest: 'Chest',
    hips: 'Hips',
    thighs: 'Thighs',
    arms: 'Arms',
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select 
          value={selectedMeasurement} 
          onValueChange={setSelectedMeasurement}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select measurement" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(measurementLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={selectedMeasurement}
              stroke={measurementColors[selectedMeasurement]} 
              activeDot={{ r: 8 }}
              name={measurementLabels[selectedMeasurement]}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MeasurementsTrendsChart;
