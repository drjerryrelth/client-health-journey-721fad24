
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Building, ChevronRight } from 'lucide-react';

interface Clinic {
  id: string;
  name: string;
  coaches: number;
  clients: number;
  location: string;
  status: string;
}

interface ClinicsTableProps {
  clinics: Clinic[];
  onClinicSelect: (clinic: {id: string, name: string}) => void;
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
          {clinics.map((clinic) => (
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
              <TableCell>{clinic.location}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(clinic.status)} variant="outline">
                  {clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  className="flex items-center"
                  onClick={() => onClinicSelect({id: clinic.id, name: clinic.name})}
                >
                  <span className="mr-1">Manage Coaches</span>
                  <ChevronRight size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClinicsTable;
