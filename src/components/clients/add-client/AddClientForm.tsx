
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useProgramsQuery } from '@/hooks/queries/use-program-queries';
import { useAuth } from '@/context/auth';
import { useCreateClientMutation } from '@/hooks/queries/use-client-queries';
import ClientFormFields from './ClientFormFields';
import { formSchema, AddClientFormValues } from './AddClientSchema';
import { AddClientFormProps } from './index';

const AddClientForm: React.FC<AddClientFormProps> = ({ onSuccess, onCancel, clinicId }) => {
  const { user } = useAuth();
  const { mutate: createClient, isPending } = useCreateClientMutation();
  const [selectedProgramType, setSelectedProgramType] = useState<string | null>(null);
  
  // Use the passed clinicId or fall back to user's clinicId
  const effectiveClinicId = clinicId || user?.clinicId;
  
  const { data: programs = [] } = useProgramsQuery(effectiveClinicId);
  
  console.log("Available programs:", programs);
  
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
    if (!effectiveClinicId) return;
    
    console.log("Submitting client form with values:", values);
    
    // Process programId to handle the 'no-program' special value
    const programId = values.programId === 'no-program' ? null : values.programId || null;
    
    createClient({
      name: values.name,
      email: values.email,
      phone: values.phone || null,
      programId: programId,
      programCategory: values.programCategory as 'A' | 'B' | 'C' | null || null,
      startDate: values.startDate,
      notes: values.notes || null,
      clinicId: effectiveClinicId,
      coachId: user?.role === 'coach' ? user.id : null,
      initialWeight: values.initialWeight,
      weightDate: values.weightDate,
      goals: values.goals
    }, {
      onSuccess: (result) => {
        if (result.tempPassword) {
          onSuccess(values.email, result.tempPassword);
        }
      },
    });
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ClientFormFields 
            programs={programs} 
            selectedProgramType={selectedProgramType} 
          />

          <DialogFooter>
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
