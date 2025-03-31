
// Re-export from new location for backward compatibility
import { ClinicService } from './clinics';
import type { Clinic } from './clinics';

export type { Clinic };
export { ClinicService };
export default ClinicService;
