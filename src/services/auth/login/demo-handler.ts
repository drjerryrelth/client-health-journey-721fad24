import { supabase } from '@/integrations/supabase/client';
import { 
  getDemoUserNameByEmail, 
  getDemoRoleByEmail, 
  isDemoEmail 
} from '../demo';

// Helper function to handle demo account logic
export const handleDemoAccountCreation = async (email: string): Promise<boolean> => {
  console.log('This is a demo login attempt');
  
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
        console.log('Rate limit hit, assuming demo account exists and proceeding');
        return true;
      } else {
        console.warn('Could not create demo user:', signUpData.error.message);
        // Continue anyway - the login might still succeed
        return true;
      }
    } else {
      console.log('Demo user created successfully');
      
      // Create the user's profile
      if (signUpData.data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: signUpData.data.user.id,
            full_name: getDemoUserNameByEmail(email),
            email: email,
            role: getDemoRoleByEmail(email),
            clinic_id: null // Demo admin doesn't need a clinic ID
          });
          
        if (profileError) {
          console.error('Error creating demo profile:', profileError);
          // Continue anyway - the profile might already exist
        } else {
          console.log('Demo profile created successfully');
        }
      }
      
      return true;
    }
  } catch (createErr) {
    console.error('Error creating demo account:', createErr);
    // Try to continue with login anyway
    return true;
  }
};
