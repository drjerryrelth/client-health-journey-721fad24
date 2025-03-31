
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ListCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Program, Supplement } from '@/types';

interface ProgramDetailsDialogProps {
  program: Program | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProgramDetailsDialog = ({ program, isOpen, onClose }: ProgramDetailsDialogProps) => {
  if (!program) return null;

  const formatDuration = (days: number): string => {
    if (days === 30) return '30 days';
    if (days === 60) return '60 days';
    if (days % 7 === 0) {
      const weeks = days / 7;
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    }
    return `${days} days`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{program.name}</DialogTitle>
          <DialogDescription>
            {program.type.replace('_', ' ')} program
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Duration: {formatDuration(program.duration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Check-in: {program.checkInFrequency === 'daily' ? 'Daily' : 'Weekly'}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-1">Description</h3>
            <p className="text-sm text-gray-600">{program.description}</p>
          </div>

          {program.supplements && program.supplements.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <ListCheck className="h-4 w-4" />
                  <span>Supplements ({program.supplements.length})</span>
                </h3>
                <div className="space-y-3">
                  {program.supplements.map((supplement: Supplement) => (
                    <div key={supplement.id} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{supplement.name}</h4>
                        <Badge variant="outline">{supplement.frequency}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{supplement.description}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">Dosage:</span> {supplement.dosage}
                        {supplement.timeOfDay && (
                          <span className="ml-2">
                            <span className="font-medium">When:</span> {supplement.timeOfDay}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {program.type === 'practice_naturals' && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Practice Naturals Categories</h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium">Category A</h4>
                    <p className="text-sm text-gray-600">Smaller portions for clients with lower caloric needs</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium">Category B</h4>
                    <p className="text-sm text-gray-600">Medium portions for clients with average caloric needs</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium">Category C</h4>
                    <p className="text-sm text-gray-600">Larger portions for clients with higher caloric needs</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {program.type === 'chirothin' && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">ChiroThin Meal Plan</h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium">Lunch & Dinner Only</h4>
                    <p className="text-sm text-gray-600">4oz each of protein, fruits, and vegetables per meal</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium">Overnight Fasting</h4>
                    <p className="text-sm text-gray-600">No breakfast as part of the program protocol</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDetailsDialog;
