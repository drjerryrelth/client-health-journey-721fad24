
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isDemoClientEmail } from '@/services/auth/demo/utils';

export const checkAuthentication = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      console.error('User not authenticated');
      toast.error('You must be logged in to perform this action');
      return null;
    }
    
    console.log('Authentication successful, user is logged in');
    return sessionData.session;
  } catch (error) {
    console.error('Authentication error:', error);
    toast.error('Authentication failed');
    return null;
  }
};

// Helper to check if the user is a client
export const checkClientAccess = async () => {
  try {
    // First check if this is a demo client email from the session
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user?.email && isDemoClientEmail(sessionData.session.user.email)) {
      console.log('Demo client email detected, granting access');
      return sessionData.session;
    }
    
    const session = await checkAuthentication();
    if (!session) return null;
    
    // Get user role from profiles
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    
    if (profile?.role !== 'client') {
      console.error('User is not a client');
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Client access check error:', error);
    return null;
  }
};
