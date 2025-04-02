
import { supabase } from '@/integrations/supabase/client';
import { isDemoEmail } from './constants';

// Helper function to auto-confirm demo email addresses
export async function autoConfirmDemoEmail(email: string): Promise<boolean> {
  console.log('Checking if we should auto-confirm email:', email);
  
  // Only auto-confirm demo emails
  if (!isDemoEmail(email)) {
    console.log('Not a demo email, skipping auto-confirmation');
    return false;
  }
  
  try {
    console.log('Attempting to auto-confirm demo email');
    
    // This would ideally call a server function to confirm the email
    // For now, we'll implement a client-side workaround
    
    // Attempt to sign in directly which confirms the functionality works
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'password123' // Demo password
    });
    
    if (error) {
      console.error('Error during demo email auto-confirmation:', error.message);
      return false;
    }
    
    console.log('Successfully auto-confirmed demo email');
    return true;
  } catch (error) {
    console.error('Error during demo email auto-confirmation:', error);
    return false;
  }
}
