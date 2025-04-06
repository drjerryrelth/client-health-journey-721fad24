
import { demoEmails } from './constants';
import { UserRole } from '@/types';

// Check if the email is one of our demo emails
export function isDemoEmail(email: string): boolean {
  if (!email) return false;
  const lowerEmail = email.toLowerCase();
  
  return Object.values(demoEmails).some(demoEmail => 
    demoEmail.toLowerCase() === lowerEmail
  );
}

// Check if this is specifically the demo admin email
export function isDemoAdminEmail(email: string): boolean {
  if (!email) return false;
  return email.toLowerCase() === demoEmails.admin.toLowerCase();
}

// Check if this is specifically the demo clinic admin email
export function isDemoClinicAdminEmail(email: string): boolean {
  if (!email) return false;
  return email.toLowerCase() === demoEmails.clinicAdmin.toLowerCase();
}

// Get the demo user name based on the email
export function getDemoUserNameByEmail(email: string): string {
  if (!email) return 'Demo User';
  
  const lowerEmail = email.toLowerCase();
  
  // Map demo emails to user names
  if (lowerEmail === demoEmails.admin.toLowerCase()) {
    return 'Admin User';
  } else if (lowerEmail === demoEmails.coach.toLowerCase()) {
    return 'Coach User';
  } else if (lowerEmail === demoEmails.client.toLowerCase()) {
    return 'Client User';
  } else if (lowerEmail === demoEmails.clinicAdmin.toLowerCase()) {
    return 'Clinic Admin User';
  }
  
  // For other demo emails, use the part before @ as the name
  return email.split('@')[0];
}

// Get the appropriate role based on the demo email
export function getDemoRoleByEmail(email: string): UserRole {
  if (!email) return 'client';
  
  const lowerEmail = email.toLowerCase();
  
  // Map demo emails to roles
  if (lowerEmail === demoEmails.admin.toLowerCase()) {
    return 'admin';
  } else if (lowerEmail === demoEmails.coach.toLowerCase()) {
    return 'coach';
  } else if (lowerEmail === demoEmails.client.toLowerCase()) {
    return 'client';
  } else if (lowerEmail === demoEmails.clinicAdmin.toLowerCase()) {
    return 'clinic_admin';
  }
  
  // Default role for unknown demo emails
  return 'client';
}
