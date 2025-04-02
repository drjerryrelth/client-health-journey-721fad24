
import { supabase } from '@/integrations/supabase/client';
import { 
  getDemoUserNameByEmail, 
  getDemoRoleByEmail, 
  isDemoEmail,
  isDemoAccountExists,
  ensureDemoProfileExists
} from '../demo';
import { autoConfirmDemoEmail } from '../demo/confirmation-handler';

// Helper function to handle demo account logic
export const handleDemoAccountCreation = async (email: string): Promise<boolean> => {
  console.log('This is a demo login attempt');
  
  // Check if demo account already exists first to avoid rate limiting
  const accountExists = await isDemoAccountExists(email);
  if (accountExists) {
    console.log('Demo account already exists, skipping creation');
    return true;
  }
  
  // For demo accounts, try to ensure the account exists first
  try {
    const signUpData = await supabase.auth.signUp({
      email,
      password: 'password123', // Standard demo password
      options: {
        data: {
          full_name: getDemoUserNameByEmail(email),
          role: getDemoRoleByEmail(email),
        }
      }
    });
    
    if (signUpData.error) {
      // If error is because user already exists, that's fine - we'll continue with login
      if (signUpData.error.message?.includes('already registered')) {
        console.log('Demo user already exists, will proceed with login');
        return true;
      } else if (signUpData.error.message?.includes('after 59 seconds') || 
                signUpData.error.message?.includes('rate limit')) {
        console.error('Rate limit hit during demo account creation:', signUpData.error.message);
        throw new Error('Demo account creation rate limited. Please try again later.');
      } else {
        console.warn('Could not create demo user:', signUpData.error.message);
        return false;
      }
    } else {
      console.log('Demo user created successfully');
      
      // For demo accounts, we should immediately confirm the email
      try {
        await autoConfirmDemoEmail(email);
      } catch (confirmErr) {
        console.error('Error confirming demo email:', confirmErr);
      }
      
      return true;
    }
  } catch (createErr) {
    console.error('Error creating demo account:', createErr);
    throw createErr;
  }
};
