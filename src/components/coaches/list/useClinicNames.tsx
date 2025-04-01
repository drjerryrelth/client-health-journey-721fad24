
import { useState, useEffect } from 'react';
import ClinicService from '@/services/clinic-service';
import { Clinic } from '@/services/clinic-service';

export const useClinicNames = () => {
  const [clinics, setClinics] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const allClinics = await ClinicService.getClinics();
        const clinicMap: Record<string, string> = {};
        allClinics.forEach((clinic: Clinic) => {
          clinicMap[clinic.id] = clinic.name;
        });
        setClinics(clinicMap);
      } catch (error) {
        console.error('Error fetching clinics:', error);
      }
    };

    fetchClinics();
  }, []);

  const getClinicName = (clinicId: string) => {
    return clinics[clinicId] || `Clinic ${clinicId ? clinicId.slice(-4) : ''}`;
  };

  return { clinics, getClinicName };
};
