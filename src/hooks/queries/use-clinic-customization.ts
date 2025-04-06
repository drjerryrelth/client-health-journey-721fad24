
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import { isSystemAdmin, isClinicAdmin } from '@/utils/role-based-access';

interface Clinic {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface ClinicData {
  id: string;
  name: string;
  logo?: string;
  primary_color?: string;
  secondary_color?: string;
}

export function useClinicCustomization() {
  const { user } = useAuth();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch clinics based on user role
  useEffect(() => {
    const fetchClinics = async () => {
      setIsLoading(true);
      try {
        // Demo data for now - would be replaced with real API calls
        
        if (isSystemAdmin(user)) {
          // System admin sees all clinics
          const allClinics = [
            { id: '1', name: 'Wellness Center', primaryColor: '#4f46e5', secondaryColor: '#10b981' },
            { id: '2', name: 'Practice Naturals', primaryColor: '#0891b2', secondaryColor: '#84cc16' },
            { id: '3', name: 'Health Partners', primaryColor: '#7c3aed', secondaryColor: '#f59e0b' }
          ];
          setClinics(allClinics);
          // Default to first clinic if none selected
          if (!selectedClinicId && allClinics.length > 0) {
            setSelectedClinicId(allClinics[0].id);
            setSelectedClinic(allClinics[0]);
          }
        } 
        else if (isClinicAdmin(user) && user?.clinicId) {
          // Clinic admin only sees their clinic
          const clinicName = user.name?.replace(' User', '') || 'Your Clinic';
          const clinicData = {
            id: user.clinicId,
            name: clinicName,
            primaryColor: '#0891b2',
            secondaryColor: '#84cc16'
          };
          setClinics([clinicData]);
          setSelectedClinicId(user.clinicId);
          setSelectedClinic(clinicData);
        }
        
      } catch (error) {
        console.error('Error fetching clinics:', error);
        toast.error('Failed to load clinics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinics();
  }, [user, selectedClinicId]);

  // Handle clinic selection
  const handleClinicSelect = (clinicId: string) => {
    if (clinicId === selectedClinicId) return;
    
    // Only allow clinic selection for system admins
    if (!isSystemAdmin(user)) {
      toast.error("As a clinic admin, you can only customize your own clinic");
      return;
    }
    
    setSelectedClinicId(clinicId);
    const clinic = clinics.find(c => c.id === clinicId) || null;
    setSelectedClinic(clinic);
  };

  // Handle color update
  const handleColorUpdate = (type: 'primary' | 'secondary', color: string) => {
    if (!selectedClinic) return;
    
    toast.success(`${type === 'primary' ? 'Primary' : 'Secondary'} color updated`);
    
    // Update the selected clinic
    const updatedClinic = {
      ...selectedClinic,
      ...(type === 'primary' ? { primaryColor: color } : { secondaryColor: color })
    };
    
    setSelectedClinic(updatedClinic);
    
    // Update the clinic in the clinics array
    setClinics(prev => 
      prev.map(clinic => 
        clinic.id === selectedClinicId 
          ? updatedClinic 
          : clinic
      )
    );
  };

  // Handle logo upload
  const handleLogoUpload = (logoUrl: string) => {
    if (!selectedClinic) return;
    
    toast.success('Logo uploaded successfully');
    
    // Update the selected clinic
    const updatedClinic = {
      ...selectedClinic,
      logo: logoUrl
    };
    
    setSelectedClinic(updatedClinic);
    
    // Update the clinic in the clinics array
    setClinics(prev => 
      prev.map(clinic => 
        clinic.id === selectedClinicId 
          ? updatedClinic 
          : clinic
      )
    );
  };

  return {
    clinics,
    selectedClinicId,
    selectedClinic,
    isLoading,
    handleClinicSelect,
    handleColorUpdate,
    handleLogoUpload
  };
}
