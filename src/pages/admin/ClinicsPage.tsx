
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Coach, CoachService, getMockCoaches } from '@/services/coaches';
import AddClinicDialog from '@/components/clinics/AddClinicDialog';
import ResetPasswordDialog from '@/components/auth/ResetPasswordDialog';
import ClinicService, { Clinic } from '@/services/clinic-service';
import ClinicsOverview from '@/components/clinics/ClinicsOverview';
import ClinicDetail from '@/components/clinics/ClinicDetail';
import { useCoachActions } from '@/hooks/use-coach-actions';

const ClinicsPage = () => {
  const { toast } = useToast();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [showAddClinicDialog, setShowAddClinicDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  
  // Coach actions from extracted hook
  const { selectedCoach, handleDeleteCoach, handleReassignAndDelete } = useCoachActions(
    selectedClinic?.name || '',
    toast
  );

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
