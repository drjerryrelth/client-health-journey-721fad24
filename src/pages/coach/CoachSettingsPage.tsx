
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCoachProfile } from '@/hooks/use-coach-profile';
import { ProfileTabContent } from '@/components/coach/ProfileTabContent';
import { NotificationsTabContent } from '@/components/coach/NotificationsTabContent';
import { PasswordTabContent } from '@/components/coach/PasswordTabContent';

const CoachSettingsPage = () => {
  const { profileData, loading, updateCoachProfile } = useCoachProfile();
  
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
          <ProfileTabContent 
            loading={loading} 
            profileData={profileData} 
            onSubmit={updateCoachProfile} 
          />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationsTabContent profileData={profileData} />
        </TabsContent>
        
        <TabsContent value="password" className="space-y-4">
          <PasswordTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoachSettingsPage;
