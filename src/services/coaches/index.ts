
// Re-export everything from the coach service modules
import { getAllCoachesForAdmin, getClinicCoaches } from './coach-fetchers';
import { addCoach, updateCoach, removeCoachAndReassignClients } from './coach-mutations';
import { Coach } from './types';

// Export the coach service API
export const CoachService = {
  getAllCoachesForAdmin,
  getClinicCoaches,
  addCoach,
  updateCoach,
  removeCoachAndReassignClients
};

// Export types
export type { Coach };
