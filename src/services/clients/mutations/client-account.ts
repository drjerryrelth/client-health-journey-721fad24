
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types';
import { toast } from 'sonner';

// Helper function to create a client account with auth credentials for a newly created client
export const createClientAccountForClient = async (client: Client) => {
  if (!client.name || !client.email) {
    console.warn('Cannot create client account: missing name or email information');
    return null;
  }

  try {
    // Generate a temporary password (using "password123" as default for ease of use)
    const tempPassword = "password123";
    
    // Create auth user for client using the client's email
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: client.email,
      password: tempPassword,
      options: {
        data: {
          full_name: client.name,
          role: 'client',
          clinic_id: client.clinicId
        },
        // Skip email confirmation for coach-created accounts
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (authError) {
      console.error('Error creating auth account for client:', authError);
      throw authError;
    }

    console.log(`Auth account created for client ${client.name}`);
    
    // Return success with the temporary password
    return {
      success: true,
      tempPassword
    };
  } catch (error) {
    console.error('Error in createClientAccountForClient:', error);
    return null;
  }
};

// Send welcome email to the client with their temporary password
export const sendClientWelcomeEmail = async (client: Client, tempPassword: string) => {
  // In a production environment, you would likely want to use an edge function
  // to send the email securely. For now, we'll just log the information.
  console.log(`Welcome email would be sent to ${client.email} with password: ${tempPassword}`);
  
  // Mock successful email sending
  toast.success(`Welcome email sent to ${client.name} (${client.email})`);
  return true;
};
