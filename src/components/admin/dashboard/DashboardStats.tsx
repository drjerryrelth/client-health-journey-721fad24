
import React from 'react';
import { Building, Users, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from './StatsCard';
import { DashboardStats as DashboardStatsType } from '@/types/dashboard';

interface DashboardStatsProps {
  stats: DashboardStatsType | undefined;
  isLoading: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isLoading }) => {
  const navigate = useNavigate();
  
  const statsData = [
    { 
      title: 'Active Clinics', 
      value: stats?.activeClinicCount || 0, 
      icon: <Building className="text-primary-500" size={24} />,
      path: '/admin/clinics'
    },
    { 
      title: 'Total Coaches', 
      value: stats?.totalCoachCount || 0, 
      icon: <Users className="text-secondary-500" size={24} />,
      path: '/admin/coaches'
    },
    { 
      title: 'Weekly Activities', 
      value: stats?.weeklyActivitiesCount || 0, 
      icon: <Activity className="text-purple-500" size={24} />,
      path: '/admin/activities'
    },
  ];
  
  const handleStatClick = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          isLoading={isLoading}
          onClick={() => handleStatClick(stat.path)}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
