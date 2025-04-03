
import { demoEmails } from './constants';

/**
 * Check if an email is for a demo account
 */
export function isDemoEmail(email: string): boolean {
  if (!email) return false;
  
  // Direct match against known demo emails
  if (Object.values(demoEmails).includes(email.toLowerCase())) {
    return true;
  }
  
  // Check for @demo.com or @example.com domains which are our demo domains
  return email.toLowerCase().endsWith('@demo.com') || 
         email.toLowerCase().endsWith('@example.com');
}

/**
 * Check if an email is for the demo admin account specifically
 */
export function isDemoAdminEmail(email: string): boolean {
  return email.toLowerCase() === demoEmails.admin;
}

/**
 * Get the appropriate user name based on the demo email
 */
export function getDemoUserNameByEmail(email: string): string {
  const lowerEmail = email.toLowerCase();
  
  if (lowerEmail === demoEmails.admin) {
    return 'Admin User';
  } else if (lowerEmail === demoEmails.coach) {
    return 'Coach User';
  } else if (lowerEmail === demoEmails.client) {
    return 'Client User';
  }
  
  // For other demo accounts, generate a name based on the email
  return `Demo ${lowerEmail.split('@')[0].charAt(0).toUpperCase() + lowerEmail.split('@')[0].slice(1)}`;
}

/**
 * Get the appropriate role based on the demo email
 */
export function getDemoRoleByEmail(email: string): string {
  const lowerEmail = email.toLowerCase();
  
  if (lowerEmail === demoEmails.admin) {
    return 'admin';
  } else if (lowerEmail === demoEmails.coach) {
    return 'coach';
  } else if (lowerEmail === demoEmails.client) {
    return 'client';
  }
  
  // Default role for demo accounts
  return 'client';
}
