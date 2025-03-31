
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string | null;
  description: string;
}

interface CheckedSupplements {
  [key: string]: boolean;
}

interface SupplementsListProps {
  supplements: Supplement[];
  checkedSupplements: CheckedSupplements;
  onSupplementChange: (id: string, checked: boolean) => void;
}

const SupplementsList: React.FC<SupplementsListProps> = ({
  supplements,
  checkedSupplements,
  onSupplementChange
}) => {
  return (
    <div className="space-y-3">
      {supplements.map((supplement) => (
        <div key={supplement.id} className="flex items-start space-x-2 mb-3">
          <Checkbox
            id={supplement.id}
            checked={!!checkedSupplements[supplement.id]}
            onCheckedChange={(checked) => 
              onSupplementChange(supplement.id, Boolean(checked))
            }
          />
          <div className="grid gap-0.5">
            <label
              htmlFor={supplement.id}
              className="font-medium cursor-pointer"
            >
              {supplement.name}
            </label>
            <p className="text-sm text-gray-500">
              {supplement.dosage} - {supplement.frequency}
              {supplement.time_of_day && ` - ${supplement.time_of_day}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupplementsList;
