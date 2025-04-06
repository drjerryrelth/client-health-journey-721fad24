
import { supabase } from '@/integrations/supabase/client';
import { 
  demoEmails, 
  autoConfirmDemoEmail, 
  ensureDemoProfileExists 
} from '../demo';

/**
 * Handle demo account creation or login
 */
export async function handleDemoAccountCreation(email: string): Promise<void> {
  console.log(`Setting up demo account for ${email}`);
  
  try {
    // First, check if the account exists by listing users and filtering
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.log('Error listing users, will attempt to create:', listError.message);
      // Continue with creation if we can't confirm existence
    }
    
    const existingUser = users?.find(user => user.email === email);
    
    // If user doesn't exist, create it
    if (!existingUser) {
      console.log('Creating demo account...');
      
      const password = 'password123'; // Standard demo password
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email.split('@')[0],
            role: getDemoRoleByEmail(email)
          }
        }
      });
      
      if (error) {
        console.error('Failed to create demo account:', error.message);
        return;
      }
      
      // For demo accounts, auto-confirm the email
      await autoConfirmDemoEmail(email);
      
      console.log('Demo account created successfully');
    } else {
      console.log('Demo account already exists');
    }
  } catch (error) {
    console.error('Error in handleDemoAccountCreation:', error);
  }
}

// Helper function to get the demo role by email
function getDemoRoleByEmail(email: string): string {
  // These functions should be imported from '../demo'
  // but adding here directly to ensure they're available
  if (email === demoEmails.admin) return 'admin';
  if (email === demoEmails.clinicAdmin) return 'clinic_admin';
  if (email === demoEmails.coach || email === demoEmails.coachAlt) return 'coach';
  if (email === demoEmails.client || email === demoEmails.clientAlt) return 'client';
  return 'client'; // Default fallback
}
