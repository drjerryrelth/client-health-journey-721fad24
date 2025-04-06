
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/auth';
import { isSystemAdmin } from '@/utils/role-based-access';

interface Clinic {
  id: string;
  name: string;
}

interface ClinicSelectorProps {
  clinics: Clinic[];
  selectedClinicId: string | null;
  onSelectClinic: (clinicId: string) => void;
  isLoading: boolean;
}

export const ClinicSelector: React.FC<ClinicSelectorProps> = ({
  clinics,
  selectedClinicId,
  onSelectClinic,
  isLoading
}) => {
  const { user } = useAuth();
  const isAdmin = isSystemAdmin(user);
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Select Clinic</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-9 bg-gray-200 animate-pulse rounded" />
        ) : (
          <Select
            value={selectedClinicId || ''}
            onValueChange={onSelectClinic}
            disabled={!isAdmin || clinics.length <= 1}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a clinic" />
            </SelectTrigger>
            <SelectContent>
              {clinics.map((clinic) => (
                <SelectItem key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {!isAdmin && (
          <p className="mt-2 text-sm text-gray-500">
            As a clinic admin, you can only customize your own clinic.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
