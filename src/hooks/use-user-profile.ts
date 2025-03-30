
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types/auth';
import { UserRole } from '@/types';

export async function fetchUserProfile(userId: string): Promise<UserData | null> {
  try {
    console.log('Fetching user profile for ID:', userId);

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }

    if (profileData) {
      console.log('Profile data retrieved:', profileData);
      return {
        id: profileData.id,
        name: profileData.full_name,
        email: profileData.email,
        role: profileData.role as UserRole,
        clinicId: profileData.clinic_id,
      };
    }

    console.warn('No profile data found for user ID:', userId);
    return null;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
}
