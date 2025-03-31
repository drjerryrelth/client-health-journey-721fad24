
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileFormValues, profileSchema } from '@/hooks/use-coach-profile';

interface ProfileTabContentProps {
  loading: boolean;
  profileData: any;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
}

export const ProfileTabContent: React.FC<ProfileTabContentProps> = ({ 
  loading,
  profileData,
  onSubmit
}) => {
  // Initialize profile form with default values
  const profileForm = useForm<ProfileFormValues>({
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

  // Update form values when profile data changes
  React.useEffect(() => {
    if (profileData) {
      profileForm.reset({
        fullName: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        notifyClientCheckIn: true,
        notifyClientMessage: true,
        notifyClientProgress: false,
      });
    }
  }, [profileData, profileForm]);

  return (
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
        ) : !profileData ? (
          <div className="text-center py-8 text-muted-foreground">
            Could not load profile information. Please refresh the page and try again.
          </div>
        ) : (
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
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
                control={profileForm.control}
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
                control={profileForm.control}
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
  );
};
