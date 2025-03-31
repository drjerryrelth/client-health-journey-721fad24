
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  ClinicSelector, 
  ClinicCustomizationCard 
} from '@/components/clinic-customization';

const ClinicCustomizationPage = () => {
  const queryClient = useQueryClient();
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  
  // Fetch clinics data
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
  
  // Mutation for updating clinic theme
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
  
  // Handle clinic selection
  const handleClinicSelect = (clinicId: string) => {
    setSelectedClinicId(clinicId);
  };
  
  // Handle color update
  const handleColorUpdate = (clinicId: string, colorType: 'primary_color' | 'secondary_color', color: string) => {
    updateClinicTheme.mutate({
      clinicId,
      updates: {
        [colorType]: color
      }
    });
  };
  
  // Handle logo upload
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
  
  // Find the selected clinic
  const selectedClinic = clinics?.find(clinic => clinic.id === selectedClinicId);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Clinic Customization</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ClinicSelector 
            clinics={clinics} 
            selectedClinicId={selectedClinicId}
            onSelectClinic={handleClinicSelect}
            isLoading={isLoading}
          />
        </div>
        
        <div className="lg:col-span-2">
          <ClinicCustomizationCard 
            selectedClinic={selectedClinic || null}
            onColorUpdate={handleColorUpdate}
            onLogoUpload={handleLogoUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default ClinicCustomizationPage;
