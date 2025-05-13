
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import WeightTrendsChart from '@/components/progress/WeightTrendsChart';
import MealHistoryTable from '@/components/progress/MealHistoryTable';
import SleepTrackingChart from '@/components/progress/SleepTrackingChart';
import ExerciseTrackingChart from '@/components/progress/ExerciseTrackingChart';
import MoodTrackingChart from '@/components/progress/MoodTrackingChart';

const ProgressPreview = () => {
  const [activeTab, setActiveTab] = useState("nutrition");
  
  // Dummy data for preview
  const dummyCheckIns = [
    { 
      id: '1',
      date: '2025-05-06', 
      weight: 185, 
      waterIntake: 6,
      meals: { 
        breakfast: 'Eggs and toast', 
        lunch: 'Salad', 
        dinner: 'Grilled chicken',
        snacks: 'Apple and nuts'
      },
      supplements: ['Vitamin D', 'Omega-3'],
      sleepHours: 7.5, 
      moodScore: 4, 
      exerciseMinutes: 45, 
      exerciseType: 'Cardio',
      measurements: { 
        waist: 36, 
        chest: 42, 
        hips: 38, 
        thighs: 24, 
        arms: 14
      }
    },
    { 
      id: '2',
      date: '2025-05-07', 
      weight: 184, 
      waterIntake: 7,
      meals: { 
        breakfast: 'Oatmeal', 
        lunch: 'Sandwich', 
        dinner: 'Fish and vegetables' 
      },
      supplements: ['Vitamin C', 'Zinc'],
      sleepHours: 8, 
      moodScore: 5, 
      exerciseMinutes: 30, 
      exerciseType: 'Strength',
      measurements: { 
        waist: 35.8, 
        chest: 42, 
        hips: 37.8, 
        thighs: 23.8, 
        arms: 14
      }
    },
    { 
      id: '3',
      date: '2025-05-08', 
      weight: 183.5, 
      waterIntake: 5,
      meals: { 
        breakfast: 'Protein shake', 
        lunch: 'Soup and bread', 
        dinner: 'Stir fry' 
      },
      supplements: ['Magnesium'],
      sleepHours: 6, 
      moodScore: 3, 
      exerciseMinutes: 0, 
      exerciseType: 'Rest day',
      measurements: { 
        waist: 35.6, 
        chest: 41.8, 
        hips: 37.6, 
        thighs: 23.7, 
        arms: 13.9
      }
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Progress Tracking</h1>
            <p className="text-gray-500">Track health and fitness metrics over time</p>
          </div>
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
                <WeightTrendsChart data={dummyCheckIns} />
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Meal History</CardTitle>
              </CardHeader>
              <CardContent>
                <MealHistoryTable data={dummyCheckIns} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sleep" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sleep Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <SleepTrackingChart data={dummyCheckIns} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="exercise" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <ExerciseTrackingChart data={dummyCheckIns} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mood" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mood Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodTrackingChart data={dummyCheckIns} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProgressPreview;
