
import { demoEmails } from './constants';

/**
 * Checks if a given email is the demo admin email
 */
export const isDemoAdminEmail = (email: string): boolean => {
  if (!email) return false;
  const lowerCaseEmail = email.toLowerCase().trim();
  return demoEmails.demoAdmins.includes(lowerCaseEmail);
};

/**
 * Checks if a given email is the demo clinic admin email
 */
export const isDemoClinicAdminEmail = (email: string): boolean => {
  if (!email) return false;
  const lowerCaseEmail = email.toLowerCase().trim();
  return demoEmails.demoClinicAdmins.includes(lowerCaseEmail);
};

/**
 * Checks if a given email is a demo coach email
 */
export const isDemoCoachEmail = (email: string): boolean => {
  if (!email) return false;
  const lowerCaseEmail = email.toLowerCase().trim();
  return demoEmails.demoCoaches.includes(lowerCaseEmail);
};

/**
 * Checks if a given email is a demo client email
 */
export const isDemoClientEmail = (email: string): boolean => {
  if (!email) return false;
  const lowerCaseEmail = email.toLowerCase().trim();
  return demoEmails.demoClients.includes(lowerCaseEmail);
};

/**
 * Generic function to check if an email is any type of demo account
 */
export const isDemoEmail = (email: string): boolean => {
  return (
    isDemoAdminEmail(email) ||
    isDemoClinicAdminEmail(email) ||
    isDemoCoachEmail(email) ||
    isDemoClientEmail(email)
  );
};

/**
 * Helper function to determine if an email address is for a demo clinic signup
 * Demo clinic emails will follow a specific pattern for easy identification
 * @param email The email to check
 */
export const isDemoClinicEmail = (email: string): boolean => {
  // Accept ANY @example.com email as a demo email
  return email.toLowerCase().endsWith('@example.com');
};

/**
 * Gets a user's display name based on their demo email
 */
export const getDemoUserNameByEmail = (email: string): string => {
  if (!email) return 'Demo User';
  
  if (isDemoAdminEmail(email)) return 'Admin User';
  if (isDemoClinicAdminEmail(email)) return 'Clinic Admin User';
  if (isDemoCoachEmail(email)) {
    return email === 'support@practicenaturals.com' ? 'Support Coach' : 'Coach User';
  }
  if (isDemoClientEmail(email)) {
    return email === 'drjerry@livingbetterhealthcare.com' ? 'Dr. Jerry' : 'Client User';
  }
  
  // Generic email handling
  const username = email.split('@')[0];
  // Capitalize first letter of each word
  return username
    .split(/[-_.]/g)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

/**
 * Gets a user's role based on their demo email
 */
export const getDemoRoleByEmail = (email: string): string => {
  if (!email) return 'client';
  
  if (isDemoAdminEmail(email)) return 'admin';
  if (isDemoClinicAdminEmail(email)) return 'clinic_admin';
  if (isDemoCoachEmail(email)) return 'coach';
  if (isDemoClientEmail(email)) return 'client';
  
  // Default role
  return 'client';
};
