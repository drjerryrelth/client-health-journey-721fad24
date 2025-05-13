
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useClientData } from '@/components/client/ClientDataProvider';

const ProgramProgressSection: React.FC = () => {
  const { calculateProgress } = useClientData();
  
  // Make sure we have a valid progress percentage
  const progressPercent = calculateProgress ? calculateProgress() : 0;
  
  return (
    <div>
      <h3 className="font-medium mb-3">Program Progress</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4">
        <Button asChild size="sm" variant="outline" className="gap-2">
          <Link to="/client/check-in">
            <Calendar size={16} /> Record Today's Check-in
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProgramProgressSection;
