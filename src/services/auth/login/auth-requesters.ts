
import { supabase } from '@/integrations/supabase/client';

// Perform actual login request with timeout protection
export const performLoginRequest = async (email: string, password: string) => {
  const loginPromise = supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Login timeout')), 10000);
  });
  
  // Race between actual login and timeout
  return Promise.race([
    loginPromise,
    timeoutPromise.then(() => {
      throw new Error('Login request timed out');
    }),
  ]);
};

// Helper to check if a user already exists
export const checkIfUserExists = async (email: string, password: string) => {
  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // If login succeeds, user already exists
    return !signInError;
  } catch (signInError) {
    // User doesn't exist or other error
    return false;
  }
};

// Create user and profile record
export const createUserAndProfile = async (
  email: string, 
  password: string, 
  userData: { full_name: string; role: string }
) => {
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
  
  return result.data;
};
