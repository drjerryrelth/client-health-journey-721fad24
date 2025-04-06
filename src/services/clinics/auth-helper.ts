
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
