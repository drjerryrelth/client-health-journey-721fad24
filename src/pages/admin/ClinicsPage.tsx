
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Building, ChevronRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CoachList from '@/components/coaches/CoachList';

const ClinicsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedClinic, setSelectedClinic] = useState<{id: string, name: string} | null>(null);

  // Mock clinics data
  const clinics = [
    { 
      id: '1',
      name: 'Wellness Center',
      coaches: 4,
      clients: 18,
      location: 'New York, NY',
      status: 'active'
    },
    { 
      id: '2',
      name: 'Practice Naturals',
      coaches: 3,
      clients: 12,
      location: 'Los Angeles, CA',
      status: 'active'
    },
    { 
      id: '3',
      name: 'Health Partners',
      coaches: 2,
      clients: 9,
      location: 'Chicago, IL',
      status: 'active'
    },
  ];

  const handleAddClinic = () => {
    toast({
      title: "Coming Soon",
      description: "The Add Clinic feature is under development",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClinicSelect = (clinic: {id: string, name: string}) => {
    setSelectedClinic(clinic);
  };

  const handleBackToAllClinics = () => {
    setSelectedClinic(null);
  };

  if (selectedClinic) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToAllClinics}
            className="mr-2 flex items-center gap-1"
          >
            <ArrowLeft size={18} />
            <span>Back to All Clinics</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{selectedClinic.name} - Coaches</h1>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Coaches at {selectedClinic.name}</CardTitle>
            <Button onClick={() => toast({
              title: "Coming Soon",
              description: "The Add Coach feature is under development",
            })} className="flex items-center gap-2">
              <PlusCircle size={18} />
              <span>Add Coach</span>
            </Button>
          </CardHeader>
          <CardContent>
            <CoachList clinicId={selectedClinic.id} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clinics</h1>
        <Button onClick={handleAddClinic} className="flex items-center gap-2">
          <PlusCircle size={18} />
          <span>Add Clinic</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Clinics</CardTitle>
        </CardHeader>
        <CardContent>
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
                        onClick={() => handleClinicSelect({id: clinic.id, name: clinic.name})}
                      >
                        <span className="mr-1">View Coaches</span>
                        <ChevronRight size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicsPage;
