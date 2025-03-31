
import { getClinicPrograms, getProgramById } from './program-fetchers';
import { createProgram, updateProgram, deleteProgram } from './program-mutations';

// Export the ProgramService object with all the methods
export const ProgramService = {
  getClinicPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
};

export default ProgramService;
