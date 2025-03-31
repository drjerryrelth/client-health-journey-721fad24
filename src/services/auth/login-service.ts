
import { supabase } from '@/integrations/supabase/client';
import { ensureDemoProfileExists } from './demo-service';

// Helper function to handle demo account logic
const handleDemoAccountCreation = async (email: string) => {
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
      } else {
        console.warn('Could not create demo user:', signUpData.error.message);
      }
    } else {
      console.log('Demo user created successfully');
    }
  } catch (createErr) {
    console.error('Error creating demo account:', createErr);
  }
};

// Helper to get demo name based on email
const getDemoUserNameByEmail = (email: string): string => {
  const demoEmails = {
    admin: 'drrelth@contourlight.com',
    coach: 'support@practicenaturals.com',
    client: 'drjerryrelth@gmail.com'
  };
  
  if (email === demoEmails.admin) return 'Admin User';
  if (email === demoEmails.coach) return 'Coach User';
  if (email === demoEmails.client) return 'Client User';
  return 'Demo User';
};

// Helper to get demo role based on email
const getDemoRoleByEmail = (email: string): string => {
  const demoEmails = {
    admin: 'drrelth@contourlight.com',
    coach: 'support@practicenaturals.com',
    client: 'drjerryrelth@gmail.com'
  };
  
  if (email === demoEmails.admin) return 'admin';
  if (email === demoEmails.coach) return 'coach';
  if (email === demoEmails.client) return 'client';
  return 'client';
};

// Check if an email belongs to a demo account
const isDemoEmail = (email: string): boolean => {
  const demoEmails = {
    admin: 'drrelth@contourlight.com',
    coach: 'support@practicenaturals.com',
    client: 'drjerryrelth@gmail.com'
  };
  
  return Object.values(demoEmails).includes(email);
};

// Perform actual login request with timeout protection
const performLoginRequest = async (email: string, password: string) => {
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

// Helper to ensure clinic profile exists
const ensureClinicProfileExists = async (userId: string, email: string) => {
  try {
    // Check if this email is associated with a clinic
    const { data: clinicData, error: clinicError } = await supabase
      .from('clinics')
      .select('id, name')
      .eq('email', email)
      .single();
    
    if (clinicError) {
      return false; // Not a clinic user
    }
    
    // Create or update the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: clinicData.name || 'Clinic User',
        email: email,
        role: 'coach', // Default role for clinic users
        clinic_id: clinicData.id,
      });
    
    if (profileError) {
      console.error('Error creating clinic profile:', profileError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring clinic profile exists:', error);
    return false;
  }
};

export async function loginWithEmail(email: string, password: string) {
  console.log('Attempting login with email:', email);
  
  // Check if this is a demo login
  if (isDemoEmail(email)) {
    await handleDemoAccountCreation(email);
  }
  
  try {
    const result = await performLoginRequest(email, password);
    
    if (!result.data.user) {
      console.error('No user returned from login');
      throw new Error('No user returned from login');
    }
    
    // For demo accounts, ensure the profile exists
    if (isDemoEmail(email)) {
      await ensureDemoProfileExists(result.data.user.id, email);
    } else {
      // Check if this might be a clinic user
      await ensureClinicProfileExists(result.data.user.id, email);
    }
    
    console.log('Login successful');
    return result.data;
  } catch (error: any) {
    console.error('Login error details:', error);
    throw error;
  }
}

// Helper to check if a user already exists
const checkIfUserExists = async (email: string, password: string) => {
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
const createUserAndProfile = async (
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
    // Check if the user already exists
    const userExists = await checkIfUserExists(email, password);
    if (userExists) {
      console.log('User already exists, no need to sign up');
      return { user: null, session: null };
    }
  }
  
  const result = await createUserAndProfile(email, password, userData);
  console.log('Account created successfully');
  
  return result;
}
