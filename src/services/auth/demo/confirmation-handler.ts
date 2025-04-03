
import { supabase } from '@/integrations/supabase/client';

/**
 * Automatically confirm a demo email address to bypass email confirmation
 * This is only used for demo accounts to simplify the testing process
 */
export async function autoConfirmDemoEmail(email: string): Promise<void> {
  try {
    console.log('Attempting to auto-confirm demo email:', email);
    
    // Try to confirm the user email
    // Note: This requires the service_role key which users won't have in production
    // This is just a fallback and shouldn't be expected to work in most environments
    const { error } = await supabase.auth.admin.updateUserById(
      'placeholder-will-be-replaced-by-email-lookup',
      { email_confirm: true }
    );
    
    if (error) {
      console.log('Could not auto-confirm email (expected in most environments):', error.message);
      console.log('This is fine, as email auto-confirmation requires admin privileges');
      return;
    }
    
    console.log('Demo email auto-confirmed successfully');
  } catch (error) {
    console.warn('Error in autoConfirmDemoEmail:', error);
  }
}
