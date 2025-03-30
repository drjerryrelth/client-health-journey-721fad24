
import supabase from '@/lib/supabase';
import { CheckIn } from '@/types';

export const CheckInService = {
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
      
      // For each check-in, get photos
      const checkInsWithPhotos = await Promise.all(
        checkInsData.map(async (checkIn) => {
          const { data: photosData, error: photosError } = await supabase
            .from('check_in_photos')
            .select('*')
            .eq('check_in_id', checkIn.id);
            
          if (photosError) throw photosError;
          
          // Format into expected structure
          return {
            id: checkIn.id,
            clientId: checkIn.client_id,
            date: checkIn.date,
            weight: checkIn.weight,
            measurements: {
              waist: checkIn.waist,
              hips: checkIn.hips,
              chest: checkIn.chest,
              thighs: checkIn.thighs,
              arms: checkIn.arms,
            },
            moodScore: checkIn.mood_score,
            energyScore: checkIn.energy_score,
            waterIntake: checkIn.water_intake,
            meals: {
              breakfast: checkIn.breakfast,
              lunch: checkIn.lunch,
              dinner: checkIn.dinner,
              snacks: checkIn.snacks,
            },
            notes: checkIn.notes,
            photos: photosData.map(photo => photo.photo_url),
          } as CheckIn;
        })
      );
      
      return checkInsWithPhotos;
    } catch (error) {
      console.error('Error fetching client check-ins:', error);
      throw error;
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
      const checkIns = data.map(checkIn => ({
        id: checkIn.id,
        clientId: checkIn.client_id,
        date: checkIn.date,
        weight: checkIn.weight,
        measurements: {
          waist: checkIn.waist,
          hips: checkIn.hips,
          chest: checkIn.chest,
          thighs: checkIn.thighs,
          arms: checkIn.arms,
        },
        moodScore: checkIn.mood_score,
        energyScore: checkIn.energy_score,
        waterIntake: checkIn.water_intake,
        meals: {
          breakfast: checkIn.breakfast,
          lunch: checkIn.lunch,
          dinner: checkIn.dinner,
          snacks: checkIn.snacks,
        },
        notes: checkIn.notes,
      })) as CheckIn[];
      
      return checkIns;
    } catch (error) {
      console.error('Error fetching recent check-ins:', error);
      throw error;
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
      
      // Format into expected structure
      return {
        id: checkIn.id,
        clientId: checkIn.client_id,
        date: checkIn.date,
        weight: checkIn.weight,
        measurements: {
          waist: checkIn.waist,
          hips: checkIn.hips,
          chest: checkIn.chest,
          thighs: checkIn.thighs,
          arms: checkIn.arms,
        },
        moodScore: checkIn.mood_score,
        energyScore: checkIn.energy_score,
        waterIntake: checkIn.water_intake,
        meals: {
          breakfast: checkIn.breakfast,
          lunch: checkIn.lunch,
          dinner: checkIn.dinner,
          snacks: checkIn.snacks,
        },
        notes: checkIn.notes,
        photos: photosData.map(photo => photo.photo_url),
      } as CheckIn;
    } catch (error) {
      console.error('Error fetching check-in details:', error);
      throw error;
    }
  },
  
  // Create a new check-in
  async createCheckIn(checkIn: Omit<CheckIn, 'id'>, photos?: File[]): Promise<CheckIn> {
    try {
      // Transform to match database structure
      const { measurements, meals, photos: _, ...restCheckIn } = checkIn;
      
      const checkInData = {
        client_id: restCheckIn.clientId,
        date: restCheckIn.date,
        weight: restCheckIn.weight,
        waist: measurements?.waist,
        hips: measurements?.hips,
        chest: measurements?.chest,
        thighs: measurements?.thighs,
        arms: measurements?.arms,
        mood_score: restCheckIn.moodScore,
        energy_score: restCheckIn.energyScore,
        water_intake: restCheckIn.waterIntake,
        breakfast: meals?.breakfast,
        lunch: meals?.lunch,
        dinner: meals?.dinner,
        snacks: meals?.snacks,
        notes: restCheckIn.notes,
      };
      
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
        // For now, this is a placeholder
        // uploadedPhotos = await Promise.all(photos.map(async (photo) => {
        //   return await uploadCheckInPhoto(photo, checkIn.clientId, data.id);
        // }));
        
        // Store photo URLs in check_in_photos table
        // const photoEntries = uploadedPhotos.map(url => ({
        //   check_in_id: data.id,
        //   photo_url: url,
        //   photo_type: 'progress'
        // }));
        
        // await supabase.from('check_in_photos').insert(photoEntries);
      }
      
      // Format and return complete check-in data
      return {
        id: data.id,
        clientId: data.client_id,
        date: data.date,
        weight: data.weight,
        measurements: {
          waist: data.waist,
          hips: data.hips,
          chest: data.chest,
          thighs: data.thighs,
          arms: data.arms,
        },
        moodScore: data.mood_score,
        energyScore: data.energy_score,
        waterIntake: data.water_intake,
        meals: {
          breakfast: data.breakfast,
          lunch: data.lunch,
          dinner: data.dinner,
          snacks: data.snacks,
        },
        notes: data.notes,
        photos: uploadedPhotos,
      } as CheckIn;
    } catch (error) {
      console.error('Error creating check-in:', error);
      throw error;
    }
  },
  
  // Update an existing check-in
  async updateCheckIn(checkInId: string, updates: Partial<CheckIn>): Promise<CheckIn> {
    try {
      // Transform to match database structure
      const { measurements, meals, photos, ...restUpdates } = updates;
      
      const checkInUpdates: any = {
        ...restUpdates,
      };
      
      // Handle nested objects
      if (measurements) {
        if (measurements.waist !== undefined) checkInUpdates.waist = measurements.waist;
        if (measurements.hips !== undefined) checkInUpdates.hips = measurements.hips;
        if (measurements.chest !== undefined) checkInUpdates.chest = measurements.chest;
        if (measurements.thighs !== undefined) checkInUpdates.thighs = measurements.thighs;
        if (measurements.arms !== undefined) checkInUpdates.arms = measurements.arms;
      }
      
      if (meals) {
        if (meals.breakfast !== undefined) checkInUpdates.breakfast = meals.breakfast;
        if (meals.lunch !== undefined) checkInUpdates.lunch = meals.lunch;
        if (meals.dinner !== undefined) checkInUpdates.dinner = meals.dinner;
        if (meals.snacks !== undefined) checkInUpdates.snacks = meals.snacks;
      }
      
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
      return {
        id: data.id,
        clientId: data.client_id,
        date: data.date,
        weight: data.weight,
        measurements: {
          waist: data.waist,
          hips: data.hips,
          chest: data.chest,
          thighs: data.thighs,
          arms: data.arms,
        },
        moodScore: data.mood_score,
        energyScore: data.energy_score,
        waterIntake: data.water_intake,
        meals: {
          breakfast: data.breakfast,
          lunch: data.lunch,
          dinner: data.dinner,
          snacks: data.snacks,
        },
        notes: data.notes,
        photos: existingPhotos.map(photo => photo.photo_url),
      } as CheckIn;
    } catch (error) {
      console.error('Error updating check-in:', error);
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
      throw error;
    }
  }
};

export default CheckInService;
