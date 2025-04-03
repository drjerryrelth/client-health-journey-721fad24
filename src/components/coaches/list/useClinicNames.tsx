
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useClinicNames() {
  const [clinics, setClinics] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClinics() {
      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('id, name');
          
        if (error) {
          console.error('Error fetching clinics:', error);
          return;
        }
        
        // Create a mapping of clinic IDs to names
        const clinicMap: Record<string, string> = {};
        if (data) {
          data.forEach(clinic => {
            clinicMap[clinic.id] = clinic.name;
          });
        }
        
        setClinics(clinicMap);
      } catch (error) {
        console.error('Error in useClinicNames hook:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchClinics();
  }, []);
  
  // Function to get a clinic name from an ID
  const getClinicName = (clinicId: string): string => {
    if (!clinicId) return 'Unknown Clinic';
    return clinics[clinicId] || `Unknown Clinic (${clinicId.slice(-4)})`;
  };
  
  return { clinics, loading, getClinicName };
}
