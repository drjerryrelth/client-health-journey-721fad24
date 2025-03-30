
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

// Constants for storage buckets
export const STORAGE_BUCKETS = {
  PROFILE_IMAGES: 'profile-images',
  CHECK_IN_PHOTOS: 'check-in-photos',
};

// Helper function to create a unique file path
const createFilePath = (bucketName: string, fileName: string) => {
  const fileExt = fileName.split('.').pop();
  const uniqueId = uuidv4();
  return `${uniqueId}.${fileExt}`;
};

// Upload a file to a specific bucket
export const uploadFile = async (
  file: File,
  bucketName: string,
  folderPath?: string
) => {
  try {
    const filePath = folderPath 
      ? `${folderPath}/${createFilePath(bucketName, file.name)}`
      : createFilePath(bucketName, file.name);
      
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Custom hook for file uploads with toast notifications
export const useFileUpload = () => {
  const { toast } = useToast();
  
  const uploadProfileImage = async (file: File, userId: string) => {
    try {
      toast({
        title: 'Uploading image...',
        description: 'Please wait while we upload your image.',
      });
      
      const publicUrl = await uploadFile(file, STORAGE_BUCKETS.PROFILE_IMAGES, userId);
      
      toast({
        title: 'Image uploaded',
        description: 'Your profile image has been updated.',
      });
      
      return publicUrl;
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your image.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  const uploadCheckInPhoto = async (file: File, clientId: string, checkInId: string) => {
    try {
      toast({
        title: 'Uploading photo...',
        description: 'Please wait while we upload your progress photo.',
      });
      
      const publicUrl = await uploadFile(
        file, 
        STORAGE_BUCKETS.CHECK_IN_PHOTOS, 
        `${clientId}/${checkInId}`
      );
      
      toast({
        title: 'Photo uploaded',
        description: 'Your progress photo has been saved.',
      });
      
      return publicUrl;
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your progress photo.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  return {
    uploadProfileImage,
    uploadCheckInPhoto,
  };
};

// Delete a file from storage
export const deleteFile = async (filePath: string, bucketName: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
