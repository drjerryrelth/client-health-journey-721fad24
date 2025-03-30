
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeft, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Coach, getMockCoaches } from '@/services/coach-service';
import CoachList from '@/components/coaches/CoachList';
import AddClinicDialog from '@/components/clinics/AddClinicDialog';
import ClinicsTable from '@/components/clinics/ClinicsTable';
import AddCoachDialog from '@/components/coaches/AddCoachDialog';
import EditCoachDialog from '@/components/coaches/EditCoachDialog';
import ReassignClientsDialog from '@/components/coaches/ReassignClientsDialog';

const ClinicsPage = () => {
  const { toast } = useToast();
  const [selectedClinic, setSelectedClinic] = useState<{id: string, name: string} | null>(null);
  const [showAddCoachDialog, setShowAddCoachDialog] = useState(false);
  const [showEditCoachDialog, setShowEditCoachDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [showAddClinicDialog, setShowAddClinicDialog] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [replacementCoachId, setReplacementCoachId] = useState<string>('');
  
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
    setShowAddClinicDialog(true);
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

  const handleAddCoach = () => {
    setShowAddCoachDialog(true);
  };

  const handleEditCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setShowEditCoachDialog(true);
  };

  const handleDeleteCoach = (coach: Coach) => {
    if (coach.clients > 0) {
      setSelectedCoach(coach);
      setShowReassignDialog(true);
    } else {
      toast({
        title: "Confirm Deletion",
        description: `Are you sure you want to remove ${coach.name}? This will revoke their access to the system.`,
        action: (
          <Button 
            variant="destructive" 
            onClick={() => {
              toast({
                title: "Coach Removed",
                description: `${coach.name} has been removed from ${selectedClinic?.name}.`
              });
            }}
          >
            Delete
          </Button>
        ),
      });
    }
  };

  const handleReassignAndDelete = () => {
    if (!selectedCoach || !replacementCoachId) {
      toast({
        title: "Selection Required",
        description: "Please select a coach to reassign clients to.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Clients Reassigned and Coach Removed",
      description: `${selectedCoach.name}'s clients have been reassigned and the coach has been removed from ${selectedClinic?.name}.`
    });

    setShowReassignDialog(false);
    setReplacementCoachId('');
  };

  const availableCoaches = selectedClinic && selectedCoach
    ? getMockCoaches()
        .filter(coach => coach.clinicId === selectedClinic.id && coach.id !== selectedCoach.id)
    : [];

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
            <Button onClick={handleAddCoach} className="flex items-center gap-2">
              <UserPlus size={18} />
              <span>Add Coach</span>
            </Button>
          </CardHeader>
          <CardContent>
            <CoachList 
              clinicId={selectedClinic.id} 
              onEdit={handleEditCoach}
              onDelete={handleDeleteCoach}
            />
          </CardContent>
        </Card>

        {/* Dialogs */}
        <AddCoachDialog 
          open={showAddCoachDialog} 
          onOpenChange={setShowAddCoachDialog} 
          clinicName={selectedClinic.name} 
        />

        <EditCoachDialog 
          open={showEditCoachDialog} 
          onOpenChange={setShowEditCoachDialog} 
          coach={selectedCoach} 
          clinicName={selectedClinic.name} 
        />

        <ReassignClientsDialog 
          open={showReassignDialog}
          onOpenChange={setShowReassignDialog}
          selectedCoach={selectedCoach}
          availableCoaches={availableCoaches}
          replacementCoachId={replacementCoachId}
          setReplacementCoachId={setReplacementCoachId}
          onReassignAndDelete={handleReassignAndDelete}
        />
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
          <ClinicsTable 
            clinics={clinics}
            onClinicSelect={handleClinicSelect}
            getStatusColor={getStatusColor}
          />
        </CardContent>
      </Card>

      {/* Add Clinic Dialog */}
      <AddClinicDialog open={showAddClinicDialog} onOpenChange={setShowAddClinicDialog} />
    </div>
  );
};

export default ClinicsPage;
