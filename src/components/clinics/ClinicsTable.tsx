
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Building, ChevronRight } from 'lucide-react';

interface FormattedClinic {
  id: string;
  name: string;
  coaches: number;
  clients: number;
  city?: string | null;
  state?: string | null;
  status: string;
}

interface ClinicsTableProps {
  clinics: FormattedClinic[];
  onClinicSelect: (clinicId: string) => void;
  getStatusColor: (status: string) => string;
}

const ClinicsTable = ({ clinics, onClinicSelect, getStatusColor }: ClinicsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Clinic</TableHead>
            <TableHead>Coaches</TableHead>
            <TableHead>Clients</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clinics.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No clinics found. Add a clinic to get started.
              </TableCell>
            </TableRow>
          ) : (
            clinics.map((clinic) => (
              <TableRow key={clinic.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 h-10 w-10 rounded-full flex items-center justify-center">
                      <Building className="h-5 w-5 text-primary-700" />
                    </div>
                    <div className="font-medium">{clinic.name}</div>
                  </div>
                </TableCell>
                <TableCell>{clinic.coaches}</TableCell>
                <TableCell>{clinic.clients}</TableCell>
                <TableCell>
                  {clinic.city && clinic.state 
                    ? `${clinic.city}, ${clinic.state}`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(clinic.status)} variant="outline">
                    {clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    className="flex items-center"
                    onClick={() => onClinicSelect(clinic.id)}
                  >
                    <span className="mr-1">Manage</span>
                    <ChevronRight size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClinicsTable;
