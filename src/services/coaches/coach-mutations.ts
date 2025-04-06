
import { addCoach, updateCoach } from './coach-crud';
import { removeCoachAndReassignClients, deleteCoach, resetCoachPassword } from './coach-admin';

// Re-export the functions
export { 
  addCoach, 
  updateCoach, 
  removeCoachAndReassignClients,
  deleteCoach,
  resetCoachPassword
};
