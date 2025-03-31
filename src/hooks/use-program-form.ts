
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCreateProgramMutation } from '@/hooks/queries';
import { useToast } from '@/hooks/use-toast';

export const useProgramForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const createProgramMutation = useCreateProgramMutation();
  
  const [showAddProgramDialog, setShowAddProgramDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddProgram = () => {
    setShowAddProgramDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAddProgramDialog(false);
  };

  const handleSubmitProgram = async (formData: {
    name: string;
    type: 'practice_naturals' | 'chirothin' | 'nutrition' | 'fitness' | 'keto' | 'custom';
    duration: string;
    checkInFrequency: 'daily' | 'weekly';
    description: string;
  }) => {
    if (!formData.name || !formData.type || !formData.duration || !formData.checkInFrequency) {
      toast({
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert duration string to number of days
      let durationInDays = 0;
      if (formData.duration === '4-weeks') durationInDays = 28;
      if (formData.duration === '6-weeks') durationInDays = 42;
      if (formData.duration === '8-weeks') durationInDays = 56;
      if (formData.duration === '12-weeks') durationInDays = 84;
      if (formData.duration === '16-weeks') durationInDays = 112;
      if (formData.duration === '24-weeks') durationInDays = 168;
      if (formData.duration === '30-days') durationInDays = 30;
      if (formData.duration === '60-days') durationInDays = 60;
      
      await createProgramMutation.mutateAsync({
        program: {
          name: formData.name || `${formData.type.replace('_', ' ')} Program`,
          description: formData.description || `${formData.name} program`,
          type: formData.type,
          duration: durationInDays,
          checkInFrequency: formData.checkInFrequency,
          clinicId: user?.clinicId || ''
        },
        supplements: [] // No supplements for now, will add later
      });

      toast({
        description: `${formData.name} program has been created successfully.`
      });

      // Close dialog
      setShowAddProgramDialog(false);
    } catch (error) {
      console.error("Error creating program:", error);
      toast({
        description: "Failed to create program. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showAddProgramDialog,
    isSubmitting,
    handleAddProgram,
    handleCloseDialog,
    handleSubmitProgram
  };
};
