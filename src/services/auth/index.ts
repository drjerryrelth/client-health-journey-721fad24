
export { loginWithEmail, signUpWithEmail } from './login-service';
export { logoutUser, getCurrentSession, setupAuthListener } from './session-service';
export { 
  isDemoEmail, 
  isDemoAdminEmail, 
  isDemoCoachEmail,
  isDemoClinicAdminEmail,
  getDemoUserNameByEmail,
  getDemoRoleByEmail,
  autoConfirmDemoEmail, 
  isDemoClinicEmail, 
  handleDemoClinicSignup 
} from './demo';

