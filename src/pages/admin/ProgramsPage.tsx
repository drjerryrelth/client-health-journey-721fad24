
import React, { useState } from 'react';
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

const ProgramsPage = () => {
  const { user } = useAuth();
  const { data: programs, isLoading, isError } = useProgramsQuery(user?.clinicId);
  
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
          <ProgramTable
            programs={programs || []}
            isLoading={isLoading}
            isError={isError}
            onSelectProgram={handleViewProgramDetails}
          />
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
