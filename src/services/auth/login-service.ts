import { supabase } from '@/integrations/supabase/client';
import { 
  isDemoEmail, 
  ensureDemoProfileExists, 
  isDemoAdminEmail, 
  isDemoCoachEmail, 
  isDemoClientEmail,
  getDemoRoleByEmail
} from './demo';
import { handleDemoAccountCreation } from './login/demo-handler';

export async function loginWithEmail(email: string, password: string) {
  console.log('Attempting login with email:', email);
  let coach_id: string | undefined;
  
  // Check if this is a demo login
  const isDemoAccount = isDemoEmail(email);
  if (isDemoAccount) {
    console.log('This is a demo login attempt');
    // Special handling for admin demo
    if (isDemoAdminEmail(email)) {
      console.log('CRITICAL: This is an admin demo login attempt');
    }
    // Special handling for coach demo
    if (isDemoCoachEmail(email)) {
      console.log('CRITICAL: This is a coach demo login attempt');
    }
    // Special handling for client demo
    if (isDemoClientEmail(email)) {
      console.log('CRITICAL: This is a client demo login attempt');
    }
    await handleDemoAccountCreation(email);
  }
  
  try {
    // Attempt login
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Check for error in the result
    if (result.error) {
      console.error('Login failed:', result.error.message);
      throw result.error;
    }
    
    // Check if we have a user in the response
    if (!result.data.user) {
      console.error('No user returned from login');
      throw new Error('No user returned from login');
    }

    // Get the user's profile to determine their role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', result.data.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      throw profileError;
    }

    if (profile.role === "coach") {
      const { data: coachData, error: coachError } = await supabase
        .from('coaches')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (coachError) {
        console.error('Error fetching coach data:', coachError);
        throw coachError;
        }

      if (coachData) {
        coach_id = coachData.id;
      }
    }
    // If no profile exists, create one for demo accounts
    if (!profile && isDemoAccount) {
      try {
        const role = getDemoRoleByEmail(email);
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: result.data.user.id,
            full_name: result.data.user.user_metadata?.full_name || email.split('@')[0],
            email: email,
            role: role,
            clinic_id: null
          });

        if (createError) {
          console.error('Error creating profile:', createError);
          // If profile creation fails, still return the login result with the demo role
          return {
            ...result,
            role: role
          };
        }
      } catch (createErr) {
        console.error('Error creating profile:', createErr);
        // If profile creation fails, still return the login result with the demo role
        return {
          ...result,
          role: getDemoRoleByEmail(email)
        };
      }
    }

    // For demo accounts, always use the demo role from the email
    const role = isDemoAccount ? getDemoRoleByEmail(email) : (profile?.role || 'client');

    return {
      ...result,
      role: role,
      coach_id: coach_id
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function signUpWithEmail(
  email: string, 
  password: string, 
  userData: { full_name: string; role: string }
) {
  console.log('Attempting to create account with email:', email);
  
  // For demo accounts, we need to handle them specially
  const isDemoAccount = isDemoEmail(email);
  
  if (isDemoAccount) {
    // Try to sign in first to see if account exists
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // If login succeeds, return the data
      if (!result.error && result.data.user) {
        console.log('Demo account already exists and login successful');
        
        // Ensure profile exists with correct role
        await ensureDemoProfileExists(result.data.user.id, email);
        
        return result.data;
      }
    } catch (signInError) {
      // Continue with signup if login failed
      console.log('Demo account does not exist or login failed, continuing with signup');
    }
  }
  
  // Create the user
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  if (result.error) {
    console.error('Sign up error:', result.error);
    throw result.error;
  }
  
  console.log('Account created successfully');
  
  // For demo accounts, ensure profile exists with correct role right after signup
  if (isDemoAccount && result.data.user) {
    console.log('Demo account signup successful, ensuring profile exists with correct role');
    await ensureDemoProfileExists(result.data.user.id, email);
  }
  
  return result.data;
}
