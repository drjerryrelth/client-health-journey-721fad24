import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, Shield, BellRing, LogOut } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';

const MyProfile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    currentPassword: '',
    password: '',
    confirmPassword: ''
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    checkIns: true,
    messages: true,
    updates: false
  });

  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (profile) {
          setFormData(prev => ({
            ...prev,
            name: profile.full_name || user.name || '',
            email: profile.email || user.email || '',
            phone: profile.phone || ''
          }));
          
          if (profile.notification_preferences) {
            setNotifications(profile.notification_preferences);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive'
        });
      }
    };
    
    fetchProfile();
  }, [user, toast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordChange = async () => {
    if (!user?.id) return;
    
    if (!formData.currentPassword) {
      toast({
        title: 'Error',
        description: 'Please enter your current password',
        variant: 'destructive'
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match. Please try again.',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: formData.currentPassword
      });
      
      if (signInError) {
        throw new Error('Current password is incorrect');
      }
      
      // If current password is correct, update to new password
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.'
      });
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        password: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    if (!user?.id) return;
    
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ notification_preferences: newNotifications })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Preferences updated',
        description: 'Your notification preferences have been saved.'
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      // Revert the change if it fails
      setNotifications(prev => ({ ...prev, [key]: !value }));
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Update your personal information and preferences</p>
      </div>
      
      <Tabs defaultValue="personal">
        <TabsList className="mb-6">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User size={16} />
            <span>Personal Info</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield size={16} />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellRing size={16} />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center space-y-4 md:w-1/3">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="https://i.pravatar.cc/150" alt={user?.name} />
                    <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <Button variant="outline" className="w-full">
                    Change Photo
                  </Button>
                </div>
                
                <div className="space-y-4 md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter your current password"
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password">New Password</Label>
                      <Input 
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your new password"
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your new password"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handlePasswordChange} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                  
                  <Button 
                    variant="destructive"
                    onClick={() => logout()}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch 
                        checked={notifications.email} 
                        onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>In-App Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications within the application</p>
                      </div>
                      <Switch 
                        checked={notifications.inApp} 
                        onCheckedChange={(checked) => handleNotificationChange('inApp', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Check-In Reminders</Label>
                        <p className="text-sm text-gray-500">Remind me to complete my daily check-in</p>
                      </div>
                      <Switch 
                        checked={notifications.checkIns} 
                        onCheckedChange={(checked) => handleNotificationChange('checkIns', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>New Messages</Label>
                        <p className="text-sm text-gray-500">Notify me when I receive new messages</p>
                      </div>
                      <Switch 
                        checked={notifications.messages} 
                        onCheckedChange={(checked) => handleNotificationChange('messages', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Program Updates</Label>
                        <p className="text-sm text-gray-500">Notify me of updates to my program</p>
                      </div>
                      <Switch 
                        checked={notifications.updates} 
                        onCheckedChange={(checked) => handleNotificationChange('updates', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyProfile;
