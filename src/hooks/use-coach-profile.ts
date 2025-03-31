
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { checkAuthentication } from '@/services/clinics/auth-helper';
import { ProfileRow } from '@/types/database';

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

// Define profile data interface to avoid type errors
interface ProfileData {
  name: string;
  email: string;
  phone: string;
  [key: string]: any; // Allow additional properties
}

export const useCoachProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoachProfile = async () => {
      if (!user?.id) {
        setError("User authentication required");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching coach profile for user ID:', user.id);
        
        // Check if the session is valid
        const session = await checkAuthentication();
        if (!session) {
          setError("Authentication session expired");
          setLoading(false);
          return;
        }
        
        // Get profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
            
        if (profileError) {
          console.error('Error fetching profile data:', profileError);
          setError("Failed to retrieve coach profile data");
          setLoading(false);
          return;
        }
        
        if (!profileData) {
          console.log('No profile data found, creating fallback profile from user object');
          
          // Check if we have user information to create fallback
          if (user?.email) {
            // Create fallback profile from user object
            const fallbackProfile: ProfileData = {
              name: user.name || user.email.split('@')[0] || "Coach",
              email: user.email,
              phone: "", // Always include phone property
            };
            
            console.log('Created fallback profile:', fallbackProfile);
            setProfileData(fallbackProfile);
          } else {
            setError("Could not create profile - insufficient user data");
          }
        } else {
          console.log('Profile data found:', profileData);
          
          // Create profile data with correct property types, handling potential missing phone property
          setProfileData({
            name: profileData.full_name || "",
            email: profileData.email || "",
            // Use type assertion to handle the case where phone might not be in the type yet
            phone: (profileData as any).phone || "", 
          });
        }
      } catch (error: any) {
        console.error('Error loading coach profile:', error);
        setError("Failed to retrieve coach profile data");
        toast.error("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoachProfile();
  }, [user?.id, user?.email, user?.name]);

  const updateCoachProfile = async (data: ProfileFormValues) => {
    if (!user?.id) {
      toast.error("User authentication required");
      return;
    }
    
    try {
      toast.info("Updating profile...");
      
      // Update the profiles table directly
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          email: data.email,
          phone: data.phone || ""
        })
        .eq('id', user.id);
          
      if (error) {
        console.error('Error updating profile:', error);
        toast.error("Failed to update profile");
        throw error;
      }
      
      // Update the local state with the new data
      if (profileData) {
        setProfileData({
          ...profileData,
          name: data.fullName,
          email: data.email,
          phone: data.phone || ""
        });
      }
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  return {
    profileData,
    loading,
    error,
    updateCoachProfile
  };
};
