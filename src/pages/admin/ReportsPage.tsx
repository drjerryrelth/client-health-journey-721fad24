import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Banknote, Activity, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { isClinicAdmin } from '@/utils/role-based-access';
import { fetchRevenueData, fetchSubscriptionData, fetchTotalRevenue, fetchTotalClients } from '@/services/reports/report-service';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const ReportsPage = () => {
  const { user } = useAuth();
  const [revenueData, setRevenueData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Ensure proper role detection
        const isClinicAdminUser = user?.role === 'clinic_admin';
        const isSystemAdminUser = user?.role === 'admin' || user?.role === 'super_admin';
        
        if (isSystemAdminUser) {
          // System admin sees all clinics data
          const [revenue, subscriptions, totalRev, totalCl] = await Promise.all([
            fetchRevenueData(),
            fetchSubscriptionData(),
            fetchTotalRevenue(),
            fetchTotalClients()
          ]);
          
          setRevenueData(revenue);
          setSubscriptionData(subscriptions);
          setTotalRevenue(totalRev);
          setTotalClients(totalCl);
        } else if (isClinicAdminUser) {
          // Clinic admin only sees their clinic's data
          const [revenue, subscriptions, totalRev, totalCl] = await Promise.all([
            fetchRevenueData(user?.clinicId),
            fetchSubscriptionData(user?.clinicId),
            fetchTotalRevenue(user?.clinicId),
            fetchTotalClients(user?.clinicId)
          ]);
          
          setRevenueData(revenue);
          setSubscriptionData(subscriptions);
          setTotalRevenue(totalRev);
          setTotalClients(totalCl);
        }
      } catch (error) {
        console.error('Error loading report data:', error);
        toast.error('Failed to load report data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Dashboard header changes based on user role
  const dashboardTitle = isClinicAdmin(user) ? 'Clinic Financial Reports' : 'System Financial Reports';
  const dashboardDescription = isClinicAdmin(user) 
    ? 'Overview of your clinic performance' 
    : 'Overview of all clinics performance';

  if (isLoading) {
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
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{dashboardTitle}</h1>
        <p className="text-gray-500">{dashboardDescription}</p>
      </div>
      
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Banknote className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-500">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              {isClinicAdmin(user) ? 'Your Subscription' : 'Active Subscriptions'}
            </CardTitle>
            <Activity className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isClinicAdmin(user) 
                ? subscriptionData[0]?.plan || 'Basic' 
                : subscriptionData.length}
            </div>
            <p className="text-xs text-green-500">
              {isClinicAdmin(user) ? 'Active' : '+1 from last month'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              {isClinicAdmin(user) ? 'Monthly Revenue' : 'Avg. Revenue per Clinic'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isClinicAdmin(user) 
                ? `$${Math.round(totalRevenue / 6).toLocaleString()}/mo` 
                : `$${Math.round(totalRevenue / (subscriptionData.length || 1)).toLocaleString()}/mo`}
            </div>
            <p className="text-xs text-green-500">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-green-500">
              {isClinicAdmin(user) ? '+1 from last month' : '+5 from last month'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Revenue Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isClinicAdmin(user) ? 'Your Clinic Monthly Revenue' : 'System Monthly Revenue'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
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
                <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="clients" name="New Clients" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isClinicAdmin(user) ? 'Your Subscription' : 'All Subscriptions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Clinic</th>
                  <th className="text-left py-3 px-4 font-medium">Plan</th>
                  <th className="text-left py-3 px-4 font-medium">Price</th>
                  <th className="text-left py-3 px-4 font-medium">Since</th>
                  <th className="text-left py-3 px-4 font-medium">Clients</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionData.map((sub) => (
                  <tr key={sub.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{sub.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs">
                        {sub.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4">{sub.price}</td>
                    <td className="py-3 px-4">{sub.startDate}</td>
                    <td className="py-3 px-4">{sub.clients}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
