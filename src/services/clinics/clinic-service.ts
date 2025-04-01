
import { Clinic } from './types';
import { fetchClinic, fetchClinics } from './fetch-service';
import { 
  addClinic, 
  createClinic,
  updateClinic,
  deleteClinic,
  updateClinicBranding
} from './mutations';

// Define the service object once, then export it in different ways
export const ClinicService = {
  getClinic: fetchClinic,
  getClinics: fetchClinics,
  addClinic,
  createClinic,
  updateClinic,
  deleteClinic,
  updateClinicBranding
};

// Export as default for default import style
export default ClinicService;
