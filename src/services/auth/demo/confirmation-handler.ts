import { supabase } from '@/integrations/supabase/client';

/**
 * Auto-confirms demo email addresses, bypassing email verification
 */
export const autoConfirmDemoEmail = async (email: string): Promise<boolean> => {
  console.log('Auto-confirming demo email:', email);
  // For demo accounts, we're already auto-confirming in the signup/login flow
  // This is a placeholder for future auto-confirmation logic if needed
  return true;
};

/**
 * Adds a HIPAA notice to demo account confirmations
 */
export const addHipaaNotice = (email: string): string => {
  return `
    IMPORTANT NOTICE: This is a demo account for ${email}.
    
    In a production environment, this system would be HIPAA compliant
    and would handle protected health information (PHI) securely.
    
    For demo purposes, all data is simulated and no real PHI is used.
  `;
};
