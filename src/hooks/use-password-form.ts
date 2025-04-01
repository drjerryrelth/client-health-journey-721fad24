
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

// Password form schema
export const passwordSchema = z.object({
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" })
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type PasswordFormValues = z.infer<typeof passwordSchema>;

export const usePasswordForm = () => {
  const [loading, setLoading] = useState(false);

  const updatePassword = async (data: PasswordFormValues) => {
    setLoading(true);
    try {
      toast.info("Updating password...");
      
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      return true;
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error?.message || "Failed to update password");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updatePassword
  };
};
