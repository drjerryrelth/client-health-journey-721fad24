
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeeklyProgressCharts from './WeeklyProgressCharts';
import MeasurementsTrendsChart from './MeasurementsTrendsChart';
import MoodTrackingChart from './MoodTrackingChart';
import SleepTrackingChart from './SleepTrackingChart';
import ExerciseTrackingChart from './ExerciseTrackingChart';
import NutritionAndWeightTab from './NutritionAndWeightTab';
import CheckInHistoryTable from './CheckInHistoryTable';
import DateRangeSelector from './DateRangeSelector';
import { Activity, BarChart3, Ruler, HeartPulse, Bed } from 'lucide-react';
import { CheckIn } from '@/types';
import { subDays } from 'date-fns';

interface ProgressChartProps {
  clientId?: string;
  checkInsData: any[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ clientId, checkInsData = [] }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [startDate, setStartDate] = useState(subDays(new Date(), 30)); // Default to last 30 days
  const [endDate, setEndDate] = useState(new Date());
  const [rangePreset, setRangePreset] = useState("last30days");
  const [filteredData, setFilteredData] = useState<any[]>([]); 

  // Filter data based on date range
  useEffect(() => {
    if (checkInsData.length === 0) return;

    const filtered = checkInsData.filter(checkIn => {
      const checkInDate = new Date(checkIn.date);
      return checkInDate >= startDate && checkInDate <= endDate;
    });

    setFilteredData(filtered);
  }, [checkInsData, startDate, endDate]);

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <DateRangeSelector 
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onRangePresetChange={setRangePreset}
        />
      </div>

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
          <WeeklyProgressCharts />
          <CheckInHistoryTable checkInsData={filteredData.slice(0, 5)} />
        </TabsContent>
        
        <TabsContent value="nutrition">
          <NutritionAndWeightTab checkInsData={filteredData} />
        </TabsContent>
        
        <TabsContent value="measurements">
          <MeasurementsTrendsChart checkInsData={filteredData} />
        </TabsContent>
        
        <TabsContent value="wellbeing">
          <div className="space-y-6">
            <MoodTrackingChart checkInsData={filteredData} />
            <ExerciseTrackingChart checkInsData={filteredData} />
          </div>
        </TabsContent>
        
        <TabsContent value="sleep">
          <SleepTrackingChart checkInsData={filteredData} />
        </TabsContent>
      </Tabs>

      {filteredData.length === 0 && (
        <div className="p-8 text-center border rounded-md bg-gray-50">
          <p className="text-gray-500">No data available for the selected date range.</p>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;
