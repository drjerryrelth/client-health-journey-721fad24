
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCoachDashboardStats, useCoachRecentActivities } from '@/hooks/use-coach-dashboard-stats';
import { useCoachActions } from '@/hooks/use-coach-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const CoachDashboard = () => {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useCoachDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useCoachRecentActivities(5);
  const { addClient, isLoading: actionLoading } = useCoachActions();
  const navigate = useNavigate();

  // Define clickable card paths
  const cardActions = [
    { name: 'activeClients', path: '/coach/clients' },
    { name: 'pendingCheckIns', path: '/coach/check-ins' },
    { name: 'activePrograms', path: '/coach/reports' },
    { name: 'completedPrograms', path: '/coach/reports' }
  ];

  // Handle card click
  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || 'Coach'}</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your clients today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick('/coach/clients')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.activeClients || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick('/coach/check-ins')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.pendingCheckIns || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick('/coach/reports')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.activePrograms || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick('/coach/reports')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Programs</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.completedPrograms || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your clients' recent actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activitiesLoading ? (
              <>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </>
            ) : activities && activities.length > 0 ? (
              activities.map((activity, i) => (
                <div key={i}>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.description}</p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  {i < activities.length - 1 && <Separator className="my-2" />}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent activities</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Quick actions for managing your clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/coach/clients?action=add')}
                disabled={actionLoading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                Add Client
              </button>
              <button
                onClick={() => navigate('/coach/check-ins')}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow hover:bg-secondary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                View Check-ins
              </button>
              <button
                onClick={() => navigate('/coach/resources')}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow hover:bg-secondary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                Resources
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachDashboard;
