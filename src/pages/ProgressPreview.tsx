
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import WeightTrendsChart from '@/components/progress/WeightTrendsChart';
import MeasurementsTrendsChart from '@/components/progress/MeasurementsTrendsChart';
import NutrientComplianceChart from '@/components/progress/NutrientComplianceChart';
import MealHistoryTable from '@/components/progress/MealHistoryTable';

const ProgressPreview = () => {
  const [activeTab, setActiveTab] = useState("weight");
  
  // Dummy data for preview
  const dummyCheckIns = [
    { date: '2025-05-06', weight: 185, waist: 36, chest: 42, hips: 38, thighs: 24, arms: 14, 
      water_intake: 6, breakfast: 'Eggs and toast', lunch: 'Salad', dinner: 'Grilled chicken' },
    { date: '2025-05-07', weight: 184, waist: 35.8, chest: 42, hips: 37.8, thighs: 23.8, arms: 14, 
      water_intake: 7, breakfast: 'Oatmeal', lunch: 'Sandwich', dinner: 'Fish and vegetables' },
    { date: '2025-05-08', weight: 183.5, waist: 35.6, chest: 41.8, hips: 37.6, thighs: 23.7, arms: 13.9, 
      water_intake: 5, breakfast: 'Protein shake', lunch: 'Soup and bread', dinner: 'Stir fry' },
    { date: '2025-05-09', weight: 183, waist: 35.5, chest: 41.7, hips: 37.4, thighs: 23.6, arms: 13.9, 
      water_intake: 8, breakfast: 'Yogurt and fruit', lunch: 'Leftovers', dinner: 'Pasta with vegetables' },
    { date: '2025-05-10', weight: 182.5, waist: 35.3, chest: 41.6, hips: 37.2, thighs: 23.5, arms: 13.8, 
      water_intake: 7, breakfast: 'Cereal', lunch: 'Salad with chicken', dinner: 'Grilled salmon' },
    { date: '2025-05-11', weight: 182, waist: 35.2, chest: 41.5, hips: 37, thighs: 23.4, arms: 13.8, 
      water_intake: 6, breakfast: 'Toast with avocado', lunch: 'Wrap', dinner: 'Veggie burger' },
    { date: '2025-05-12', weight: 181, waist: 35, chest: 41.4, hips: 36.8, thighs: 23.2, arms: 13.7, 
      water_intake: 8, breakfast: 'Smoothie', lunch: 'Rice bowl', dinner: 'Roasted vegetables and quinoa' }
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
            <TabsTrigger value="weight">Weight Trends</TabsTrigger>
            <TabsTrigger value="measurements">Body Measurements</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Overview</TabsTrigger>
            <TabsTrigger value="meals">Meal History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weight" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weight Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <WeightTrendsChart data={dummyCheckIns} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="measurements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Body Measurements</CardTitle>
              </CardHeader>
              <CardContent>
                <MeasurementsTrendsChart data={dummyCheckIns} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nutrition" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <NutrientComplianceChart data={dummyCheckIns} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="meals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meal History</CardTitle>
              </CardHeader>
              <CardContent>
                <MealHistoryTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProgressPreview;
