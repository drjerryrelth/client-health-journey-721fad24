
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeeklyProgressCharts from './WeeklyProgressCharts';
import MeasurementsTrendsChart from './MeasurementsTrendsChart';
import MoodTrackingChart from './MoodTrackingChart';
import SleepTrackingChart from './SleepTrackingChart';
import ExerciseTrackingChart from './ExerciseTrackingChart';
import NutritionAndWeightTab from './NutritionAndWeightTab';
import CheckInHistoryTable from './CheckInHistoryTable';
import { Activity, BarChart3, Ruler, HeartPulse, Bed } from 'lucide-react';

interface ProgressChartProps {
  clientId?: string;
  checkInsData: any[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ clientId, checkInsData = [] }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden md:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Nutrition & Weight</span>
          </TabsTrigger>
          <TabsTrigger value="measurements" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            <span className="hidden md:inline">Measurements</span>
          </TabsTrigger>
          <TabsTrigger value="wellbeing" className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4" />
            <span className="hidden md:inline">Wellbeing</span>
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            <span className="hidden md:inline">Sleep</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <WeeklyProgressCharts data={checkInsData} />
          <CheckInHistoryTable data={checkInsData.slice(0, 5)} />
        </TabsContent>
        
        <TabsContent value="nutrition">
          <NutritionAndWeightTab checkInsData={checkInsData} />
        </TabsContent>
        
        <TabsContent value="measurements">
          <MeasurementsTrendsChart data={checkInsData} />
        </TabsContent>
        
        <TabsContent value="wellbeing">
          <div className="space-y-6">
            <MoodTrackingChart data={checkInsData} />
            <ExerciseTrackingChart data={checkInsData} />
          </div>
        </TabsContent>
        
        <TabsContent value="sleep">
          <SleepTrackingChart data={checkInsData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressChart;
