
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ProfileFormValues, profileSchema } from '@/hooks/use-coach-profile';

interface NotificationsTabContentProps {
  profileData: any;
}

export const NotificationsTabContent: React.FC<NotificationsTabContentProps> = ({ profileData }) => {
  // Initialize notification form with default values
  const notificationForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profileData?.name || "",
      email: profileData?.email || "",
      phone: profileData?.phone || "",
      notifyClientCheckIn: true,
      notifyClientMessage: true,
      notifyClientProgress: false,
    }
  });

  // Update form values when profile data changes
  React.useEffect(() => {
    if (profileData) {
      notificationForm.reset({
        fullName: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        notifyClientCheckIn: true,
        notifyClientMessage: true,
        notifyClientProgress: false,
      });
    }
  }, [profileData, notificationForm]);

  const handleSaveNotifications = () => {
    // This would typically save to the database
    toast.success("Notification preferences saved");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Configure how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Form {...notificationForm}>
            <form className="space-y-8">
              <FormField
                control={notificationForm.control}
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
                control={notificationForm.control}
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
                control={notificationForm.control}
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
                <Button type="button" onClick={handleSaveNotifications}>
                  Save Preferences
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};
