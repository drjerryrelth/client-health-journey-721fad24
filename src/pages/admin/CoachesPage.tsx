
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, RefreshCw } from 'lucide-react';
import { useAdminCoaches } from '@/hooks/queries/use-admin-coaches';
import CoachesErrorState from '@/components/admin/coaches/CoachesErrorState';
import CoachesFilter from '@/components/admin/coaches/CoachesFilter';
import CoachesTable from '@/components/admin/coaches/CoachesTable';
import CoachesLoadingState from '@/components/admin/coaches/CoachesLoadingState';
import { AddCoachDialog } from '@/components/coaches/add/AddCoachDialog';
import { EditCoachDialog } from '@/components/coaches/edit/EditCoachDialog';
import { DeleteCoachDialog } from '@/components/coaches/delete/DeleteCoachDialog';
import { ResetCoachPasswordDialog } from '@/components/coaches/reset-password/ResetCoachPasswordDialog';
import { Coach } from '@/services/coaches';
import { useClinicFilter } from '@/components/coaches/list/useClinicFilter';
import { useAuth } from '@/context/auth';

const CoachesPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [filterText, setFilterText] = useState('');
  
  // Get the user's role information
  const { user } = useAuth();
  
  // Get the clinic filter functions
  const { isClinicAdmin, filterByClinic, userClinicId } = useClinicFilter();
  
  // Fetch coaches data based on user role
  const { coaches: allCoaches, loading, error, refresh, retryCount } = useAdminCoaches();
  
  // Enhanced logging for debugging clinic admin view
  useEffect(() => {
    if (isClinicAdmin && user) {
      console.log("Clinic Admin viewing Coaches page:", {
        clinicId: user.clinicId,
        name: user.name,
        role: user.role
      });
    }
    
    if (allCoaches && allCoaches.length > 0) {
      console.log(`Found ${allCoaches.length} coaches before filtering by clinic`);
    }
  }, [isClinicAdmin, user, allCoaches]);
  
  // Apply clinic filtering to ensure clinic admins only see their clinic's coaches
  const coaches = filterByClinic(allCoaches);
  
  // Enhanced logging after filtering
  useEffect(() => {
    if (coaches && coaches.length > 0) {
      console.log(`Displaying ${coaches.length} coaches after clinic filtering`);
      console.log("First coach sample:", coaches[0]);
    }
  }, [coaches]);
  
  const filteredCoaches = coaches.filter(coach => {
    const searchText = filterText.toLowerCase();
    return (
      coach.name.toLowerCase().includes(searchText) ||
      coach.email.toLowerCase().includes(searchText) ||
      (coach.phone && coach.phone.includes(searchText)) ||
      (coach.clinicName && coach.clinicName.toLowerCase().includes(searchText))
    );
  });
  
  const handleAddDialogClose = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) refresh();
  };
  
  const handleEditDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) refresh();
  };
  
  const handleDeleteDialogClose = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) refresh();
  };
  
  const handleResetPasswordDialogClose = (open: boolean) => {
    setIsResetPasswordDialogOpen(open);
  };
  
  const handleEditCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setIsDeleteDialogOpen(true);
  };
  
  const handleResetPassword = (coach: Coach) => {
    setSelectedCoach(coach);
    setIsResetPasswordDialogOpen(true);
  };
  
  const handleManualRefresh = () => {
    refresh();
  };

  // Check if the page is being loaded for a clinic admin directly on the admin/coaches route
  // Prevent system admin routes for clinic admins
  React.useEffect(() => {
    if (isClinicAdmin) {
      console.log('Strict enforcement: Clinic admin accessing coaches page');
    }
  }, [isClinicAdmin]);
  
  const clinicName = user?.clinicId ? 
    (isClinicAdmin ? user.name || 'Your Clinic' : 'All Clinics') : 
    'Unknown Clinic';
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Coaches</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={handleManualRefresh} 
            variant="outline" 
            size="icon"
            disabled={loading}
            className="flex items-center justify-center"
            title="Refresh coaches"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
            <UserPlus size={16} />
            <span>Add Coach</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Coaches</CardTitle>
          <CardDescription>
            {isClinicAdmin 
              ? `Manage coaches for ${user?.name || 'your clinic'}` 
              : "View and manage all coaches across clinics"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CoachesFilter 
            filterText={filterText} 
            setFilterText={setFilterText} 
            count={filteredCoaches.length}
          />
          
          {error ? (
            <CoachesErrorState error={error} onRetry={refresh} />
          ) : loading ? (
            <CoachesLoadingState />
          ) : (
            <CoachesTable 
              coaches={filteredCoaches}
              onEdit={handleEditCoach}
              onDelete={handleDeleteCoach}
              onResetPassword={handleResetPassword}
              isSystemAdmin={!isClinicAdmin}
            />
          )}
        </CardContent>
      </Card>
      
      <AddCoachDialog 
        open={isAddDialogOpen} 
        onOpenChange={handleAddDialogClose} 
        clinicId={userClinicId || undefined}
        clinicName={user?.name || clinicName}
        onCoachAdded={refresh}
      />
      
      {selectedCoach && (
        <>
          <EditCoachDialog 
            coach={selectedCoach} 
            open={isEditDialogOpen} 
            onOpenChange={handleEditDialogClose} 
            clinicName={user?.name || clinicName}
            onCoachUpdated={refresh}
          />
          
          <DeleteCoachDialog 
            coach={selectedCoach} 
            open={isDeleteDialogOpen} 
            onOpenChange={handleDeleteDialogClose} 
            onCoachDeleted={refresh}
          />
          
          <ResetCoachPasswordDialog 
            coach={selectedCoach} 
            open={isResetPasswordDialogOpen} 
            onOpenChange={handleResetPasswordDialogClose} 
            onPasswordReset={refresh}
          />
        </>
      )}
    </div>
  );
};

export default CoachesPage;
