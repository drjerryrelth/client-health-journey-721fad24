
import { supabase } from '@/integrations/supabase/client';
import { CheckIn } from '@/types';
import { toast } from 'sonner';
import { mockCheckIns } from './mock-data';
import { mapDbCheckInToCheckIn } from './mappers';

export const CheckInFetchers = {
  // Fetch all check-ins for a specific client
  async getClientCheckIns(clientId: string): Promise<CheckIn[]> {
    try {
      // Get basic check-in data
      const { data: checkInsData, error: checkInsError } = await supabase
        .from('check_ins')
        .select('*')
        .eq('client_id', clientId)
        .order('date', { ascending: false });

      if (checkInsError) throw checkInsError;
      
      // Ensure we have some data
      if (!checkInsData || checkInsData.length === 0) {
        return [];
      }
      
      // For each check-in, get photos
      const checkInsWithPhotos = await Promise.all(
        checkInsData.map(async (checkIn) => {
          const { data: photosData, error: photosError } = await supabase
            .from('check_in_photos')
            .select('*')
            .eq('check_in_id', checkIn.id);
            
          if (photosError) throw photosError;
          
          return mapDbCheckInToCheckIn(checkIn, photosData?.map(photo => photo.photo_url) || []);
        })
      );
      
      return checkInsWithPhotos;
    } catch (error) {
      console.error('Error fetching client check-ins:', error);
      toast.error('Failed to fetch check-ins. Please try again later.');
      return mockCheckIns.filter(checkIn => checkIn.clientId === clientId);
    }
  },
  
  // Fetch recent check-ins for a specific client (last 7 days)
  async getRecentCheckIns(clientId: string): Promise<CheckIn[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    try {
      const { data, error } = await supabase
        .from('check_ins')
        .select('*')
        .eq('client_id', clientId)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Transform into expected format
      return data.map(checkIn => mapDbCheckInToCheckIn(checkIn, []));
    } catch (error) {
      console.error('Error fetching recent check-ins:', error);
      toast.error('Failed to fetch recent check-ins. Please try again later.');
      return [];
    }
  },
  
  // Fetch specific check-in by ID
  async getCheckInById(checkInId: string): Promise<CheckIn | null> {
    try {
      // Get basic check-in data
      const { data: checkIn, error: checkInError } = await supabase
        .from('check_ins')
        .select('*')
        .eq('id', checkInId)
        .single();

      if (checkInError) throw checkInError;
      
      // Get photos for this check-in
      const { data: photosData, error: photosError } = await supabase
        .from('check_in_photos')
        .select('*')
        .eq('check_in_id', checkInId);
        
      if (photosError) throw photosError;
      
      return mapDbCheckInToCheckIn(checkIn, photosData.map(photo => photo.photo_url));
    } catch (error) {
      console.error('Error fetching check-in details:', error);
      toast.error('Failed to fetch check-in details. Please try again later.');
      return null;
    }
  }
};
