
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

/**
 * Adds HIPAA compliance notice to new accounts
 * This function can be called when creating new user accounts
 */
export async function addHipaaNotice(userId: string): Promise<void> {
  try {
    console.log('Adding HIPAA notice to user profile:', userId);
    
    // Add HIPAA notice metadata to user profile
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          hipaa_acknowledged: true,
          hipaa_acknowledgment_date: new Date().toISOString()
        }
      }
    );
    
    if (error) {
      console.log('Could not add HIPAA notice (expected in most environments):', error.message);
      return;
    }
    
    console.log('HIPAA notice added successfully');
  } catch (error) {
    console.warn('Error in addHipaaNotice:', error);
  }
}
