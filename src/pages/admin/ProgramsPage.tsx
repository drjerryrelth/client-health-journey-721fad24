
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
  console.log("Current user in ProgramsPage:", user);
  
  // Use user's clinicId if available, otherwise fetch all programs
  const { 
    data: programs, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useProgramsQuery(user?.clinicId);
  
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showProgramDetails, setShowProgramDetails] = useState(false);

  const { 
    showAddProgramDialog, 
    isSubmitting, 
    handleAddProgram, 
    handleCloseDialog, 
    handleSubmitProgram 
  } = useProgramForm();

  // Refetch programs when user or clinicId changes
  useEffect(() => {
    console.log("User change detected in ProgramsPage:", user);
    if (user) {
      console.log("Refetching programs with clinicId:", user.clinicId);
      refetch();
    }
  }, [user, refetch]);

  const handleViewProgramDetails = (program: Program) => {
    console.log("Selected program for details:", program);
    setSelectedProgram(program);
    setShowProgramDetails(true);
  };

  // Display error toast if there's an error fetching programs
  useEffect(() => {
    if (isError && error) {
      console.error("Error fetching programs:", error);
      toast.error("Failed to load programs. Please try again.");
    }
  }, [isError, error]);

  // Add detailed debugging logging
  useEffect(() => {
    console.log("Programs data in ProgramsPage:", programs);
    if (programs && programs.length > 0) {
      console.log(`Found ${programs.length} programs`);
      programs.forEach((program, index) => {
        console.log(`Program ${index + 1}:`, program.name, "Client count:", program.clientCount || 0);
      });
    } else {
      console.log("No programs data available in ProgramsPage or empty array");
    }
  }, [programs]);

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
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
          {isLoading ? (
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
