
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clinic } from '@/services/clinic-service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Building, ImageIcon, Palette } from 'lucide-react';
import { toast } from 'sonner';

const ClinicCustomizationPage = () => {
  const { toast: uiToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  
  const { data: clinics, isLoading } = useQuery({
    queryKey: ['clinics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinics')
        .select('id, name, logo, primary_color, secondary_color');
      
      if (error) throw error;
      return data;
    }
  });
  
  const updateClinicTheme = useMutation({
    mutationFn: async ({ 
      clinicId, 
      updates 
    }: { 
      clinicId: string, 
      updates: { primary_color?: string, secondary_color?: string, logo?: string } 
    }) => {
      const { data, error } = await supabase
        .from('clinics')
        .update(updates)
        .eq('id', clinicId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      toast.success('Clinic theme updated successfully');
    },
    onError: (error) => {
      console.error('Error updating clinic theme:', error);
      toast.error('Failed to update clinic theme');
    }
  });
  
  const handleClinicSelect = (clinicId: string) => {
    setSelectedClinicId(clinicId);
  };
  
  const handleColorUpdate = (clinicId: string, colorType: 'primary_color' | 'secondary_color', color: string) => {
    updateClinicTheme.mutate({
      clinicId,
      updates: {
        [colorType]: color
      }
    });
  };
  
  const handleLogoUpload = async (clinicId: string, file: File) => {
    try {
      // In a real implementation, you would upload the logo to storage
      // and then update the clinic record with the logo URL
      toast.info('Logo upload functionality would be implemented with Supabase Storage');
      
      // Mock implementation for now
      const mockLogoUrl = `https://example.com/logos/${file.name}`;
      
      updateClinicTheme.mutate({
        clinicId,
        updates: {
          logo: mockLogoUrl
        }
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  const selectedClinic = clinics?.find(clinic => clinic.id === selectedClinicId);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Clinic Customization</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Select Clinic</CardTitle>
              <CardDescription>Choose a clinic to customize its appearance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {clinics?.map(clinic => (
                  <div
                    key={clinic.id}
                    className={`p-3 rounded-md cursor-pointer flex items-center ${
                      selectedClinicId === clinic.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleClinicSelect(clinic.id)}
                  >
                    <Building className="mr-2 h-5 w-5 text-gray-500" />
                    <span>{clinic.name}</span>
                  </div>
                ))}
                
                {(!clinics || clinics.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No clinics available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedClinic ? (
            <Card>
              <CardHeader>
                <CardTitle>Customize {selectedClinic.name}</CardTitle>
                <CardDescription>Modify the appearance of this clinic's portal</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="colors">
                  <TabsList className="mb-4">
                    <TabsTrigger value="colors">
                      <Palette className="h-4 w-4 mr-2" />
                      Colors
                    </TabsTrigger>
                    <TabsTrigger value="logo">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Logo
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="colors" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex items-center gap-4 mt-1.5">
                          <div 
                            className="w-8 h-8 rounded-md border"
                            style={{ backgroundColor: selectedClinic.primary_color || '#1eaedb' }}
                          />
                          <Input 
                            id="primaryColor"
                            type="text" 
                            value={selectedClinic.primary_color || '#1eaedb'} 
                            onChange={(e) => handleColorUpdate(selectedClinic.id, 'primary_color', e.target.value)}
                            placeholder="#1eaedb"
                          />
                          <Input 
                            type="color" 
                            value={selectedClinic.primary_color || '#1eaedb'}
                            onChange={(e) => handleColorUpdate(selectedClinic.id, 'primary_color', e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex items-center gap-4 mt-1.5">
                          <div 
                            className="w-8 h-8 rounded-md border"
                            style={{ backgroundColor: selectedClinic.secondary_color || '#22bc6c' }}
                          />
                          <Input 
                            id="secondaryColor"
                            type="text" 
                            value={selectedClinic.secondary_color || '#22bc6c'} 
                            onChange={(e) => handleColorUpdate(selectedClinic.id, 'secondary_color', e.target.value)}
                            placeholder="#22bc6c"
                          />
                          <Input 
                            type="color" 
                            value={selectedClinic.secondary_color || '#22bc6c'}
                            onChange={(e) => handleColorUpdate(selectedClinic.id, 'secondary_color', e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <h3 className="font-medium mb-3">Preview</h3>
                        <div className="border rounded-md p-6 space-y-4">
                          <div className="flex gap-4">
                            <Button style={{ backgroundColor: selectedClinic.primary_color || '#1eaedb' }}>
                              Primary Button
                            </Button>
                            <Button 
                              variant="outline" 
                              style={{ 
                                borderColor: selectedClinic.primary_color || '#1eaedb',
                                color: selectedClinic.primary_color || '#1eaedb'
                              }}
                            >
                              Outline Button
                            </Button>
                          </div>
                          <div className="flex gap-4">
                            <Button style={{ backgroundColor: selectedClinic.secondary_color || '#22bc6c' }}>
                              Secondary Button
                            </Button>
                            <Button 
                              variant="outline" 
                              style={{ 
                                borderColor: selectedClinic.secondary_color || '#22bc6c',
                                color: selectedClinic.secondary_color || '#22bc6c'
                              }}
                            >
                              Outline Button
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="logo" className="space-y-6">
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {selectedClinic.logo ? (
                          <div className="flex flex-col items-center">
                            <div className="w-48 h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                              <img 
                                src={selectedClinic.logo} 
                                alt={`${selectedClinic.name} logo`} 
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    handleLogoUpload(selectedClinic.id, file);
                                  }
                                };
                                input.click();
                              }}
                            >
                              Replace Logo
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="w-48 h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                              <ImageIcon className="h-16 w-16 text-gray-400" />
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    handleLogoUpload(selectedClinic.id, file);
                                  }
                                };
                                input.click();
                              }}
                            >
                              Upload Logo
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">
                              Recommended size: 200x200px, PNG or SVG preferred
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> Logo upload is shown as a mock UI in this demo. 
                          In a production environment, you would implement Supabase Storage for actual file uploads.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Building className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">Select a Clinic</h3>
                  <p className="text-gray-500">
                    Choose a clinic from the list to customize its appearance
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicCustomizationPage;
