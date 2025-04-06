
import { demoEmails } from './constants';
import { UserRole } from '@/types';

/**
 * Checks if an email is a demo email
 */
export function isDemoEmail(email: string): boolean {
  if (!email) return false;
  
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check against all demo emails
  return normalizedEmail === demoEmails.admin ||
         normalizedEmail === demoEmails.coach ||
         normalizedEmail === demoEmails.client ||
         normalizedEmail === demoEmails.clinicAdmin ||
         normalizedEmail === demoEmails.coachAlt ||
         normalizedEmail === demoEmails.clientAlt;
}

/**
 * Checks if an email is a demo admin email
 */
export function isDemoAdminEmail(email: string): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === demoEmails.admin;
}

/**
 * Checks if an email is a demo clinic admin email
 */
export function isDemoClinicAdminEmail(email: string): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === demoEmails.clinicAdmin;
}

/**
 * Checks if an email is a demo coach email
 */
export function isDemoCoachEmail(email: string): boolean {
  if (!email) return false;
  
  const normalizedEmail = email.toLowerCase().trim();
  return normalizedEmail === demoEmails.coach || normalizedEmail === demoEmails.coachAlt;
}

/**
 * Checks if an email is a demo client email
 */
export function isDemoClientEmail(email: string): boolean {
  if (!email) return false;
  
  const normalizedEmail = email.toLowerCase().trim();
  return normalizedEmail === demoEmails.client || normalizedEmail === demoEmails.clientAlt;
}

/**
 * Gets the role associated with a demo email
 */
export function getDemoRoleByEmail(email: string): UserRole {
  if (!email) return 'client'; // Default fallback
  
  const normalizedEmail = email.toLowerCase().trim();
  
  if (normalizedEmail === demoEmails.admin) {
    return 'admin';
  } else if (normalizedEmail === demoEmails.clinicAdmin) {
    return 'clinic_admin';
  } else if (normalizedEmail === demoEmails.coach || normalizedEmail === demoEmails.coachAlt) {
    return 'coach';
  } else {
    return 'client'; // Default is client
  }
}

/**
 * Gets a user-friendly name based on the demo email
 */
export function getDemoUserNameByEmail(email: string): string {
  if (!email) return 'Demo User';
  
  const normalizedEmail = email.toLowerCase().trim();
  
  if (normalizedEmail === demoEmails.admin) {
    return 'Admin User';
  } else if (normalizedEmail === demoEmails.clinicAdmin) {
    return 'Clinic Admin User';
  } else if (normalizedEmail === demoEmails.coach) {
    return 'Coach User';
  } else if (normalizedEmail === demoEmails.coachAlt) {
    return 'Support Coach';
  } else if (normalizedEmail === demoEmails.client) {
    return 'Client User';
  } else if (normalizedEmail === demoEmails.clientAlt) {
    return 'Dr. Jerry';
  } else {
    return email.split('@')[0]; // Fallback to username portion of email
  }
}
