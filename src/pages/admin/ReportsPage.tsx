
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Banknote, Activity, TrendingUp, Users } from 'lucide-react';

const ReportsPage = () => {
  // Mock monthly revenue data
  const revenueData = [
    { month: 'Jan', revenue: 12000, clients: 18 },
    { month: 'Feb', revenue: 15000, clients: 22 },
    { month: 'Mar', revenue: 18000, clients: 28 },
    { month: 'Apr', revenue: 20000, clients: 32 },
    { month: 'May', revenue: 22000, clients: 35 },
    { month: 'Jun', revenue: 25000, clients: 40 }
  ];

  // Mock subscription plans data
  const subscriptionData = [
    { id: 1, name: 'Wellness Center', plan: 'Enterprise', price: '$499/month', startDate: '10/15/2023', clients: 18 },
    { id: 2, name: 'Practice Naturals', plan: 'Premium', price: '$299/month', startDate: '11/03/2023', clients: 12 },
    { id: 3, name: 'Health Partners', plan: 'Standard', price: '$199/month', startDate: '01/22/2024', clients: 9 }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <p className="text-gray-500">Overview of your business performance</p>
      </div>
      
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Banknote className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$112,000</div>
            <p className="text-xs text-green-500">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Activity className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-green-500">+1 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg. Revenue per Clinic</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$331/mo</div>
            <p className="text-xs text-green-500">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40</div>
            <p className="text-xs text-green-500">+5 from last month</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Revenue Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
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
          <CardTitle>Subscription Plans</CardTitle>
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
