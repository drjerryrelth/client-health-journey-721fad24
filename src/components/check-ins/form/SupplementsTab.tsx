
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClientSupplements } from '@/hooks/use-client-supplements';
import SupplementsList from './supplements/SupplementsList';

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
  const {
    programSupplements,
    checkedSupplements,
    loading,
    handleSupplementChange
  } = useClientSupplements({ supplements, setSupplements });

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-sm text-gray-500">Loading your supplements...</p>
      ) : programSupplements.length > 0 ? (
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Supplements Taken Today</CardTitle>
            </CardHeader>
            <CardContent>
              <SupplementsList 
                supplements={programSupplements}
                checkedSupplements={checkedSupplements}
                onSupplementChange={handleSupplementChange}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
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
      )}
      
      <div>
        <Label htmlFor="generalNotes">Additional Notes</Label>
        <Textarea
          id="generalNotes"
          placeholder="Any additional notes about your progress for this day?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          You can record check-ins for up to 7 previous days. Make sure the correct date is selected.
        </p>
      </div>
    </div>
  );
};

export default SupplementsTab;
