
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Palette, ImageIcon } from 'lucide-react';
import ColorCustomizationTab from './ColorCustomizationTab';
import LogoCustomizationTab from './LogoCustomizationTab';

interface SelectedClinic {
  id: string;
  name: string;
  logo: string | null;
  primary_color: string | null;
  secondary_color: string | null;
}

interface ClinicCustomizationCardProps {
  selectedClinic: SelectedClinic | null;
  onColorUpdate: (clinicId: string, colorType: 'primary_color' | 'secondary_color', color: string) => void;
  onLogoUpload: (clinicId: string, file: File) => void;
}

const ClinicCustomizationCard = ({
  selectedClinic,
  onColorUpdate,
  onLogoUpload
}: ClinicCustomizationCardProps) => {
  if (!selectedClinic) {
    return (
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
    );
  }

  return (
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
          
          <TabsContent value="colors">
            <ColorCustomizationTab 
              primaryColor={selectedClinic.primary_color} 
              secondaryColor={selectedClinic.secondary_color}
              onColorUpdate={(colorType, color) => 
                onColorUpdate(selectedClinic.id, colorType, color)
              }
            />
          </TabsContent>
          
          <TabsContent value="logo">
            <LogoCustomizationTab 
              logo={selectedClinic.logo} 
              clinicName={selectedClinic.name}
              onLogoUpload={(file) => onLogoUpload(selectedClinic.id, file)}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClinicCustomizationCard;
