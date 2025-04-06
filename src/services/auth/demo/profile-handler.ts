
import { supabase } from '@/integrations/supabase/client';
import { getDemoRoleByEmail, isDemoAdminEmail, isDemoCoachEmail, isDemoClinicAdminEmail, isDemoClientEmail } from './utils';
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
      name = email === 'support@practicenaturals.com' ? 'Support Coach' : 'Coach User';
      clinicId = DEMO_CLINIC_ID;
      
      // Also ensure coach record exists
      await ensureDemoCoachExists(userId, name, clinicId);
    }
    else if (isDemoClientEmail(email)) {
      console.log('Ensuring client demo profile with clinic ID');
      name = email === 'drjerry@livingbetterhealthcare.com' ? 'Dr. Jerry' : 'Client User';
      clinicId = DEMO_CLINIC_ID;
      
      // Also ensure client record exists
      await ensureDemoClientExists(userId, name, clinicId);
    }
    
    // If profile doesn't exist, create it
    if (!existingProfile) {
      console.log(`Creating new profile for demo user ${email} with role ${role}`);
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: userId, 
            full_name: name, 
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
          full_name: name, 
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
            status: 'active',
            email: name.includes('Support') ? 'support@practicenaturals.com' : 'coach@example.com'
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

/**
 * Ensures that a demo client exists in the clients table
 */
async function ensureDemoClientExists(userId: string, name: string, clinicId: string): Promise<void> {
  try {
    // Check if client record already exists
    const { data: existingClient, error: fetchError } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (fetchError && !fetchError.message.includes('No rows found')) {
      throw fetchError;
    }
    
    // If client doesn't exist, create it
    if (!existingClient) {
      console.log(`Creating new client record for user ${userId} in clinic ${clinicId}`);
      
      // Assign to demo coach
      const { data: demoCoach, error: coachError } = await supabase
        .from('coaches')
        .select('id')
        .eq('clinic_id', clinicId)
        .eq('email', 'coach@example.com')
        .single();
        
      if (coachError && !coachError.message.includes('No rows found')) {
        console.error('Error finding demo coach:', coachError);
      }
      
      const coachId = demoCoach?.id;
      
      // Get a demo program
      const { data: demoProgram, error: programError } = await supabase
        .from('programs')
        .select('id')
        .eq('clinic_id', clinicId)
        .limit(1)
        .single();
        
      if (programError && !programError.message.includes('No rows found')) {
        console.error('Error finding demo program:', programError);
      }
      
      const programId = demoProgram?.id;
      
      const email = name.includes('Jerry') ? 'drjerry@livingbetterhealthcare.com' : 'client@example.com';
      
      const { error: insertError } = await supabase
        .from('clients')
        .insert([
          { 
            user_id: userId,
            name,
            clinic_id: clinicId,
            coach_id: coachId,
            program_id: programId,
            email: email,
            start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 30 days ago
            last_check_in: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 3 days ago
            initial_weight: 185,
            weight_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 30 days ago
            goals: ['Weight loss', 'Better sleep']
          }
        ]);
        
      if (insertError) {
        throw insertError;
      }
      
      console.log(`Created client record for user ${userId}`);
      
      // Create some sample check-ins
      await createDemoCheckIns(email, clinicId);
      
    } else {
      // Client exists, update it to ensure correct data
      console.log(`Updating existing client record for user ${userId}`);
      
      const { error: updateError } = await supabase
        .from('clients')
        .update({ 
          name,
          clinic_id: clinicId,
        })
        .eq('user_id', userId);
        
      if (updateError) {
        throw updateError;
      }
      
      console.log(`Updated client record for user ${userId}`);
    }
  } catch (error) {
    console.error('Error ensuring demo client exists:', error);
    toast.error('Failed to initialize demo client');
  }
}

/**
 * Creates demo check-ins for a client
 */
async function createDemoCheckIns(clientEmail: string, clinicId: string): Promise<void> {
  try {
    // Get the client ID
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('email', clientEmail)
      .eq('clinic_id', clinicId)
      .single();
      
    if (clientError) {
      console.error('Error finding client:', clientError);
      return;
    }
    
    const clientId = client.id;
    
    // Check if check-ins already exist
    const { data: existingCheckIns, error: checkInsError } = await supabase
      .from('check_ins')
      .select('id')
      .eq('client_id', clientId)
      .limit(1);
      
    if (checkInsError) {
      console.error('Error checking for existing check-ins:', checkInsError);
      return;
    }
    
    // If check-ins already exist, don't create more
    if (existingCheckIns && existingCheckIns.length > 0) {
      console.log('Check-ins already exist for client');
      return;
    }
    
    // Create check-ins for the last 4 weeks, once per week
    const checkIns = [];
    
    for (let i = 0; i < 4; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7)); // Once per week
      
      const weightChange = Math.round((i * 1.5) * 10) / 10; // Lose 1.5 lbs per week
      
      checkIns.push({
        client_id: clientId,
        date: date.toISOString().slice(0, 10),
        weight: 185 - weightChange,
        waist: 36 - (i * 0.25),
        energy_score: 7 + (i * 0.5 > 3 ? 3 : i * 0.5),
        mood_score: 6 + (i * 0.5 > 4 ? 4 : i * 0.5),
        water_intake: 6 + (i * 0.5 > 2 ? 2 : i * 0.5),
        sleep_hours: 6 + (i * 0.25 > 1.5 ? 1.5 : i * 0.25),
        breakfast: "Eggs and avocado",
        lunch: "Chicken salad",
        dinner: "Salmon with vegetables",
        snacks: "Nuts and fruit",
        notes: `Week ${4-i} check-in. Feeling ${i > 2 ? 'great' : 'good'} this week!`
      });
    }
    
    // Insert the check-ins
    const { error: insertError } = await supabase
      .from('check_ins')
      .insert(checkIns);
      
    if (insertError) {
      console.error('Error creating demo check-ins:', insertError);
      return;
    }
    
    console.log(`Created ${checkIns.length} demo check-ins for client`);
    
  } catch (error) {
    console.error('Error creating demo check-ins:', error);
  }
}
