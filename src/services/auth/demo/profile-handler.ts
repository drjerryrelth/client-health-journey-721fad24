
import { supabase } from '@/integrations/supabase/client';
import { getDemoRoleByEmail, isDemoAdminEmail, isDemoCoachEmail, isDemoClinicAdminEmail } from './utils';
import { toast } from 'sonner';

// Default clinic ID for demo purposes
const DEMO_CLINIC_ID = '65196bd4-f754-4c4e-9649-2bf478016701';

/**
 * Ensures that a demo user profile exists in the database with the correct role.
 * This is called after a demo user logs in.
 */
export async function ensureDemoProfileExists(userId: string, email: string): Promise<void> {
  try {
    console.log(`Ensuring demo profile exists for ${email} (userId: ${userId})`);
    
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (fetchError && !fetchError.message.includes('No rows found')) {
      throw fetchError;
    }
    
    // Determine role based on email
    const role = getDemoRoleByEmail(email);
    let name = email.split('@')[0];
    
    // Special handling for admin demo account
    let clinicId = null;
    
    if (isDemoAdminEmail(email)) {
      console.log('Ensuring admin demo profile with NO clinic ID');
      name = 'Admin User';
      // Admin has no clinic ID
    } 
    else if (isDemoClinicAdminEmail(email)) {
      console.log('Ensuring clinic admin demo profile with clinic ID');
      name = 'Clinic Admin User';
      clinicId = DEMO_CLINIC_ID;
    }
    else if (isDemoCoachEmail(email)) {
      console.log('Ensuring coach demo profile with clinic ID');
      name = 'Coach User';
      clinicId = DEMO_CLINIC_ID;
      
      // Also ensure coach record exists
      await ensureDemoCoachExists(userId, name, clinicId);
    }
    
    // If profile doesn't exist, create it
    if (!existingProfile) {
      console.log(`Creating new profile for demo user ${email} with role ${role}`);
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: userId, 
            name, 
            email, 
            role,
            clinic_id: clinicId
          }
        ]);
        
      if (insertError) {
        throw insertError;
      }
      
      console.log(`Created profile for demo user ${email}`);
    } else {
      // Profile exists, update it to ensure correct role and clinic ID
      console.log(`Updating existing profile for demo user ${email} to role ${role}`);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          name, 
          role,
          clinic_id: clinicId
        })
        .eq('id', userId);
        
      if (updateError) {
        throw updateError;
      }
      
      console.log(`Updated profile for demo user ${email}`);
    }
  } catch (error) {
    console.error('Error ensuring demo profile exists:', error);
    toast.error('Failed to initialize demo profile');
  }
}

/**
 * Ensures that a demo coach exists in the coaches table
 */
async function ensureDemoCoachExists(userId: string, name: string, clinicId: string): Promise<void> {
  try {
    // Check if coach record already exists
    const { data: existingCoach, error: fetchError } = await supabase
      .from('coaches')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (fetchError && !fetchError.message.includes('No rows found')) {
      throw fetchError;
    }
    
    // If coach doesn't exist, create it
    if (!existingCoach) {
      console.log(`Creating new coach record for user ${userId} in clinic ${clinicId}`);
      
      const { error: insertError } = await supabase
        .from('coaches')
        .insert([
          { 
            user_id: userId,
            name,
            clinic_id: clinicId,
            status: 'active'
          }
        ]);
        
      if (insertError) {
        throw insertError;
      }
      
      console.log(`Created coach record for user ${userId}`);
    } else {
      // Coach exists, update it to ensure correct clinic ID
      console.log(`Updating existing coach record for user ${userId}`);
      
      const { error: updateError } = await supabase
        .from('coaches')
        .update({ 
          name,
          clinic_id: clinicId,
          status: 'active'
        })
        .eq('user_id', userId);
        
      if (updateError) {
        throw updateError;
      }
      
      console.log(`Updated coach record for user ${userId}`);
    }
  } catch (error) {
    console.error('Error ensuring demo coach exists:', error);
    toast.error('Failed to initialize demo coach');
  }
}
