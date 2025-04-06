
// This file is now just re-exporting from the demo directory
// for backward compatibility
export { 
  demoEmails,
  isDemoEmail,
  isDemoAdminEmail,
  isDemoCoachEmail,
  isDemoClientEmail,
  isDemoClinicAdminEmail,
  getDemoUserNameByEmail,
  getDemoRoleByEmail,
  ensureDemoProfileExists,
  autoConfirmDemoEmail,
  isDemoClinicEmail,
  handleDemoClinicSignup
} from './demo';
