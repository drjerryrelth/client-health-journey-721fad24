
import { CheckInFetchers } from './check-in-fetchers';
import { CheckInMutations } from './check-in-mutations';

// Export a combined service object
export const CheckInService = {
  ...CheckInFetchers,
  ...CheckInMutations
};

export default CheckInService;
