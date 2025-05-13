
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import WeightTrendsChart from '@/components/progress/WeightTrendsChart';
import MealHistoryTable from '@/components/progress/MealHistoryTable';
import SleepTrackingChart from '@/components/progress/SleepTrackingChart';
import ExerciseTrackingChart from '@/components/progress/ExerciseTrackingChart';
import MoodTrackingChart from '@/components/progress/MoodTrackingChart';
import DateRangeSelector from '@/components/progress/DateRangeSelector';
import { CheckIn } from '@/types';
import { subDays } from 'date-fns';
import { mockCheckIns } from '@/services/check-ins/mock-data';

const ProgressPreview = () => {
  const [activeTab, setActiveTab] = useState("nutrition");
  const [startDate, setStartDate] = useState(subDays(new Date(), 30)); // Default to last 30 days
  const [endDate, setEndDate] = useState(new Date());
  const [rangePreset, setRangePreset] = useState("last30days");
  
  // Filter data based on date range
  const [filteredData, setFilteredData] = useState<CheckIn[]>([]);

  useEffect(() => {
    const filtered = mockCheckIns.filter(checkIn => {
      const checkInDate = new Date(checkIn.date);
      return checkInDate >= startDate && checkInDate <= endDate;
    });

    setFilteredData(filtered);
  }, [startDate, endDate]);

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Progress Tracking</h1>
            <p className="text-gray-500">Track health and fitness metrics over time</p>
          </div>
        </div>

        <div className="mb-6">
          <DateRangeSelector 
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onRangePresetChange={setRangePreset}
          />
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="nutrition">Nutrition & Weight</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="exercise">Exercise</TabsTrigger>
            <TabsTrigger value="mood">Mood</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nutrition" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weight Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <WeightTrendsChart data={filteredData} />
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Meal History</CardTitle>
              </CardHeader>
              <CardContent>
                <MealHistoryTable data={filteredData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sleep" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sleep Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <SleepTrackingChart checkInsData={filteredData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="exercise" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <ExerciseTrackingChart checkInsData={filteredData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mood" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mood Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodTrackingChart checkInsData={filteredData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {filteredData.length === 0 && (
          <div className="p-8 text-center border rounded-md bg-gray-50">
            <p className="text-gray-500">No data available for the selected date range.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPreview;
