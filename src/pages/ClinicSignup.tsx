
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Clinic, Plus, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const clinicSignupSchema = z.object({
  // Clinic Information
  clinicName: z.string().min(1, "Clinic name is required"),
  clinicEmail: z.string().email("Invalid email format").min(1, "Email is required"),
  clinicPhone: z.string().min(1, "Phone number is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  primaryContact: z.string().min(1, "Primary contact is required"),
  
  // Account Information
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type CoachFormData = {
  name: string;
  email: string;
  phone: string;
};

type ClinicSignupFormValues = z.infer<typeof clinicSignupSchema>;

const ClinicSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('clinic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalCoaches, setAdditionalCoaches] = useState<CoachFormData[]>([]);
  const [createAccount, setCreateAccount] = useState(true);

  // Setup form with validation
  const form = useForm<ClinicSignupFormValues>({
    resolver: zodResolver(clinicSignupSchema),
    defaultValues: {
      clinicName: '',
      clinicEmail: '',
      clinicPhone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      primaryContact: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange'
  });

  const addCoach = () => {
    setAdditionalCoaches([...additionalCoaches, { name: '', email: '', phone: '' }]);
  };

  const removeCoach = (index: number) => {
    const updatedCoaches = [...additionalCoaches];
    updatedCoaches.splice(index, 1);
    setAdditionalCoaches(updatedCoaches);
  };

  const updateCoach = (index: number, field: keyof CoachFormData, value: string) => {
    const updatedCoaches = [...additionalCoaches];
    updatedCoaches[index][field] = value;
    setAdditionalCoaches(updatedCoaches);
  };

  const handleSubmit = async (values: ClinicSignupFormValues) => {
    setIsSubmitting(true);
    
    try {
      // 1. Create the clinic
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .insert({
          name: values.clinicName,
          email: values.clinicEmail,
          phone: values.clinicPhone,
          street_address: values.streetAddress,
          city: values.city,
          state: values.state,
          zip: values.zipCode,
          primary_contact: values.primaryContact,
          status: 'active'
        })
        .select('id')
        .single();

      if (clinicError) throw new Error(`Failed to create clinic: ${clinicError.message}`);
      
      // Store the clinic ID for coach creation
      const clinicId = clinicData.id;
      
      let userId = null;
      
      // 2. Create user account if requested
      if (createAccount) {
        const { data: userData, error: signUpError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              full_name: values.primaryContact,
              role: 'coach',
              clinic_id: clinicId
            }
          }
        });

        if (signUpError) throw new Error(`Failed to create account: ${signUpError.message}`);
        userId = userData.user?.id;
        
        // Update profile with clinic ID
        if (userId) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              full_name: values.primaryContact,
              email: values.email,
              role: 'coach',
              clinic_id: clinicId
            });
            
          if (profileError) {
            console.error("Error updating profile:", profileError);
          }
        }
      }
      
      // 3. Create the primary coach (clinic contact)
      const { error: primaryCoachError } = await supabase
        .from('coaches')
        .insert({
          name: values.primaryContact,
          email: values.email || values.clinicEmail, // Use account email if provided, otherwise clinic email
          phone: values.clinicPhone,
          status: 'active',
          clinic_id: clinicId
        });
        
      if (primaryCoachError) throw new Error(`Failed to create primary coach: ${primaryCoachError.message}`);
      
      // 4. Create additional coaches if any
      if (additionalCoaches.length > 0) {
        const coachRecords = additionalCoaches.map(coach => ({
          name: coach.name,
          email: coach.email,
          phone: coach.phone,
          status: 'active',
          clinic_id: clinicId
        }));
        
        const { error: additionalCoachesError } = await supabase
          .from('coaches')
          .insert(coachRecords);
          
        if (additionalCoachesError) {
          console.warn(`Some additional coaches may not have been created: ${additionalCoachesError.message}`);
          toast({
            title: "Warning",
            description: "Some additional coaches may not have been created",
            variant: "destructive"
          });
        }
      }
      
      // Success!
      toast({
        title: "Clinic created successfully",
        description: createAccount
          ? "Your clinic has been created and an account has been set up. Please check your email to confirm your account."
          : "Your clinic has been created. You can now log in with your credentials.",
      });
      
      // Redirect to login or dashboard
      navigate('/login');
      
    } catch (error: any) {
      console.error("Error during signup:", error);
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="mr-2" onClick={() => navigate('/')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to home
          </Button>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center">
              <Clinic className="mr-2 h-6 w-6 text-primary" />
              <CardTitle>Clinic Signup</CardTitle>
            </div>
            <CardDescription>
              Register your clinic and create your account to get started
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="px-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="clinic">Clinic Information</TabsTrigger>
                    <TabsTrigger value="coaches">Coach Setup</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                  </TabsList>
                </div>
                
                <CardContent className="space-y-4 mt-4">
                  <TabsContent value="clinic" className="space-y-4">
                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="clinicName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Clinic Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="clinicEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Clinic Email <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="clinicPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Clinic Phone <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="primaryContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Contact Person <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="streetAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          onClick={() => setActiveTab('coaches')}
                        >
                          Next: Coach Setup
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="coaches" className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h3 className="text-blue-800 font-medium mb-1">About Coach Setup</h3>
                      <p className="text-blue-700 text-sm">
                        The primary contact person will automatically be set up as the first coach for your clinic.
                        You can add additional coaches now or later through your dashboard.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Primary Coach (Clinic Contact)</h3>
                        <div className="bg-gray-50 p-4 border rounded-md">
                          <p className="text-sm">Name: <span className="font-medium">{form.watch('primaryContact')}</span></p>
                          <p className="text-sm">Email: <span className="font-medium">{form.watch('clinicEmail')}</span></p>
                          <p className="text-sm">Phone: <span className="font-medium">{form.watch('clinicPhone')}</span></p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">Additional Coaches (Optional)</h3>
                          <Button type="button" variant="outline" onClick={addCoach} className="flex items-center gap-1">
                            <Plus size={16} />
                            Add Coach
                          </Button>
                        </div>
                        
                        {additionalCoaches.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-6">
                            No additional coaches added yet.
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {additionalCoaches.map((coach, index) => (
                              <div key={index} className="border rounded-md p-4">
                                <div className="flex justify-between mb-2">
                                  <h4 className="font-medium">Coach {index + 1}</h4>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-red-500 h-8 px-2"
                                    onClick={() => removeCoach(index)}
                                  >
                                    <Trash size={16} />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="text-sm font-medium block mb-1">Name</label>
                                    <Input 
                                      value={coach.name}
                                      onChange={(e) => updateCoach(index, 'name', e.target.value)}
                                      placeholder="Full name"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium block mb-1">Email</label>
                                    <Input 
                                      type="email"
                                      value={coach.email}
                                      onChange={(e) => updateCoach(index, 'email', e.target.value)}
                                      placeholder="Email address"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium block mb-1">Phone</label>
                                    <Input 
                                      value={coach.phone}
                                      onChange={(e) => updateCoach(index, 'phone', e.target.value)}
                                      placeholder="Phone number"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setActiveTab('clinic')}>
                          Back
                        </Button>
                        <Button type="button" onClick={() => setActiveTab('account')}>
                          Next: Account Setup
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="account" className="space-y-4">
                    <div className="flex items-center mb-4">
                      <Checkbox 
                        id="create-account" 
                        checked={createAccount} 
                        onCheckedChange={(checked) => setCreateAccount(checked === true)} 
                        className="mr-2"
                      />
                      <label htmlFor="create-account" className="text-sm font-medium">
                        Create an account for clinic management
                      </label>
                    </div>
                    
                    {createAccount && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setActiveTab('coaches')}>
                        Back
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Clinic...' : 'Complete Signup'}
                      </Button>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicSignup;
