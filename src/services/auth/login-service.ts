
import { supabase } from '@/integrations/supabase/client';
import { isDemoEmail, ensureDemoProfileExists, isDemoAdminEmail, isDemoCoachEmail } from './demo';
import { handleDemoAccountCreation } from './login/demo-handler';

export async function loginWithEmail(email: string, password: string) {
  console.log('Attempting login with email:', email);
  
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
    
    // For demo accounts, ensure profile exists with correct role
    if (isDemoAccount && result.data.user) {
      console.log('Demo account login successful, ensuring profile exists with correct role');
      const userId = result.data.user.id;
      
      // Special check for admin demo
      if (isDemoAdminEmail(email)) {
        console.log('CRITICAL: This is an admin demo login success, ensuring admin profile exists with NO clinic ID');
      }
      
      // Special check for coach demo
      if (isDemoCoachEmail(email)) {
        console.log('CRITICAL: This is a coach demo login success, ensuring coach profile exists with proper clinic ID');
      }
      
      // Ensure profile exists with correct role based on email
      await ensureDemoProfileExists(userId, email);
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
