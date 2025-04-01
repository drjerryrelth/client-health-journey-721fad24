
import { supabase } from '@/integrations/supabase/client';
import { Client, mapClientToDbClient, mapDbClientToClient } from '@/types';
import { toast } from 'sonner';
import { createClientAccountForClient, sendClientWelcomeEmail } from './client-account';

export const createClient = async (client: Omit<Client, 'id'>): Promise<{ data: Client | null, error: any, tempPassword?: string }> => {
  try {
    const dbClient = mapClientToDbClient(client);
    
    const { data, error } = await supabase
      .from('clients')
      .insert([dbClient])
      .select()
      .single();

    if (error) throw error;
    
    const newClientData = mapDbClientToClient(data);
    
    // After successful client creation, create an auth account for this client
    try {
      if (newClientData && newClientData.id) {
        const accountResult = await createClientAccountForClient(newClientData);
        
        // If we have a temporary password, send welcome email and add it to the client object
        if (accountResult && accountResult.success && accountResult.tempPassword) {
          await sendClientWelcomeEmail(newClientData, accountResult.tempPassword);
          
          return {
            data: newClientData,
            error: null,
            tempPassword: accountResult.tempPassword
          };
        }
      }
      
      return { data: newClientData, error: null };
    } catch (accountError) {
      console.error('Error creating account for new client:', accountError);
      // Continue returning the client even if account creation failed
      return { data: newClientData, error: null };
    }
  } catch (error) {
    console.error('Error creating client:', error);
    return { data: null, error };
  }
};

export const updateClient = async (clientId: string, updates: Partial<Client>): Promise<{ data: Client | null, error: any }> => {
  try {
    // Convert client fields to DB format
    // Note: We need to explicitly type this as any to avoid TypeScript errors
    // because mapClientToDbClient expects a more complete object
    const clientWithId = { ...updates, id: clientId } as Client;
    const dbUpdates = mapClientToDbClient(clientWithId);
    
    const { data, error } = await supabase
      .from('clients')
      .update(dbUpdates)
      .eq('id', clientId)
      .select()
      .single();

    if (error) throw error;
    
    return { data: mapDbClientToClient(data), error: null };
  } catch (error) {
    console.error('Error updating client:', error);
    return { data: null, error };
  }
};

export const deleteClient = async (clientId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};
