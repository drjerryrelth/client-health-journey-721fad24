
import { supabase } from '@/integrations/supabase/client';

/**
 * Automatically confirms a demo email address by simulating the email verification
 * This is only used for demo accounts in development/testing
 */
export async function autoConfirmDemoEmail(email: string): Promise<void> {
  try {
    console.log('Auto-confirming demo email:', email);
    
    // Get the user by email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (userError || !userData) {
      console.error('Error getting user for auto-confirmation:', userError?.message);
      return;
    }
    
    // Update the user to have a confirmed email
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userData.id,
      { email_confirm: true }
    );
    
    if (updateError) {
      console.error('Error confirming demo email:', updateError.message);
      return;
    }
    
    console.log('Demo email confirmed successfully');
  } catch (error) {
    console.error('Error in autoConfirmDemoEmail:', error);
  }
}
