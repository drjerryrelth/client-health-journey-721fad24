
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientDataProvider from '@/components/client/ClientDataProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import WeeklyProgressCharts from '@/components/progress/WeeklyProgressCharts';
import MealHistoryTable from '@/components/progress/MealHistoryTable';
import CheckInHistoryTable from '@/components/progress/CheckInHistoryTable';
import DailyMetricsCards from '@/components/progress/DailyMetricsCards';
import { useAuth } from '@/context/auth';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { checkClientAccess } from '@/services/clinics/auth-helper';
import { isDemoClientEmail } from '@/services/auth/demo/utils';
import { useQuery } from '@tanstack/react-query';
import { CheckInFetchers } from '@/services/check-ins/check-in-fetchers';

const ClientProgress = () => {
  const [activeTab, setActiveTab] = useState<string>("charts");
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const { user } = useAuth();
  
  // Fetch client check-ins
  const { data: checkInsData = [] } = useQuery({
    queryKey: ['client-checkins', user?.id],
    queryFn: () => user?.id ? CheckInFetchers.getClientCheckIns(user.id) : Promise.resolve([]),
    enabled: !!user?.id && hasAccess
  });
  
  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      try {
        // For demo accounts, always allow access - specifically check for demo client emails
        if (user?.email && isDemoClientEmail(user.email)) {
          console.log('Demo client detected, granting access to progress page');
          setHasAccess(true);
          setIsLoading(false);
          return;
        }
        
        const session = await checkClientAccess();
        if (session) {
          setHasAccess(true);
        } else {
          toast.error("You need to be logged in as a client to view this page");
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Error checking client access:", error);
        toast.error("Error checking permissions");
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!hasAccess && !isLoading) {
    return <Navigate to="/login" replace />;
  }

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
              <MealHistoryTable data={checkInsData} />
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
