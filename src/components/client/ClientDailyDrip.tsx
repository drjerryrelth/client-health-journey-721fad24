
import React from 'react';
import { useClientDrip } from '@/hooks/client/useClientDrip';
import DripMessageCard from './drip/DripMessageCard';
import DripLoadingCard from './drip/DripLoadingCard';

const ClientDailyDrip = () => {
  const { todaysDrip, loading, markAsRead } = useClientDrip();
  
  if (loading) {
    return <DripLoadingCard />;
  }
  
  if (!todaysDrip) {
    return null; // Don't show anything if no message for today
  }
  
  return (
    <DripMessageCard message={todaysDrip} onMarkAsRead={markAsRead} />
  );
};

export default ClientDailyDrip;
