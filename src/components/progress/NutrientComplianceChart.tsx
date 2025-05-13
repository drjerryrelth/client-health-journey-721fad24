
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays } from 'date-fns';

interface NutrientComplianceChartProps {
  data: any[];
}

const NutrientComplianceChart: React.FC<NutrientComplianceChartProps> = ({ data }) => {
  // Get entries from the last 14 days
  const today = new Date();
  const twoWeeksAgo = subDays(today, 14);
  
  // Calculate meal compliance - consider breakfast/lunch/dinner logged as compliance
  const chartData = data
    .filter(item => {
      const date = new Date(item.date);
      return date >= twoWeeksAgo && date <= today;
    })
    .map(item => {
      // Count how many meals were logged for the day
      let mealCount = 0;
      if (item.breakfast && item.breakfast.trim() !== '') mealCount++;
      if (item.lunch && item.lunch.trim() !== '') mealCount++;
      if (item.dinner && item.dinner.trim() !== '') mealCount++;
      
      // Calculate compliance percentage
      const compliance = Math.round((mealCount / 3) * 100);
      
      // Calculate water compliance if water intake is tracked
      let waterCompliance = 0;
      if (item.water_intake) {
        // Make sure water_intake is a number
        const waterIntake = Number(item.water_intake);
        // Assuming target is 8 glasses (64oz)
        waterCompliance = Math.min(100, Math.round((waterIntake / 64) * 100));
      }
      
      return {
        date: item.date,
        formattedDate: format(new Date(item.date), 'MMM dd'),
        compliance,
        waterCompliance,
        mealCount
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <p>No nutrition data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="formattedDate" />
          <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'compliance') return [`${value}% (${Math.round(Number(value) * 3 / 100)} meals)`, 'Meal Tracking'];
              return [`${value}%`, 'Water Intake']; 
            }} 
          />
          <Legend />
          <Bar 
            dataKey="compliance" 
            name="Meal Tracking" 
            fill="#8884d8" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="waterCompliance" 
            name="Water Intake" 
            fill="#82ca9d" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutrientComplianceChart;
