
import { Clinic } from './types';
import { fetchClinic, fetchClinics } from './fetch-service';
import { 
  addClinic, 
  createClinic,
  updateClinic,
  deleteClinic,
  updateClinicBranding
} from './mutation-service';

export const ClinicService = {
  getClinic: fetchClinic,
  getClinics: fetchClinics,
  addClinic,
  createClinic,
  updateClinic,
  deleteClinic,
  updateClinicBranding
};

// Export as both default and named export to support both import styles
export { ClinicService };
export default ClinicService;
