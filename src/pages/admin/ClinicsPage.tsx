import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeft, UserPlus, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Coach, CoachService, getMockCoaches } from '@/services/coach-service';
import CoachList from '@/components/coaches/CoachList';
import AddClinicDialog from '@/components/clinics/AddClinicDialog';
import ClinicsTable from '@/components/clinics/ClinicsTable';
import AddCoachDialog from '@/components/coaches/AddCoachDialog';
import EditCoachDialog from '@/components/coaches/EditCoachDialog';
import ReassignClientsDialog from '@/components/coaches/ReassignClientsDialog';
import ClinicService, { Clinic } from '@/services/clinic-service';
import EditClinicDialog from '@/components/clinics/EditClinicDialog';
import ClinicDetailsTab from '@/components/clinics/ClinicDetailsTab';
import ResetPasswordDialog from '@/components/auth/ResetPasswordDialog';

const ClinicsPage = () => {
  const { toast } = useToast();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [activeClinicTab, setActiveClinicTab] = useState('coaches');
  const [showAddCoachDialog, setShowAddCoachDialog] = useState(false);
  const [showEditCoachDialog, setShowEditCoachDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [showAddClinicDialog, setShowAddClinicDialog] = useState(false);
  const [showEditClinicDialog, setShowEditClinicDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [replacementCoachId, setReplacementCoachId] = useState<string>('');
  const [coachListRefreshTrigger, setCoachListRefreshTrigger] = useState(0);

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
    setActiveClinicTab('coaches');
  };

  const handleAddCoach = () => {
    setShowAddCoachDialog(true);
  };

  const handleCoachAdded = () => {
    setCoachListRefreshTrigger(prev => prev + 1);
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

  const handleReassignAndDelete = async () => {
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
        selectedCoach.id, 
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

    setShowReassignDialog(false);
    setReplacementCoachId('');
  };

  const handleAddClinic = () => {
    setShowAddClinicDialog(true);
  };

  const handleEditClinic = () => {
    if (selectedClinic) {
      setShowEditClinicDialog(true);
    }
  };

  const handleOpenResetPassword = () => {
    setShowResetPasswordDialog(true);
  };

  const availableCoaches = selectedClinic && selectedCoach
    ? getMockCoaches()
        .filter(coach => coach.clinicId === selectedClinic.id && coach.id !== selectedCoach.id)
    : [];

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
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">{selectedClinic.name}</h1>
            <div className="flex items-center mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedClinic.status)}`}>
                {selectedClinic.status.toUpperCase()}
              </span>
              {selectedClinic.subscriptionTier && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {selectedClinic.subscriptionTier.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <Tabs value={activeClinicTab} onValueChange={setActiveClinicTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="coaches">Coaches</TabsTrigger>
            <TabsTrigger value="details">Clinic Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="coaches">
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
                  refreshTrigger={coachListRefreshTrigger}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <ClinicDetailsTab 
              clinic={selectedClinic}
              onEditClick={handleEditClinic} 
            />
          </TabsContent>
        </Tabs>

        <AddCoachDialog 
          open={showAddCoachDialog} 
          onOpenChange={setShowAddCoachDialog} 
          clinicName={selectedClinic.name}
          clinicId={selectedClinic.id}
          onCoachAdded={handleCoachAdded}
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

        <EditClinicDialog 
          open={showEditClinicDialog} 
          onOpenChange={setShowEditClinicDialog} 
          clinicId={selectedClinic.id}
          onClinicUpdated={() => {
            handleClinicSelect(selectedClinic.id);
          }}
        />
      </div>
    );
  }

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
          <Button onClick={handleOpenResetPassword} variant="outline">
            Reset Password
          </Button>
          <Button onClick={handleAddClinic} className="flex items-center gap-2">
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
            clinics={formattedClinics}
            onClinicSelect={handleClinicSelect}
            getStatusColor={getStatusColor}
          />
        </CardContent>
      </Card>

      <AddClinicDialog 
        open={showAddClinicDialog} 
        onOpenChange={setShowAddClinicDialog}
        onClinicAdded={fetchClinics}
      />
      
      <ResetPasswordDialog 
        open={showResetPasswordDialog}
        onOpenChange={setShowResetPasswordDialog}
      />
    </div>
  );
};

export default ClinicsPage;
