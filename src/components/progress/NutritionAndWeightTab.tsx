
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeightTrendsChart from './WeightTrendsChart';
import MealHistoryTable from './MealHistoryTable';
import { Droplets, Scale } from 'lucide-react';

interface NutritionAndWeightTabProps {
  checkInsData: any[];
}

const NutritionAndWeightTab: React.FC<NutritionAndWeightTabProps> = ({ checkInsData = [] }) => {
  // Calculate average water intake
  const waterData = checkInsData.filter(item => item.waterIntake);
  const avgWater = waterData.length > 0 
    ? waterData.reduce((sum, item) => sum + (item.waterIntake || 0), 0) / waterData.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Weight Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeightTrendsChart data={checkInsData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm text-gray-500">Average Daily</p>
                <h3 className="text-2xl font-bold">{avgWater.toFixed(1)} glasses</h3>
              </div>
              <Droplets className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Meal History</h3>
        <MealHistoryTable data={checkInsData} />
      </div>
    </div>
  );
};

export default NutritionAndWeightTab;
