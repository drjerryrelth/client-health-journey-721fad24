
import { supabase } from '@/integrations/supabase/client';
import { CheckIn } from '@/types';
import { toast } from 'sonner';
import { mapDbCheckInToCheckIn, mapCheckInToDbCheckIn } from './mappers';

export const CheckInMutations = {
  // Create a new check-in
  async createCheckIn(checkIn: Omit<CheckIn, 'id'>, photos?: File[]): Promise<CheckIn> {
    try {
      // Transform to match database structure
      const checkInData = mapCheckInToDbCheckIn(checkIn);
      
      // Insert check-in data
      const { data, error } = await supabase
        .from('check_ins')
        .insert([checkInData])
        .select()
        .single();

      if (error) throw error;
      
      // Handle photo uploads if any
      let uploadedPhotos: string[] = [];
      if (photos && photos.length > 0) {
        // We'd need a proper file upload implementation here
        // This is a placeholder for future functionality
      }
      
      // Format and return complete check-in data
      return mapDbCheckInToCheckIn(data, uploadedPhotos);
    } catch (error) {
      console.error('Error creating check-in:', error);
      toast.error('Failed to create check-in. Please try again later.');
      throw error;
    }
  },
  
  // Update an existing check-in
  async updateCheckIn(checkInId: string, updates: Partial<CheckIn>): Promise<CheckIn> {
    try {
      // Transform to match database structure
      const checkInUpdates = mapCheckInToDbCheckIn(updates as Omit<CheckIn, 'id'>);
      
      // Update check-in data
      const { data, error } = await supabase
        .from('check_ins')
        .update(checkInUpdates)
        .eq('id', checkInId)
        .select()
        .single();

      if (error) throw error;
      
      // Get existing photos
      const { data: existingPhotos } = await supabase
        .from('check_in_photos')
        .select('*')
        .eq('check_in_id', checkInId);
        
      // Format and return updated check-in data
      return mapDbCheckInToCheckIn(data, existingPhotos.map(photo => photo.photo_url));
    } catch (error) {
      console.error('Error updating check-in:', error);
      toast.error('Failed to update check-in. Please try again later.');
      throw error;
    }
  },
  
  // Delete a check-in
  async deleteCheckIn(checkInId: string): Promise<void> {
    try {
      // Delete check-in (cascade should handle photos)
      const { error } = await supabase
        .from('check_ins')
        .delete()
        .eq('id', checkInId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting check-in:', error);
      toast.error('Failed to delete check-in. Please try again later.');
      throw error;
    }
  }
};
