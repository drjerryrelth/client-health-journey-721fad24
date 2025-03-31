
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building } from 'lucide-react';
import { CoachWithClinic } from '@/hooks/queries/use-admin-coaches';

interface CoachesTableProps {
  coaches: CoachWithClinic[];
}

const CoachesTable: React.FC<CoachesTableProps> = ({ coaches }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Clinic</TableHead>
            <TableHead>Clients</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coaches.length > 0 ? (
            coaches.map((coach) => (
              <TableRow key={coach.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="font-medium">{coach.name}</div>
                </TableCell>
                <TableCell>{coach.email}</TableCell>
                <TableCell>{coach.phone || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary-100 h-6 w-6 rounded-full flex items-center justify-center">
                      <Building className="h-3 w-3 text-primary-700" />
                    </div>
                    <span>{coach.clinicName}</span>
                  </div>
                </TableCell>
                <TableCell>{coach.clients}</TableCell>
                <TableCell>
                  <Badge className={coach.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} variant="outline">
                    {coach.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                No coaches found in the system. Please add coaches to clinics to see them here.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoachesTable;
