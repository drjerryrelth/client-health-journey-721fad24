
// Re-export Coach Service functionality
import { 
  getClinicCoaches, 
  getAllCoaches,
  updateCoachStatus,
  createCoach,
  updateCoach,
  deleteCoach,
  resetCoachPassword 
} from './coach-service';

import { getMockCoaches } from './mock-data';

// Export Coach Service API with appropriate function names
export const CoachService = {
  getClinicCoaches,
  getAllCoaches,
  getAllCoachesForAdmin: getAllCoaches, // Important alias to clarify this is for admin only
  updateCoachStatus,
  createCoach,
  updateCoach,
  deleteCoach,
  resetCoachPassword,
  getMockCoaches
};

// Explicitly re-export getMockCoaches for direct imports
export { getMockCoaches };

// Re-export types for external consumers
export type { Coach } from './types';
