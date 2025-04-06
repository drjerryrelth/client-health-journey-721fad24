// Legacy service file - keeping for backward compatibility 
// New code should import directly from the specific files

import { Coach } from './types';
import { getAllCoaches, getClinicCoaches } from './coach-fetchers';
import { getMockCoaches, createMockCoach } from './mock-data';
// Import CRUD operations from the new exports file
import { addCoach, updateCoach, deleteCoach, resetCoachPassword } from './coach-service-exports';

// Export methods for backward compatibility
export { 
  getClinicCoaches,
  getAllCoaches,
  getMockCoaches,
  createMockCoach,
  // Also export CRUD operations
  addCoach,
  updateCoach,
  deleteCoach,
  resetCoachPassword
};

// Legacy demo data - to be replaced with actual data from Supabase
export const mockCoaches: Coach[] = getMockCoaches();
