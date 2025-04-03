
import { supabase } from '@/integrations/supabase/client';

export const CheckInPhotoService = {
  async getCheckInPhotos(checkInId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('check_in_photos')
        .select('photo_url')
        .eq('check_in_id', checkInId);
        
      if (error) throw error;
      
      return data.map(photo => photo.photo_url);
    } catch (error) {
      console.error('Error fetching check-in photos:', error);
      return [];
    }
  }
};
