
// Re-export everything from the coach service modules
import { getAllCoachesForAdmin, getClinicCoaches } from './coach-fetchers';
import { addCoach, updateCoach } from './coach-crud';
import { removeCoachAndReassignClients, deleteCoach, resetCoachPassword } from './coach-admin';

// Export the coach service API
export const CoachService = {
  getAllCoachesForAdmin,
  getClinicCoaches,
  addCoach,
  updateCoach,
  removeCoachAndReassignClients,
  deleteCoach,
  resetCoachPassword
};

// Export types
export type { Coach } from './types';
