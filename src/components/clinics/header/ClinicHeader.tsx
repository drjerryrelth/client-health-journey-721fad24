
import React from 'react';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClinicHeaderProps {
  onBackClick: () => void;
  onEditClick: () => void;
}

const ClinicHeader = ({ onBackClick, onEditClick }: ClinicHeaderProps) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <Button variant="outline" onClick={onBackClick} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to All Clinics
      </Button>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onEditClick} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Clinic
        </Button>
      </div>
    </div>
  );
};

export default ClinicHeader;
