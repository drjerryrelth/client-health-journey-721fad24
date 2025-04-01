
import React from 'react';

const CoachListLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-8 space-y-2">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      <div className="text-sm text-muted-foreground">Loading coaches...</div>
    </div>
  );
};

export default CoachListLoader;
