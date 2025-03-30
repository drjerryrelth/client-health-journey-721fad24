
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Coach, CoachService, getMockCoaches } from '@/services/coaches';
import AddClinicDialog from '@/components/clinics/AddClinicDialog';
import ResetPasswordDialog from '@/components/auth/ResetPasswordDialog';
import ClinicService, { Clinic } from '@/services/clinic-service';
import ClinicsOverview from '@/components/clinics/ClinicsOverview';
import ClinicDetail from '@/components/clinics/ClinicDetail';

const ClinicsPage = () => {
  const { toast } = useToast();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [showAddClinicDialog, setShowAddClinicDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const fetchedClinics = await ClinicService.getClinics();
      setClinics(fetchedClinics);
    } catch (error) {
      console.error("Error fetching clinics:", error);
      toast({
        title: "Error",
        description: "Failed to fetch clinics. Using mock data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

  const handleClinicSelect = async (clinicId: string) => {
    try {
      setLoading(true);
      const clinicDetails = await ClinicService.getClinic(clinicId);
      
      if (clinicDetails) {
        setSelectedClinic(clinicDetails);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch clinic details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching clinic details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch clinic details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAllClinics = () => {
    setSelectedClinic(null);
  };

  const handleAddClinic = () => {
    setShowAddClinicDialog(true);
  };

  const handleOpenResetPassword = () => {
    setShowResetPasswordDialog(true);
  };

  const handleDeleteCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    
    if (coach.clients <= 0) {
      toast({
        title: "Confirm Deletion",
        description: `Are you sure you want to remove ${coach.name}? This will revoke their access to the system.`,
        action: (
          <Button 
            variant="destructive" 
            onClick={async () => {
              try {
                await CoachService.removeCoachAndReassignClients(coach.id, '');
                toast({
                  title: "Coach Removed",
                  description: `${coach.name} has been removed from ${selectedClinic?.name}.`
                });
              } catch (error) {
                console.error("Error removing coach:", error);
                toast({
                  title: "Error",
                  description: "Failed to remove coach. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          >
            Delete
          </Button>
        ),
      });
    }
  };

  const handleReassignAndDelete = async (coachId: string, replacementCoachId: string) => {
    if (!selectedCoach || !replacementCoachId) {
      toast({
        title: "Selection Required",
        description: "Please select a coach to reassign clients to.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await CoachService.removeCoachAndReassignClients(
        coachId, 
        replacementCoachId
      );
      
      if (result) {
        toast({
          title: "Clients Reassigned and Coach Removed",
          description: `${selectedCoach.name}'s clients have been reassigned and the coach has been removed from ${selectedClinic?.name}.`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to reassign clients and remove coach.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error reassigning clients:", error);
      toast({
        title: "Error",
        description: "Failed to reassign clients and remove coach.",
        variant: "destructive"
      });
    }
  };

  const formattedClinics = clinics.map(clinic => ({
    id: clinic.id,
    name: clinic.name,
    city: clinic.city,
    state: clinic.state,
    status: clinic.status,
    coaches: 0,
    clients: 0,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (selectedClinic) {
    return (
      <ClinicDetail 
        clinic={selectedClinic}
        onBackClick={handleBackToAllClinics}
        getMockCoaches={getMockCoaches}
      />
    );
  }

  return (
    <>
      <ClinicsOverview 
        clinics={formattedClinics}
        onClinicSelect={handleClinicSelect}
        onAddClinic={handleAddClinic}
        onResetPassword={handleOpenResetPassword}
        getStatusColor={getStatusColor}
      />

      <AddClinicDialog 
        open={showAddClinicDialog} 
        onOpenChange={setShowAddClinicDialog}
        onClinicAdded={fetchClinics}
      />
      
      <ResetPasswordDialog 
        open={showResetPasswordDialog}
        onOpenChange={setShowResetPasswordDialog}
      />
    </>
  );
};

export default ClinicsPage;
