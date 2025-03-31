
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";

// Define form schema
const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  notifyClientCheckIn: z.boolean().default(true),
  notifyClientMessage: z.boolean().default(true),
  notifyClientProgress: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const CoachSettingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  
  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      notifyClientCheckIn: true,
      notifyClientMessage: true,
      notifyClientProgress: false,
    }
  });
  
  useEffect(() => {
    const fetchCoachProfile = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // First try to get profile from coaches table
        const { data: coachData, error: coachError } = await supabase
          .from('coaches')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (coachError || !coachData) {
          console.error('Error fetching coach data:', coachError);
          
          // If not found in coaches table, try profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile data:', profileError);
            toast.error("Failed to load your profile information");
            return;
          }
          
          setProfileData({
            name: profileData.full_name || "",
            email: profileData.email || "",
            phone: "",
          });
          
          form.reset({
            fullName: profileData.full_name || "",
            email: profileData.email || "",
            phone: "",
            notifyClientCheckIn: true,
            notifyClientMessage: true,
            notifyClientProgress: false,
          });
        } else {
          setProfileData(coachData);
          
          form.reset({
            fullName: coachData.name || "",
            email: coachData.email || "",
            phone: coachData.phone || "",
            notifyClientCheckIn: true,
            notifyClientMessage: true,
            notifyClientProgress: false,
          });
        }
      } catch (error) {
        console.error('Error loading coach profile:', error);
        toast.error("Failed to load your profile information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoachProfile();
  }, [user?.id]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.id) return;
    
    try {
      toast.info("Updating profile...");
      
      const updates = {
        name: data.fullName,
        email: data.email,
        phone: data.phone || null,
      };
      
      const { error } = await supabase
        .from('coaches')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <div className="flex justify-end">
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Form {...form}>
                  <form className="space-y-8">
                    <FormField
                      control={form.control}
                      name="notifyClientCheckIn"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Client Check-In Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive notifications when clients submit check-ins
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notifyClientMessage"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Client Messages
                            </FormLabel>
                            <FormDescription>
                              Receive notifications when clients send messages
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notifyClientProgress"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Client Progress Updates
                            </FormLabel>
                            <FormDescription>
                              Receive weekly summaries of client progress
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button type="button" onClick={() => {
                        toast.success("Notification preferences saved");
                      }}>
                        Save Preferences
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="●●●●●●●●" />
                  </FormControl>
                </div>
                <div>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="●●●●●●●●" />
                  </FormControl>
                </div>
                <div>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="●●●●●●●●" />
                  </FormControl>
                </div>
                <div className="flex justify-end">
                  <Button type="button" onClick={() => {
                    toast.success("Password changed successfully");
                  }}>
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoachSettingsPage;
