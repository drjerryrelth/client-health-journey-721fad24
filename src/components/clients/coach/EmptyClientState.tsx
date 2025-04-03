
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface EmptyClientStateProps {
  onAddClient: () => void;
}

const EmptyClientState: React.FC<EmptyClientStateProps> = ({ onAddClient }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <p className="text-lg font-medium text-gray-700 mb-4">You don't have any clients yet</p>
      <Button onClick={onAddClient} className="flex items-center">
        <UserPlus className="mr-2 h-4 w-4" />
        Add Your First Client
      </Button>
    </div>
  );
};

export default EmptyClientState;
