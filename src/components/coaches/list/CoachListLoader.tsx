
import React from 'react';

interface CoachListLoaderProps {
  message?: string;
}

const CoachListLoader: React.FC<CoachListLoaderProps> = ({ 
  message = "Loading coaches..." 
}) => {
  return (
    <div className="flex flex-col items-center py-8 space-y-2">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      <div className="text-sm text-muted-foreground font-medium">{message}</div>
    </div>
  );
};

export default CoachListLoader;
