
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProgramsQuery } from '@/hooks/queries';
import { Program } from '@/types';
import ProgramTable from '@/components/programs/ProgramTable';
import AddProgramDialog from '@/components/programs/AddProgramDialog';
import ProgramDetailsDialog from '@/components/programs/ProgramDetailsDialog';
import { useProgramForm } from '@/hooks/use-program-form';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const ProgramsPage = () => {
  const { user } = useAuth();
  const [clinicId, setClinicId] = useState<string | undefined>(user?.clinicId);
  const [selectedClinicId, setSelectedClinicId] = useState<string | undefined>(clinicId);
  const [availableClinics, setAvailableClinics] = useState<{ id: string, name: string }[]>([]);
  
  // Fetch available clinics for admin users without a default clinic
  useEffect(() => {
    const fetchClinics = async () => {
      if (user?.role === 'admin' || user?.role === 'super_admin') {
        try {
          // This is a placeholder. In a real app, you would fetch clinics from your API
          // For demo purposes, we'll add some sample clinics
          setAvailableClinics([
            { id: 'e8b1711b-1759-4e05-b19a-b0c200e7a65c', name: 'Genesis Red Light' },
            { id: 'c7c3abab-53ec-4ef7-b691-71c726b8937f', name: "Flo's WL Clinic" },
            { id: 'a74110b5-108f-4286-8e29-459039e228a9', name: 'Test Clinic 1' },
            { id: '9b8ae203-1fc4-4847-b74b-9c1aafe6d74f', name: 'TestClinic4' }
          ]);
          
          // If no clinic is selected yet, select the first one
          if (!selectedClinicId && availableClinics.length > 0) {
            setSelectedClinicId(availableClinics[0].id);
            setClinicId(availableClinics[0].id);
          }
        } catch (error) {
          console.error('Error fetching clinics:', error);
          toast('Failed to load clinics');
        }
      }
    };
    
    fetchClinics();
  }, [user, selectedClinicId]);

  const handleClinicChange = (newClinicId: string) => {
    setSelectedClinicId(newClinicId);
    setClinicId(newClinicId);
  };
  
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
        
        {(!user?.clinicId && availableClinics.length > 0) && (
          <div className="flex items-center gap-2 flex-grow max-w-xs">
            <Label htmlFor="clinic-select" className="mr-2">Clinic:</Label>
            <Select value={selectedClinicId} onValueChange={handleClinicChange}>
              <SelectTrigger id="clinic-select" className="w-full">
                <SelectValue placeholder="Select a clinic" />
              </SelectTrigger>
              <SelectContent>
                {availableClinics.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <Button onClick={handleAddProgram} className="flex items-center gap-2" disabled={!clinicId}>
          <PlusCircle size={18} />
          <span>Add Program</span>
        </Button>
      </div>
      
      {!clinicId && !isLoading && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">No clinic selected</h3>
            <p className="text-amber-700 text-sm">Please select a clinic to view or create programs.</p>
          </div>
        </div>
      )}
      
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
          ) : clinicId ? (
            <div className="text-center py-8 text-gray-500">
              No programs found. Click "Add Program" to create one.
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a clinic to view programs.
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
