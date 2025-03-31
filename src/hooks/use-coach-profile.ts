
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
        // First try to get profile from coaches table
        const { data: coachData, error: coachError } = await supabase
          .from('coaches')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (coachError || !coachData) {
          console.error('Error fetching coach data:', coachError);
          
          // If not found in coaches table, try profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile data:', profileError);
            toast.error("Failed to load your profile information");
            return;
          }
          
          setProfileData({
            name: profileData.full_name || "",
            email: profileData.email || "",
            phone: "",
          });
        } else {
          setProfileData(coachData);
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
