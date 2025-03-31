
import React from 'react';
import { 
  ClinicSelector, 
  ClinicCustomizationCard 
} from '@/components/clinic-customization';
import { useClinicCustomization } from '@/hooks/queries/use-clinic-customization';

const ClinicCustomizationPage = () => {
  const {
    clinics,
    selectedClinicId,
    selectedClinic,
    isLoading,
    handleClinicSelect,
    handleColorUpdate,
    handleLogoUpload
  } = useClinicCustomization();
  
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
            selectedClinic={selectedClinic}
            onColorUpdate={handleColorUpdate}
            onLogoUpload={handleLogoUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default ClinicCustomizationPage;
