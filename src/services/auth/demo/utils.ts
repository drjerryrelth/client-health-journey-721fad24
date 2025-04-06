
import { demoEmails } from './constants';

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

