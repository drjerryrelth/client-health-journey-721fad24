
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CoachService } from '@/services/coaches';
import { checkAuthentication } from '@/services/clinics/auth-helper';
import { useAuth } from '@/context/auth';
import { CoachForm } from '@/components/coaches/CoachForm';
import ErrorDialog from '@/components/coaches/ErrorDialog';
import { CoachFormValues } from '@/components/coaches/schema/coach-form-schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useClinicQuery } from '@/hooks/use-clinics';
import { Loader2 } from 'lucide-react';

interface AddCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicId?: string;
  clinicName?: string;
  onCoachAdded?: () => void;
}

export const AddCoachDialog = ({ 
  open, 
  onOpenChange,
  clinicId,
  clinicName = 'your clinic',
  onCoachAdded 
}: AddCoachDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState<string | undefined>(clinicId);
  const [selectedClinicName, setSelectedClinicName] = useState<string>(clinicName);
  const { user } = useAuth();
  const isSystemAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  
  // Fetch clinics if user is a system admin
  const { data: clinics, isLoading: clinicsLoading } = useClinicQuery();
  
  // Use the clinic ID from props or user context if not a system admin
  const effectiveClinicId = selectedClinicId || user?.clinicId;
  
  // Reset the selected clinic when the dialog opens/closes or clinicId prop changes
  useEffect(() => {
    if (open) {
      setSelectedClinicId(clinicId);
      setSelectedClinicName(clinicName);
    }
  }, [open, clinicId, clinicName]);
  
  // Update clinic name when selected clinic changes
  useEffect(() => {
    if (isSystemAdmin && selectedClinicId && clinics) {
      const clinic = clinics.find(c => c.id === selectedClinicId);
      if (clinic) {
        setSelectedClinicName(clinic.name);
      }
    }
  }, [selectedClinicId, clinics, isSystemAdmin]);
  
  useEffect(() => {
    if (open) {
      const verifyAuth = async () => {
        const session = await checkAuthentication();
        if (!session) {
          toast.error("You must be logged in to add a coach");
          onOpenChange(false);
        }
      };
      
      verifyAuth();
    }
  }, [open, onOpenChange]);

  const handleSubmitAddCoach = async (values: CoachFormValues) => {
    if (!effectiveClinicId) {
      toast.error("No clinic selected. Unable to add coach.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorDetails(null);
      setShowErrorDialog(false);
      
      console.log('[AddCoachDialog] Submitting coach data:', {
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        clinicId: effectiveClinicId
      });
      
      console.log('[AddCoachDialog] Current auth context user:', user);
      
      const session = await checkAuthentication();
      if (!session) {
        setErrorDetails("Authentication verification failed. Please try logging in again.");
        setShowErrorDialog(true);
        toast.error("Authentication required to add a coach.");
        return;
      }
      
      console.log('[AddCoachDialog] Session verified before submission:', session.user.id);
      
      // Try adding the coach with a timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Coach addition timed out')), 15000);
      });
      
      // Create the coach addition promise
      const addCoachPromise = CoachService.addCoach({
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        status: 'active',
        clinicId: effectiveClinicId
      });
      
      // Race between the actual operation and the timeout
      const newCoach = await Promise.race([
        addCoachPromise,
        timeoutPromise
      ]);

      if (newCoach) {
        toast.success(`${values.name} has been added to ${selectedClinicName}`);
        onOpenChange(false);
        if (onCoachAdded) onCoachAdded();
      } else {
        throw new Error("Coach addition failed - service returned null");
      }
    } catch (error) {
      console.error("[AddCoachDialog] Error adding coach:", error);
      
      if (error instanceof Error) {
        setErrorDetails(error.message);
      } else {
        setErrorDetails(String(error));
      }
      
      setShowErrorDialog(true);
      toast.error("Failed to add coach. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open && isSubmitting) {
      // Prevent closing while submitting
      return;
    }
    
    if (!open) {
      // Reset error state when closing
      setErrorDetails(null);
      setShowErrorDialog(false);
    }
    
    onOpenChange(open);
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    handleDialogChange(false);
  };
  
  const handleClinicChange = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    if (clinics) {
      const clinic = clinics.find(c => c.id === clinicId);
      if (clinic) {
        setSelectedClinicName(clinic.name);
      }
    }
  };
  
  const handleErrorDialogClose = (open: boolean) => {
    setShowErrorDialog(open);
    // Don't close the main dialog when error dialog closes
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Coach</DialogTitle>
            <DialogDescription>
              Add a new coach to {selectedClinicName}. They will receive an email invitation to set up their account.
            </DialogDescription>
          </DialogHeader>
          
          {/* Add clinic selector for system admins */}
          {isSystemAdmin && (
            <div className="mb-4">
              <FormItem>
                <FormLabel>Select Clinic</FormLabel>
                <Select 
                  value={selectedClinicId} 
                  onValueChange={handleClinicChange}
                  disabled={clinicsLoading || isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a clinic" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clinicsLoading ? (
                      <SelectItem value="loading" disabled>
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading clinics...
                        </span>
                      </SelectItem>
                    ) : clinics && clinics.length > 0 ? (
                      clinics.map((clinic) => (
                        <SelectItem key={clinic.id} value={clinic.id}>
                          {clinic.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No clinics available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the clinic this coach will be assigned to
                </FormDescription>
                {!selectedClinicId && <FormMessage>Please select a clinic</FormMessage>}
              </FormItem>
            </div>
          )}
          
          <CoachForm 
            onSubmit={handleSubmitAddCoach}
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>

      <ErrorDialog 
        open={showErrorDialog}
        onOpenChange={handleErrorDialogClose}
        errorDetails={errorDetails}
        title="Error Adding Coach"
      />
    </>
  );
};
