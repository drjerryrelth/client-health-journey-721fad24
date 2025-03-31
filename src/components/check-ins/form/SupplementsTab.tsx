
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SupplementsTabProps {
  supplements: string;
  setSupplements: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
}

const SupplementsTab: React.FC<SupplementsTabProps> = ({
  supplements,
  setSupplements,
  notes,
  setNotes
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="supplements">Supplements Taken Today</Label>
        <Textarea
          id="supplements"
          placeholder="List supplements and time taken (e.g., Multivitamin - morning, Magnesium - evening)"
          value={supplements}
          onChange={(e) => setSupplements(e.target.value)}
          rows={4}
        />
      </div>
      
      <div>
        <Label htmlFor="generalNotes">Additional Notes</Label>
        <Textarea
          id="generalNotes"
          placeholder="Any additional notes about your progress today?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

export default SupplementsTab;
