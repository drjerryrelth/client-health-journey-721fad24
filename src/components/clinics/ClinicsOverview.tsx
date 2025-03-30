
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import ClinicsTable from '@/components/clinics/ClinicsTable';

interface FormattedClinic {
  id: string;
  name: string;
  coaches: number;
  clients: number;
  city?: string | null;
  state?: string | null;
  status: string;
}

interface ClinicsOverviewProps {
  clinics: FormattedClinic[];
  onClinicSelect: (clinicId: string) => void;
  onAddClinic: () => void;
  onResetPassword: () => void;
  getStatusColor: (status: string) => string;
}

const ClinicsOverview = ({
  clinics,
  onClinicSelect,
  onAddClinic,
  onResetPassword,
  getStatusColor
}: ClinicsOverviewProps) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage clinics, their coaches, and billing information.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onResetPassword} variant="outline">
            Reset Password
          </Button>
          <Button onClick={onAddClinic} className="flex items-center gap-2">
            <Building size={18} />
            <span>Add Clinic</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Clinics</CardTitle>
        </CardHeader>
        <CardContent>
          <ClinicsTable 
            clinics={clinics}
            onClinicSelect={onClinicSelect}
            getStatusColor={getStatusColor}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicsOverview;
