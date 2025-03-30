
import { Coach } from './types';
import { 
  getClinicCoaches, 
  addCoach, 
  updateCoach, 
  removeCoachAndReassignClients 
} from './api-service';
import { getMockCoaches } from './mock-data';

// Export types
export type { Coach };

// Export functions
export const CoachService = {
  getClinicCoaches,
  addCoach,
  updateCoach,
  removeCoachAndReassignClients
};

// Export mock data function
export { getMockCoaches };

// Default export
export default CoachService;
