// Legacy service file - keeping for backward compatibility 
// New code should import directly from the specific files

import { Coach } from './types';
import { getAllCoaches, getClinicCoaches } from './coach-fetchers';
import { getMockCoaches, createMockCoach } from './mock-data';

// Export methods for backward compatibility
export { 
  getClinicCoaches,
  getAllCoaches,
  getMockCoaches,
  createMockCoach
};

// Legacy demo data - to be replaced with actual data from Supabase
export const mockCoaches: Coach[] = getMockCoaches();
