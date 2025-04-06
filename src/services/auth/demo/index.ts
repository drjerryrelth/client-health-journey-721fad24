
export { demoEmails, DEMO_CLINIC_ID } from './constants';
export { 
  isDemoAdminEmail, 
  isDemoClinicAdminEmail,
  isDemoCoachEmail,
  isDemoClientEmail,
  isDemoEmail,
  isDemoClinicEmail,
  getDemoUserNameByEmail,
  getDemoRoleByEmail,
  handleDemoClinicSignup
} from './utils';
export { autoConfirmDemoEmail, addHipaaNotice } from './confirmation-handler';
export { ensureDemoProfileExists } from './profile-handler';
export { 
  handleDemoClinicSignup as handleDemoClinicSignupImpl,
  isDemoClinicAccountExists 
} from './clinic-handler';
