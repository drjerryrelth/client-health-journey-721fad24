
import { Coach } from './types';
import { getClinicCoaches, getAllCoaches } from './coach-fetchers';
import { addCoach, updateCoach, removeCoachAndReassignClients } from './coach-mutations';
import { getMockCoaches } from './mock-data';

// Export types
export type { Coach };

// Export functions
export const CoachService = {
  getClinicCoaches,
  getAllCoaches,
  addCoach,
  updateCoach,
  removeCoachAndReassignClients
};

// Export mock data function
export { getMockCoaches };

// Default export
export default CoachService;
