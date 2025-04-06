
import { supabase } from '@/integrations/supabase/client';

/**
 * Automatically confirms a demo email address by simulating the email verification
 * This is only used for demo accounts in development/testing
 */
export async function autoConfirmDemoEmail(email: string): Promise<void> {
  try {
    console.log('Auto-confirming demo email:', email);
    
    // Get user by email using auth.getUser() and filtering
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users for auto-confirmation:', listError.message);
      return;
    }
    
    const userData = users?.find(user => user.email === email);
    
    if (!userData) {
      console.error('User not found for auto-confirmation with email:', email);
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
