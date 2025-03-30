
import { Coach } from './types';
import { getClinicCoaches, getAllCoaches } from './coach-fetchers';
import { addCoach, updateCoach, removeCoachAndReassignClients } from './coach-mutations';
import { getMockCoaches } from './mock-data';
import { getCoachCount, getAllCoachesForAdmin } from './admin-coach-service';

// Export types
export type { Coach };

// Export functions
export const CoachService = {
  getClinicCoaches,
  getAllCoaches,
  addCoach,
  updateCoach,
  removeCoachAndReassignClients,
  getCoachCount,         // Add the admin service functions
  getAllCoachesForAdmin  // Add the admin service functions
};

// Export mock data function
export { getMockCoaches };

// Default export
export default CoachService;
