
// Demo email addresses used throughout the application
export const demoEmails = {
  admin: 'drrelth@contourlight.com',
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
