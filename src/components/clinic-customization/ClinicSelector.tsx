
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Building } from 'lucide-react';

interface Clinic {
  id: string;
  name: string;
  logo?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
}

interface ClinicSelectorProps {
  clinics: Clinic[] | undefined;
  selectedClinicId: string | null;
  onSelectClinic: (clinicId: string) => void;
  isLoading: boolean;
}

const ClinicSelector = ({ 
  clinics, 
  selectedClinicId, 
  onSelectClinic, 
  isLoading 
}: ClinicSelectorProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Clinic</CardTitle>
          <CardDescription>Choose a clinic to customize its appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Clinic</CardTitle>
        <CardDescription>Choose a clinic to customize its appearance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {clinics?.map(clinic => (
            <div
              key={clinic.id}
              className={`p-3 rounded-md cursor-pointer flex items-center ${
                selectedClinicId === clinic.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-gray-100'
              }`}
              onClick={() => onSelectClinic(clinic.id)}
            >
              <Building className="mr-2 h-5 w-5 text-gray-500" />
              <span>{clinic.name}</span>
            </div>
          ))}
          
          {(!clinics || clinics.length === 0) && (
            <p className="text-gray-500 text-center py-4">No clinics available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicSelector;
