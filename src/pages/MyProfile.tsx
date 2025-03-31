
import React, { useState } from 'react';
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

const MyProfile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '555-123-4567',
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    toast({
      title: 'Profile updated',
      description: 'Your profile information has been updated successfully.'
    });
  };
  
  const handlePasswordChange = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Password updated',
      description: 'Your password has been changed successfully.'
    });
    
    // Reset password fields
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: ''
    }));
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
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile}>
                Save Changes
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
                        type="password"
                        placeholder="Enter your current password"
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
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handlePasswordChange} className="mt-2">
                    Update Password
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
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>In-App Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications within the application</p>
                      </div>
                      <Switch 
                        checked={notifications.inApp} 
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, inApp: checked }))}
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
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, checkIns: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>New Messages</Label>
                        <p className="text-sm text-gray-500">Notify me when I receive new messages</p>
                      </div>
                      <Switch 
                        checked={notifications.messages} 
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, messages: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Program Updates</Label>
                        <p className="text-sm text-gray-500">Notify me of updates to my program</p>
                      </div>
                      <Switch 
                        checked={notifications.updates} 
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, updates: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => {
                toast({
                  title: 'Notification settings saved',
                  description: 'Your notification preferences have been updated.'
                });
              }}>
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyProfile;
