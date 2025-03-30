
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';

export async function loginWithEmail(email: string, password: string) {
  console.log('Attempting login with email:', email);
  
  // Check if this is a demo login
  const isDemoLogin = ['admin.demo@gmail.com', 'coach.demo@gmail.com', 'client.demo@gmail.com'].includes(email);
  if (isDemoLogin) {
    console.log('This is a demo login attempt');
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Login error details:', error);
    throw error;
  }
  
  if (!data.user) {
    console.error('No user returned from login');
    throw new Error('No user returned from login');
  }
  
  console.log('Login successful');
  return data;
}

export async function signUpWithEmail(
  email: string, 
  password: string, 
  userData: { full_name: string; role: string }
) {
  console.log('Attempting to create account with email:', email);
  
  // First check if the user already exists by trying to sign in
  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // If login succeeds, user already exists
    if (!signInError) {
      console.log('User already exists, no need to sign up');
      return;
    }
  } catch (signInError) {
    // Continue with signup if login failed
    console.log('User does not exist, continuing with signup');
  }
  
  console.log('Creating new account');
  
  const options = {
    data: {
      full_name: userData.full_name,
      role: userData.role,
    }
  };
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options
  });
  
  if (error) {
    console.error('Sign up error:', error);
    throw error;
  }
  
  if (!data.user) {
    throw new Error('No user returned from signup');
  }
  
  console.log('User created, creating profile record');
  
  // Create profile record manually to ensure it exists even if the trigger fails
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: data.user.id,
    full_name: userData.full_name,
    email: email,
    role: userData.role,
  });
  
  if (profileError) {
    console.error('Error creating profile:', profileError);
    // Continue anyway since the user was created
  }
  
  console.log('Account created successfully');
  
  return data;
}

export async function logoutUser() {
  console.log('Logging out user');
  return await supabase.auth.signOut();
}

export async function getCurrentSession() {
  return await supabase.auth.getSession();
}

export function setupAuthListener(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}
