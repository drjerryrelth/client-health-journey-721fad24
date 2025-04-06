
// This file re-exports coach CRUD operations from coach-crud.ts to maintain backward compatibility
// with existing code that imports from coach-service.ts

import { addCoach, updateCoach, deleteCoach, resetCoachPassword } from './coach-crud';

// Export functions for use in components
export {
  addCoach,
  updateCoach,
  deleteCoach,
  resetCoachPassword
};
