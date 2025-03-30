
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';

export async function loginWithEmail(email: string, password: string) {
  console.log('Attempting login with email:', email);
  
  // Check if this is a demo login
  const isDemoLogin = email === 'drrelth@contourlight.com';
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
  
  // For demo accounts, ensure the profile exists
  if (isDemoLogin) {
    await ensureDemoProfileExists(data.user.id);
  }
  
  console.log('Login successful');
  return data;
}

// New helper function to ensure demo profile exists
async function ensureDemoProfileExists(userId: string) {
  console.log('Ensuring demo profile exists for user:', userId);
  
  try {
    // Check if profile exists first
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (fetchError || !profile) {
      console.log('Demo profile not found, creating one');
      
      // Extract role from user metadata if possible
      const { data: userData } = await supabase.auth.getUser();
      const userRole = userData?.user?.user_metadata?.role || 'admin';
      const userName = userData?.user?.user_metadata?.full_name || 'Demo User';
      
      // Create profile if it doesn't exist
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: userName,
          email: 'drrelth@contourlight.com',
          role: userRole,
        });
      
      if (insertError) {
        console.error('Error creating demo profile:', insertError);
      } else {
        console.log('Demo profile created successfully');
      }
    } else {
      console.log('Demo profile already exists');
    }
  } catch (error) {
    console.error('Error handling demo profile:', error);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // If login succeeds, return the data
      if (!error && data.user) {
        console.log('Demo account already exists and login successful');
        return data;
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
        return;
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

// New function to bypass email confirmation for demo accounts
export async function autoConfirmDemoEmail(email: string, password: string) {
  const isDemoAccount = email === 'drrelth@contourlight.com';
  
  if (!isDemoAccount) {
    return false;
  }
  
  try {
    // For demo accounts, we'll try a direct sign-in with the admin key
    // This would need a custom server endpoint in a real app
    console.log('Attempting special demo account login flow');
    
    // For now, we'll just create a fake successful response
    // In a real app, we'd need a server-side function to handle this
    return true;
  } catch (error) {
    console.error('Auto-confirm failed:', error);
    return false;
  }
}
