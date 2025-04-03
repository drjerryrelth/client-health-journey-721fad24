
// Re-export everything from the new modular structure
// This maintains backward compatibility with existing code
export * from './check-ins';

// Re-export the default export too
import { CheckInService } from './check-ins';
export default CheckInService;
