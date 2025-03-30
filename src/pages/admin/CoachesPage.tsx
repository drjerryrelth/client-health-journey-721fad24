import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getMockCoaches } from '@/services/coaches';

const CoachesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const coaches = getMockCoaches();

  const handleBackToClinics = () => {
    navigate("/clinics");
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBackToClinics}
          className="mr-2 flex items-center gap-1"
        >
          <ArrowLeft size={18} />
          <span>Back to All Clinics</span>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">All Coaches</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Coaches</CardTitle>
        </CardHeader>
        <CardContent>
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
                {coaches.map((coach) => (
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
                        <span>Clinic {coach.clinicId.slice(-4)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{coach.clients}</TableCell>
                    <TableCell>
                      <Badge className={coach.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} variant="outline">
                        {coach.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {coaches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      No coaches found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachesPage;
