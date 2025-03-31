
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Calendar, Building, Users, Activity } from 'lucide-react';
import { ActivityItem } from '@/types/dashboard';

interface ActivityListProps {
  activities: ActivityItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  onViewAll: () => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  isLoading,
  isError,
  refetch,
  onViewAll
}) => {
  // Helper function to determine which icon to show
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'check_in':
        return <Calendar size={16} className="text-blue-500 mt-1" />;
      case 'clinic_signup':
        return <Building size={16} className="text-green-500 mt-1" />;
      case 'coach_added':
        return <Users size={16} className="text-amber-500 mt-1" />;
      default:
        return <Activity size={16} className="text-gray-500 mt-1" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Recent Activities</CardTitle>
        <Button onClick={onViewAll} variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-5 w-5 rounded-full mt-1" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center text-red-500 mb-2">
              <AlertTriangle size={18} className="mr-2" />
              <span>Failed to load activities</span>
            </div>
            <div>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                size="sm" 
                className="ml-2"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : !activities || activities.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No recent activities found
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                {getActivityIcon(activity.type)}
                <div>
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityList;
