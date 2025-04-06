
// Export all coach-related services and types
export * from './types';
export * from './coach-crud';
export * from './coach-fetchers';
export * from './coach-admin';
export * from './coach-mutations';
export * from './coach-service';  // Legacy service file with some methods

// For backwards compatibility and migration ease
export * as CoachService from './coach-service';
