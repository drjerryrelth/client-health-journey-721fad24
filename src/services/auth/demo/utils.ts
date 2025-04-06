
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
