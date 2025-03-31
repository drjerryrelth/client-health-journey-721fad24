
import { supabase } from '@/integrations/supabase/client';
import { ensureDemoProfileExists } from './demo-service';

export async function loginWithEmail(email: string, password: string) {
  console.log('Attempting login with email:', email);
  
  // Check if this is a demo login
  const demoEmails = {
    admin: 'drrelth@contourlight.com',
    coach: 'support@practicenaturals.com',
    client: 'drjerryrelth@gmail.com'
  };
  
  const isDemoLogin = Object.values(demoEmails).includes(email);
  if (isDemoLogin) {
    console.log('This is a demo login attempt');
    
    // For demo accounts, we'll try to ensure the account exists first
    try {
      // Since we can't check if a user exists directly with the client SDK,
      // we'll try to create the user and handle "already exists" errors
      try {
        const signUpData = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email === demoEmails.admin ? 'Admin User' : 
                        email === demoEmails.coach ? 'Coach User' : 'Client User',
              role: email === demoEmails.admin ? 'admin' : 
                    email === demoEmails.coach ? 'coach' : 'client',
            }
          }
        });
        
        if (signUpData.error) {
          // If error is because user already exists, that's fine - we'll continue with login
          if (signUpData.error.message?.includes('already registered')) {
            console.log('Demo user already exists, will proceed with login');
          } else {
            console.warn('Could not create demo user:', signUpData.error.message);
          }
        } else {
          console.log('Demo user created successfully');
        }
      } catch (createErr) {
        console.error('Error creating demo account:', createErr);
      }
    } catch (err) {
      console.error('Error preparing demo login:', err);
    }
  }
  
  // Add timeout to prevent hanging
  const loginPromise = supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Login timeout')), 10000);
  });
  
  // Race between actual login and timeout
  try {
    const result = await Promise.race([
      loginPromise,
      timeoutPromise.then(() => {
        throw new Error('Login request timed out');
      }),
    ]);
    
    if (!result.data.user) {
      console.error('No user returned from login');
      throw new Error('No user returned from login');
    }
    
    // For demo accounts, ensure the profile exists
    if (isDemoLogin) {
      await ensureDemoProfileExists(result.data.user.id, email);
    }
    
    console.log('Login successful');
    return result.data;
  } catch (error: any) {
    console.error('Login error details:', error);
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
  const isDemoAccount = email === 'drrelth@contourlight.com';
  
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
        return result.data;
      }
    } catch (signInError) {
      // Continue with signup if login failed
      console.log('Demo account does not exist or login failed, continuing with signup');
    }
  } else {
    // First check if the user already exists by trying to sign in
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // If login succeeds, user already exists
      if (!signInError) {
        console.log('User already exists, no need to sign up');
        return { user: null, session: null };
      }
    } catch (signInError) {
      // Continue with signup if login failed
      console.log('User does not exist, continuing with signup');
    }
  }
  
  console.log('Creating new account');
  
  const options = {
    data: {
      full_name: userData.full_name,
      role: userData.role,
    }
  };
  
  const result = await supabase.auth.signUp({
    email,
    password,
    options
  });
  
  if (result.error) {
    console.error('Sign up error:', result.error);
    throw result.error;
  }
  
  if (!result.data.user) {
    throw new Error('No user returned from signup');
  }
  
  console.log('User created, creating profile record');
  
  // Create profile record manually to ensure it exists even if the trigger fails
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: result.data.user.id,
    full_name: userData.full_name,
    email: email,
    role: userData.role,
  });
  
  if (profileError) {
    console.error('Error creating profile:', profileError);
    // Continue anyway since the user was created
  }
  
  console.log('Account created successfully');
  
  return result.data;
}
