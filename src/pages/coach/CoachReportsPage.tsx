
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Activity, TrendingUp, Weight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const CoachReportsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    averageProgress: 0,
    checkInsThisWeek: 0
  });
  const [checkInData, setCheckInData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCoachStats = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Fetch clients for this coach
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id, start_date, last_check_in')
          .eq('coach_id', user.id);
          
        if (clientsError) throw clientsError;
        
        // Count total and active clients
        const totalClients = clientsData.length;
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const activeClients = clientsData.filter(client => {
          if (!client.last_check_in) return false;
          const lastCheckIn = new Date(client.last_check_in);
          return lastCheckIn > oneMonthAgo;
        }).length;
        
        // Calculate average progress (mock calculation)
        const today = new Date();
        const totalDays = clientsData.reduce((sum, client) => {
          if (!client.start_date) return sum;
          const startDate = new Date(client.start_date);
          const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
          return sum + Math.min(daysSinceStart, 90); // Cap at 90 days
        }, 0);
        
        const averageProgress = totalClients ? Math.round((totalDays / (totalClients * 90)) * 100) : 0;
        
        // Get check-ins for the past week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const clientIds = clientsData.map(client => client.id);
        
        let checkInsThisWeek = 0;
        let chartData: any[] = [];
        
        if (clientIds.length > 0) {
          const { data: checkInsData, error: checkInsError } = await supabase
            .from('check_ins')
            .select('date')
            .in('client_id', clientIds)
            .gte('date', oneWeekAgo.toISOString().split('T')[0]);
            
          if (checkInsError) throw checkInsError;
          
          checkInsThisWeek = checkInsData.length;
          
          // Get data for chart (last 6 months of check-ins by month)
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          
          const { data: historicalData, error: historicalError } = await supabase
            .from('check_ins')
            .select('date, weight')
            .in('client_id', clientIds)
            .gte('date', sixMonthsAgo.toISOString().split('T')[0])
            .order('date');
            
          if (historicalError) throw historicalError;
          
          // Group by month
          const monthlyData: {[key: string]: {count: number, weightSum: number, weightCount: number}} = {};
          
          historicalData.forEach(record => {
            const date = new Date(record.date);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthYear]) {
              monthlyData[monthYear] = { count: 0, weightSum: 0, weightCount: 0 };
            }
            
            monthlyData[monthYear].count++;
            
            if (record.weight) {
              monthlyData[monthYear].weightSum += record.weight;
              monthlyData[monthYear].weightCount++;
            }
          });
          
          chartData = Object.entries(monthlyData).map(([monthYear, data]) => {
            const [year, month] = monthYear.split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthName = monthNames[parseInt(month) - 1];
            
            return {
              month: `${monthName} ${year}`,
              checkIns: data.count,
              avgWeight: data.weightCount ? Math.round(data.weightSum / data.weightCount) : null
            };
          });
        }
        
        setStats({
          totalClients,
          activeClients,
          averageProgress,
          checkInsThisWeek
        });
        
        setCheckInData(chartData);
      } catch (error) {
        console.error('Error fetching coach stats:', error);
        toast.error('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoachStats();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coach Reports</h1>
        <p className="text-gray-500">Overview of your clients' performance</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Activity className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              Clients with check-ins in the last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProgress}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Check-ins This Week</CardTitle>
            <Weight className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkInsThisWeek}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Check-ins Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Monthly Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          {checkInData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={checkInData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="checkIns" name="Check-ins" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="avgWeight" name="Avg Weight (lbs)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Not enough check-in data available for chart display.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachReportsPage;
