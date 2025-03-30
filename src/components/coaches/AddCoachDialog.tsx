
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import CoachService from '@/services/coach-service';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface AddCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicName: string;
  clinicId: string;
  onCoachAdded?: () => void;
}

const coachFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phone: z.string().optional()
});

type CoachFormValues = z.infer<typeof coachFormSchema>;

const AddCoachDialog = ({ open, onOpenChange, clinicName, clinicId, onCoachAdded }: AddCoachDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CoachFormValues>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: ''
    }
  });

  const handleSubmitAddCoach = async (values: CoachFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting coach:', {
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        clinicId: clinicId
      });
      
      const newCoach = await CoachService.addCoach({
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        status: 'active',
        clinicId: clinicId
      });

      if (newCoach) {
        toast.success(`${values.name} has been added to ${clinicName}`);
        
        // Reset form and close dialog
        form.reset();
        onOpenChange(false);
        // Notify parent component to refresh coach list
        if (onCoachAdded) onCoachAdded();
      } else {
        toast.error("Failed to add coach. Please try again.");
      }
    } catch (error) {
      console.error("Error adding coach:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Coach</DialogTitle>
          <DialogDescription>
            Add a new coach to {clinicName}. They will receive an email invitation to set up their account.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitAddCoach)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="name" className="text-right">
                      Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input 
                          id="name" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="email" className="text-right">
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input 
                          id="email" 
                          type="email" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="phone" className="text-right">
                      Phone
                    </FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input 
                          id="phone" 
                          type="tel" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleDialogChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Coach'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoachDialog;
