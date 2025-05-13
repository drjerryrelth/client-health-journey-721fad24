
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientDataProvider from '@/components/client/ClientDataProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import WeeklyProgressCharts from '@/components/progress/WeeklyProgressCharts';
import MealHistoryTable from '@/components/progress/MealHistoryTable';
import CheckInHistoryTable from '@/components/progress/CheckInHistoryTable';
import DailyMetricsCards from '@/components/progress/DailyMetricsCards';

const ClientProgress = () => {
  const [activeTab, setActiveTab] = useState<string>("charts");

  return (
    <ClientDataProvider>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Progress</h1>
            <p className="text-gray-500">Track your journey and see your improvements</p>
          </div>
          
          <div className="w-full md:w-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="meals">Meals</TabsTrigger>
                <TabsTrigger value="history">All Data</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <TabsContent value="charts" className="space-y-6 mt-2">
          <WeeklyProgressCharts />
          <DailyMetricsCards />
        </TabsContent>
        
        <TabsContent value="meals" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Meal History</CardTitle>
            </CardHeader>
            <CardContent>
              <MealHistoryTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Measurement History</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckInHistoryTable />
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </ClientDataProvider>
  );
};

export default ClientProgress;
