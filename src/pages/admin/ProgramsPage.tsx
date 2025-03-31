
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProgramsQuery } from '@/hooks/queries';
import { Program } from '@/types';
import ProgramTable from '@/components/programs/ProgramTable';
import AddProgramDialog from '@/components/programs/AddProgramDialog';
import ProgramDetailsDialog from '@/components/programs/ProgramDetailsDialog';
import { useProgramForm } from '@/hooks/use-program-form';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const ProgramsPage = () => {
  const { user } = useAuth();
  const [clinicId, setClinicId] = useState<string | undefined>(undefined);
  
  // Set clinic ID when user data is available
  useEffect(() => {
    if (user?.clinicId) {
      setClinicId(user.clinicId);
      console.log("Setting clinic ID:", user.clinicId);
    } else {
      console.log("No clinic ID available from user:", user);
    }
  }, [user]);
  
  // Only fetch programs when we have a valid clinicId
  const { data: programs, isLoading, isError, error } = useProgramsQuery(clinicId);
  
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showProgramDetails, setShowProgramDetails] = useState(false);

  const { 
    showAddProgramDialog, 
    isSubmitting, 
    handleAddProgram, 
    handleCloseDialog, 
    handleSubmitProgram 
  } = useProgramForm();

  const handleViewProgramDetails = (program: Program) => {
    setSelectedProgram(program);
    setShowProgramDetails(true);
  };

  // Display error toast if there's an error fetching programs
  useEffect(() => {
    if (isError) {
      console.error("Error fetching programs:", error);
      toast("Failed to load programs. Please try again.");
    }
  }, [isError, error]);

  // Add debugging logging to help identify issues
  useEffect(() => {
    if (programs) {
      console.log("Programs loaded successfully:", programs);
    }
  }, [programs]);

  console.log("Current programs:", programs); // Keep this log to debug
  console.log("Current user:", user); // Add user info log for debugging
  console.log("Loading state:", isLoading);
  console.log("Error state:", isError);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
        <Button onClick={handleAddProgram} className="flex items-center gap-2">
          <PlusCircle size={18} />
          <span>Add Program</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Programs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !clinicId ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load programs. Please try again.
            </div>
          ) : programs && programs.length > 0 ? (
            <ProgramTable
              programs={programs}
              isLoading={false}
              isError={false}
              onSelectProgram={handleViewProgramDetails}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No programs found. Click "Add Program" to create one.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Program Dialog */}
      <AddProgramDialog 
        isOpen={showAddProgramDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitProgram}
        isSubmitting={isSubmitting}
      />

      {/* Program Details Dialog */}
      <ProgramDetailsDialog 
        program={selectedProgram}
        isOpen={showProgramDetails}
        onClose={() => setShowProgramDetails(false)}
      />
    </div>
  );
};

export default ProgramsPage;
