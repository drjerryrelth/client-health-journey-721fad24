
import { supabase } from '@/integrations/supabase/client';
import { isDemoEmail } from '../demo';
import { handleDemoAccountCreation } from './demo-handler';

export async function loginWithEmail(email: string, password: string) {
  console.log('Attempting login with email:', email);
  
  // Check if this is a demo login
  const isDemoAccount = isDemoEmail(email);
  if (isDemoAccount) {
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
  
  return result.data;
}
