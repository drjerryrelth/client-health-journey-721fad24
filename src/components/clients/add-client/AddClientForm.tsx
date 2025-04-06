import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useProgramsQuery } from '@/hooks/queries/use-program-queries';
import { useClinicCoachesQuery } from '@/hooks/queries/use-coach-queries';
import { useAuth } from '@/context/auth';
import { useCreateClientMutation } from '@/hooks/queries/use-client-queries';
import ClientFormFields from './ClientFormFields';
import { formSchema, AddClientFormValues } from './AddClientSchema';
import { AddClientFormProps } from './index';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

const AddClientForm: React.FC<AddClientFormProps> = ({ onSuccess, onCancel, clinicId }) => {
  const { user } = useAuth();
  const { mutate: createClient, isPending, error: createError } = useCreateClientMutation();
  const [selectedProgramType, setSelectedProgramType] = useState<string | null>(null);
  
  // Use the passed clinicId or fall back to user's clinicId
  const effectiveClinicId = clinicId || user?.clinicId;
  
  const { data: programs = [], isLoading: isProgramsLoading, error: programsError } = useProgramsQuery(effectiveClinicId);
  const { data: coaches = [], isLoading: isCoachesLoading, error: coachesError } = useClinicCoachesQuery(effectiveClinicId);
  
  console.log("Effective clinic ID:", effectiveClinicId);
  console.log("Current user:", user);
  console.log("Available programs:", programs);
  console.log("Available coaches:", coaches);
  
  const form = useForm<AddClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      programId: '',
      programCategory: '',
      startDate: new Date().toISOString().split('T')[0],
      notes: '',
      coachId: 'none',
      weightDate: new Date().toISOString().split('T')[0],
      goals: [],
    },
  });
  
  const watchedProgramId = form.watch('programId');
  
  useEffect(() => {
    if (watchedProgramId && watchedProgramId !== 'no-program') {
      const selectedProgram = programs.find(p => p.id === watchedProgramId);
      console.log("Selected program:", selectedProgram);
      setSelectedProgramType(selectedProgram?.type || null);
    } else {
      setSelectedProgramType(null);
    }
  }, [watchedProgramId, programs]);

  const onSubmit = (values: AddClientFormValues) => {
    if (!effectiveClinicId) {
      console.error("Missing clinic ID for client creation");
      return;
    }
    
    console.log("Submitting client form with values:", values);
    console.log("Using clinic ID:", effectiveClinicId);
    
    // Process programId to handle the 'no-program' special value
    const programId = values.programId === 'no-program' ? null : values.programId || null;
    // Process coachId to handle the 'none' special value
    const coachId = values.coachId === 'none' ? null : values.coachId;
    
    createClient({
      name: values.name,
      email: values.email,
      phone: values.phone || null,
      programId: programId,
      programCategory: values.programCategory as 'A' | 'B' | 'C' | null || null,
      startDate: values.startDate,
      notes: values.notes || null,
      clinicId: effectiveClinicId,
      coachId: coachId,
      initialWeight: values.initialWeight,
      weightDate: values.weightDate,
      goals: values.goals
    }, {
      onSuccess: (result) => {
        if (result.data && result.tempPassword) {
          onSuccess(values.email, result.tempPassword);
        } else if (result.data) {
          onSuccess(values.email, 'Password sent via email');
        }
      },
      onError: (error) => {
        console.error("Error creating client:", error);
      }
    });
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {createError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error creating client</AlertTitle>
              <AlertDescription>
                {createError instanceof Error ? createError.message : 'An unknown error occurred'}
              </AlertDescription>
            </Alert>
          )}
          
          {!effectiveClinicId && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Missing clinic information</AlertTitle>
              <AlertDescription>
                No clinic ID available. Please try logging out and back in.
              </AlertDescription>
            </Alert>
          )}
          
          {programsError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load programs. {programsError.message}
              </AlertDescription>
            </Alert>
          )}
          
          {coachesError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load coaches. {coachesError.message}
              </AlertDescription>
            </Alert>
          )}
          
          {!isProgramsLoading && programs.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No program templates found for your clinic. You should create programs first from the Programs page.
              </AlertDescription>
            </Alert>
          )}
          
          {!isCoachesLoading && coaches.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No coaches found for your clinic. You should add coaches first from the Coaches page.
              </AlertDescription>
            </Alert>
          )}
          
          {!isProgramsLoading && programs.length > 0 && (
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle>Program Templates Available</AlertTitle>
              <AlertDescription>
                {programs.length} program template{programs.length > 1 ? 's are' : ' is'} available for assignment.
              </AlertDescription>
            </Alert>
          )}
          
          <ClientFormFields 
            programs={programs} 
            coaches={coaches}
            selectedProgramType={selectedProgramType}
            isProgramsLoading={isProgramsLoading}
            isCoachesLoading={isCoachesLoading}
          />

          <DialogFooter className="pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add Client'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </FormProvider>
  );
};

export default AddClientForm;
