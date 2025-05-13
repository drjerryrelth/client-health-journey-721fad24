
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { subDays, format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus, Droplet, Moon, Activity, Smile } from 'lucide-react';

// Mock data for the past 7 days
const generateDailyMetrics = () => {
  const today = new Date();
  return Array(7).fill(null).map((_, index) => {
    const date = subDays(today, 6 - index);
    const weight = 170 - Math.random() * 3 * index;
    const previousWeight = weight + (Math.random() < 0.7 ? Math.random() * 1.2 : -Math.random() * 0.5);
    const trend = weight < previousWeight ? 'down' : weight > previousWeight ? 'up' : 'neutral';
    
    return {
      date: format(date, 'EEEE, MMM d'),
      weight: Math.round(weight * 10) / 10,
      trend,
      waterIntake: Math.round(5 + Math.random() * 4),
      sleepHours: Math.round((6 + Math.random() * 3) * 10) / 10,
      moodScore: Math.round(6 + Math.random() * 4),
      energyScore: Math.round(5 + Math.random() * 5),
    };
  });
};

const DailyMetricsCards = () => {
  const dailyMetrics = React.useMemo(() => generateDailyMetrics(), []);
  
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg font-medium mb-4">Daily Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dailyMetrics.map((day, index) => (
            <Card key={index} className={`overflow-hidden ${index === dailyMetrics.length - 1 ? 'border-primary border-2' : ''}`}>
              <div className={`py-2 px-3 ${index === dailyMetrics.length - 1 ? 'bg-primary text-white' : 'bg-muted'}`}>
                <h4 className="font-medium">{day.date}</h4>
              </div>
              <CardContent className="p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Weight</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-1">{day.weight} lbs</span>
                    {day.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-500" />}
                    {day.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                    {day.trend === 'neutral' && <Minus className="h-4 w-4 text-gray-400" />}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Droplet className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-gray-500">Water</span>
                  </div>
                  <span className="font-medium">{day.waterIntake} cups</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Moon className="h-4 w-4 text-indigo-400 mr-1" />
                    <span className="text-sm text-gray-500">Sleep</span>
                  </div>
                  <span className="font-medium">{day.sleepHours} hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Smile className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-500">Mood</span>
                  </div>
                  <span className="font-medium">{day.moodScore}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-sm text-gray-500">Energy</span>
                  </div>
                  <span className="font-medium">{day.energyScore}/10</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyMetricsCards;
