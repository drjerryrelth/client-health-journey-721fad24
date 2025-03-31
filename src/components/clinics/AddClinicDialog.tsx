
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ClinicService from '@/services/clinic-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface AddClinicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClinicAdded?: () => void;
}

// Update schema: General info required, billing info optional
const addClinicSchema = z.object({
  // General info - all required
  clinicName: z.string().min(1, "Clinic name is required"),
  clinicEmail: z.string().email("Invalid email format").min(1, "Email is required"),
  clinicPhone: z.string().min(1, "Phone number is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  primaryContact: z.string().min(1, "Primary contact is required"),
  
  // Billing info - all optional
  billingContactName: z.string().optional(),
  billingEmail: z.string().optional(), // Changed from email validation to optional string
  billingPhone: z.string().optional(),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZip: z.string().optional(),
  paymentMethod: z.string().optional(),
  subscriptionTier: z.string().optional(),
});

type AddClinicFormValues = z.infer<typeof addClinicSchema>;

const AddClinicDialog = ({ open, onOpenChange, onClinicAdded }: AddClinicDialogProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Setup form with validation
  const form = useForm<AddClinicFormValues>({
    resolver: zodResolver(addClinicSchema),
    defaultValues: {
      clinicName: '',
      clinicEmail: '',
      clinicPhone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      primaryContact: '',
      billingContactName: '',
      billingEmail: '',
      billingPhone: '',
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingZip: '',
      paymentMethod: '',
      subscriptionTier: '',
    }
  });

  const handleSubmitClinic = async (values: AddClinicFormValues) => {
    try {
      setIsSubmitting(true);
      
      console.log("Form values before submission:", values);
      
      // Create a clean object without undefined values that might cause issues
      const clinicData = {
        name: values.clinicName,
        email: values.clinicEmail || null,
        phone: values.clinicPhone || null,
        streetAddress: values.streetAddress || null,
        city: values.city || null,
        state: values.state || null,
        zip: values.zipCode || null,
        primaryContact: values.primaryContact || null,
        billingContactName: values.billingContactName || null,
        billingEmail: values.billingEmail || null,
        billingPhone: values.billingPhone || null,
        billingAddress: values.billingAddress || null,
        billingCity: values.billingCity || null,
        billingState: values.billingState || null,
        billingZip: values.billingZip || null,
        paymentMethod: values.paymentMethod || null,
        subscriptionTier: values.subscriptionTier || null,
        subscriptionStatus: 'active' // Set default status to active
      };
      
      console.log('Submitting clinic data:', clinicData);
      
      const { data: newClinic, error } = await ClinicService.createClinic(clinicData);

      if (error) {
        console.error("Error creating clinic:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to add clinic. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (newClinic) {
        toast({
          title: "Clinic Added",
          description: `${values.clinicName} has been added successfully.`
        });
        
        // Reset form and close dialog
        form.reset();
        onOpenChange(false);
        
        // Notify parent component to refresh clinic list
        if (onClinicAdded) onClinicAdded();
      } else {
        toast({
          title: "Error",
          description: "Failed to add clinic. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error adding clinic:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) form.reset();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Clinic</DialogTitle>
          <DialogDescription>
            Add a new clinic to your organization. You'll be able to manage its coaches and programs later.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitClinic)}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General Info</TabsTrigger>
                <TabsTrigger value="billing">Billing Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="clinicName"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Name <span className="text-red-500">*</span></FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="primaryContact"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Primary Contact <span className="text-red-500">*</span></FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} placeholder="Main contact person's name" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Street Address <span className="text-red-500">*</span></FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">City <span className="text-red-500">*</span></FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">State <span className="text-red-500">*</span></FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">ZIP Code <span className="text-red-500">*</span></FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="clinicEmail"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Email <span className="text-red-500">*</span></FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="clinicPhone"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Phone <span className="text-red-500">*</span></FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} type="tel" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="billing" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="billingContactName"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Billing Contact</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billingEmail"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Billing Email</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billingPhone"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Billing Phone</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} type="tel" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billingAddress"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Billing Address</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billingCity"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Billing City</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billingState"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Billing State</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billingZip"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Billing ZIP</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Payment Method</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-10"
                            >
                              <option value="">Select Payment Method</option>
                              <option value="Credit Card">Credit Card</option>
                              <option value="Bank Transfer">Bank Transfer</option>
                              <option value="PayPal">PayPal</option>
                              <option value="Check">Check</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subscriptionTier"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Subscription Tier</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-10"
                            >
                              <option value="">Select Subscription</option>
                              <option value="Basic">Basic</option>
                              <option value="Standard">Standard</option>
                              <option value="Premium">Premium</option>
                              <option value="Enterprise">Enterprise</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Clinic'}
                </Button>
              </DialogFooter>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClinicDialog;
