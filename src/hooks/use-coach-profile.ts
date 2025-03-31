
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

// Define the profile schema
export const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  notifyClientCheckIn: z.boolean().default(true),
  notifyClientMessage: z.boolean().default(true),
  notifyClientProgress: z.boolean().default(false),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const useCoachProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchCoachProfile = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        console.log('Fetching coach profile for user ID:', user.id);
        
        // First try to get profile from coaches table
        const { data: coachData, error: coachError } = await supabase
          .from('coaches')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to prevent errors when no data is found
        
        if (coachError) {
          console.error('Error fetching coach data:', coachError);
          throw coachError;
        }
        
        if (coachData) {
          console.log('Coach data found:', coachData);
          setProfileData(coachData);
        } else {
          // If not found in coaches table, try profiles table
          console.log('No coach data found, checking profiles table');
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error('Error fetching profile data:', profileError);
            throw profileError;
          }
          
          if (!profileData) {
            console.log('No profile data found, creating fallback profile');
            // Create fallback profile from user object
            setProfileData({
              name: user.name || "",
              email: user.email || "",
              phone: "",
            });
          } else {
            console.log('Profile data found:', profileData);
            setProfileData({
              name: profileData.full_name || "",
              email: profileData.email || "",
              phone: "",
            });
          }
        }
      } catch (error) {
        console.error('Error loading coach profile:', error);
        toast.error("Failed to load your profile information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoachProfile();
  }, [user?.id]);

  const updateCoachProfile = async (data: ProfileFormValues) => {
    if (!user?.id) return;
    
    try {
      toast.info("Updating profile...");
      
      const updates = {
        name: data.fullName,
        email: data.email,
        phone: data.phone || null,
      };
      
      const { error } = await supabase
        .from('coaches')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update the local state with the new data
      setProfileData({
        ...profileData,
        ...updates
      });
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  return {
    profileData,
    loading,
    updateCoachProfile
  };
};
