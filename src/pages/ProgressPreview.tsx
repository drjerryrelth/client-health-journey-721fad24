
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

const ProgressPreview = () => {
  const [activeTab, setActiveTab] = useState("nutrition");
  const [startDate, setStartDate] = useState(subDays(new Date(), 30)); // Default to last 30 days
  const [endDate, setEndDate] = useState(new Date());
  const [rangePreset, setRangePreset] = useState("last30days");
  
  // Updated dummy data to conform to the CheckIn type
  const dummyCheckIns: CheckIn[] = [
    { 
      id: '1',
      clientId: 'client-123',
      date: '2025-05-06', 
      weight: 185, 
      waterIntake: 6,
      meals: { 
        breakfast: 'Eggs and toast', 
        lunch: 'Salad', 
        dinner: 'Grilled chicken',
        snacks: 'Apple and nuts'
      },
      sleepHours: 7.5, 
      moodScore: 4, 
      energyScore: 4,
      measurements: { 
        waist: 36, 
        chest: 42, 
        hips: 38, 
        thighs: 24, 
        arms: 14
      },
      notes: 'Felt good today, had a good workout.'
    },
    { 
      id: '2',
      clientId: 'client-123',
      date: '2025-05-07', 
      weight: 184, 
      waterIntake: 7,
      meals: { 
        breakfast: 'Oatmeal', 
        lunch: 'Sandwich', 
        dinner: 'Fish and vegetables',
        snacks: 'Yogurt'
      },
      sleepHours: 8, 
      moodScore: 5, 
      energyScore: 5,
      measurements: { 
        waist: 35.8, 
        chest: 42, 
        hips: 37.8, 
        thighs: 23.8, 
        arms: 14
      },
      notes: 'Great energy levels all day.'
    },
    { 
      id: '3',
      clientId: 'client-123',
      date: '2025-05-08', 
      weight: 183.5, 
      waterIntake: 5,
      meals: { 
        breakfast: 'Protein shake', 
        lunch: 'Soup and bread', 
        dinner: 'Stir fry',
        snacks: 'Protein bar'
      },
      sleepHours: 6, 
      moodScore: 3, 
      energyScore: 3,
      measurements: { 
        waist: 35.6, 
        chest: 41.8, 
        hips: 37.6, 
        thighs: 23.7, 
        arms: 13.9
      },
      notes: 'Feeling a bit tired today.'
    },
  ];

  // Filter data based on date range
  const [filteredData, setFilteredData] = useState<CheckIn[]>(dummyCheckIns);

  useEffect(() => {
    const filtered = dummyCheckIns.filter(checkIn => {
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
