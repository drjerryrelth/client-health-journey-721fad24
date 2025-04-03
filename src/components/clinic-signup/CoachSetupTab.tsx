
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { ClinicSignupFormValues, CoachFormData } from './types';
import AdditionalCoach from './AdditionalCoach';

interface CoachSetupTabProps {
  form: UseFormReturn<ClinicSignupFormValues>;
  additionalCoaches: CoachFormData[];
  onAddCoach: () => void;
  onRemoveCoach: (index: number) => void;
  onUpdateCoach: (index: number, field: keyof CoachFormData, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const CoachSetupTab = ({ 
  form, 
  additionalCoaches, 
  onAddCoach, 
  onRemoveCoach, 
  onUpdateCoach,
  onBack,
  onNext 
}: CoachSetupTabProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <h3 className="text-blue-800 font-medium mb-1">About Coach Setup</h3>
        <p className="text-blue-700 text-sm">
          The primary contact person will automatically be set up as the first coach for your clinic.
          You can add additional coaches now or later through your dashboard.
        </p>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Primary Coach (Clinic Contact)</h3>
        <div className="bg-gray-50 p-4 border rounded-md">
          <p className="text-sm">Name: <span className="font-medium">{form.watch('primaryContact')}</span></p>
          <p className="text-sm">Email: <span className="font-medium">{form.watch('clinicEmail')}</span></p>
          <p className="text-sm">Phone: <span className="font-medium">{form.watch('clinicPhone')}</span></p>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Additional Coaches (Optional)</h3>
          <Button type="button" variant="outline" onClick={onAddCoach} className="flex items-center gap-1">
            <Plus size={16} />
            Add Coach
          </Button>
        </div>
        
        {additionalCoaches.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">
            No additional coaches added yet.
          </p>
        ) : (
          <div className="space-y-4">
            {additionalCoaches.map((coach, index) => (
              <AdditionalCoach
                key={index}
                coach={coach}
                index={index}
                onChange={onUpdateCoach}
                onRemove={onRemoveCoach}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onNext}>
          Next: Account Setup
        </Button>
      </div>
    </div>
  );
};

export default CoachSetupTab;
