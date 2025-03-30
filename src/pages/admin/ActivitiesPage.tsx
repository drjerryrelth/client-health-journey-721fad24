
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, Bell, Users } from 'lucide-react';

const AdminActivitiesPage = () => {
  // Mock data for admin activities
  const recentActivities = [
    {
      id: 1,
      type: 'clinic_signup',
      description: 'New clinic signed up: Wellness Center',
      timestamp: '2 hours ago',
      icon: <Users size={16} className="text-blue-500" />
    },
    {
      id: 2,
      type: 'coach_added',
      description: 'Coach Michael was added to Health Partners clinic',
      timestamp: '1 day ago',
      icon: <Users size={16} className="text-green-500" />
    },
    {
      id: 3,
      type: 'message',
      description: 'Clinic message: Practice Naturals requested billing support',
      timestamp: '2 days ago',
      icon: <Bell size={16} className="text-amber-500" />
    },
    {
      id: 4,
      type: 'check_in',
      description: 'Weekly check-in summary: 52 new client check-ins this week',
      timestamp: '3 days ago',
      icon: <Calendar size={16} className="text-purple-500" />
    },
    {
      id: 5,
      type: 'client_signup',
      description: 'New clients: 8 clients were added across all clinics',
      timestamp: '5 days ago',
      icon: <Users size={16} className="text-indigo-500" />
    },
    {
      id: 6,
      type: 'program_update',
      description: 'Program update: "Weight Management 2.0" was published',
      timestamp: '1 week ago',
      icon: <Activity size={16} className="text-green-500" />
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Activities</h1>
        <p className="text-gray-500">Recent platform activities across all clinics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b last:border-0">
                    <div className="mt-1">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm">New clinics this month</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm">New coaches this month</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm">New clients this month</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm">Active programs</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Support requests</span>
                  <span className="font-bold">5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminActivitiesPage;
