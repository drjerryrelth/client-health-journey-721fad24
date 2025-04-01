
import React from 'react';
import { Loader2 } from 'lucide-react';

interface CoachListLoaderProps {
  message?: string;
}

const CoachListLoader: React.FC<CoachListLoaderProps> = ({ 
  message = "Loading coaches..." 
}) => {
  return (
    <div className="flex flex-col items-center py-8 space-y-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="text-sm text-muted-foreground font-medium">{message}</div>
    </div>
  );
};

export default CoachListLoader;
