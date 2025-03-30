
import { Clinic } from './clinics/types';
import { getClinics, getClinic } from './clinics/fetch-service';
import { addClinic, updateClinic, deleteClinic } from './clinics/mutation-service';
import { getMockClinics } from './clinics/mock-data';

// Export everything from the clinic service
export type { Clinic };
export { getMockClinics };

// Create a facade for the clinic service
export const ClinicService = {
  getClinics,
  getClinic,
  addClinic,
  updateClinic,
  deleteClinic
};

export default ClinicService;
