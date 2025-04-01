
// Demo email addresses used throughout the application
export const demoEmails = {
  admin: 'admin@example.com', // Changed to a valid email format that Supabase will accept
  coach: 'support@practicenaturals.com',
  client: 'drjerryrelth@gmail.com'
};

// Helper function to check if an email is a demo admin account
export const isDemoAdminEmail = (email: string): boolean => {
  return email === demoEmails.admin;
};

// Helper function to determine if an email is any demo account
export const isDemoEmail = (email: string): boolean => {
  return Object.values(demoEmails).includes(email);
};

// Helper to get demo name based on email
export const getDemoUserNameByEmail = (email: string): string => {
  if (email === demoEmails.admin) return 'Admin User';
  if (email === demoEmails.coach) return 'Coach User';
  if (email === demoEmails.client) return 'Client User';
  return 'Demo User';
};

// Helper to get demo role based on email
export const getDemoRoleByEmail = (email: string): string => {
  if (email === demoEmails.admin) return 'admin';
  if (email === demoEmails.coach) return 'coach';
  if (email === demoEmails.client) return 'client';
  return 'client';
};
