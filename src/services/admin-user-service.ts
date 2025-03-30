
import { supabase } from "@/integrations/supabase/client";
import type { AdminUser, AdminUserFormData } from "@/types/admin";

export const AdminUserService = {
  /**
   * Get all admin users
   */
  async getAllAdminUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('full_name');
    
    if (error) {
      console.error('Error fetching admin users:', error);
      throw error;
    }
    
    return data || [];
  },

  /**
   * Get a single admin user by ID
   */
  async getAdminUserById(id: string): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching admin user with ID ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`Admin user with ID ${id} not found`);
    }
    
    return data;
  },

  /**
   * Create a new admin user with auth credentials
   */
  async createAdminUser(userData: AdminUserFormData): Promise<AdminUser> {
    try {
      console.log('Creating admin user:', userData);
      
      // Call the stored procedure that creates both auth user and admin user
      // Make sure we're passing the parameters with the exact names expected by the function
      const { data, error } = await supabase
        .rpc('create_admin_user', {
          email: userData.email,
          password: userData.password || '',
          full_name: userData.fullName,
          role: userData.role || 'admin'
        });
      
      if (error) {
        console.error('Error creating admin user:', error);
        throw new Error(`Failed to create admin user: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('Failed to create admin user: No data returned');
      }
      
      console.log('Admin user created with auth_user_id:', data);
      
      // Return the newly created admin user
      const { data: newUser, error: fetchError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', data)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching new admin user:', fetchError);
        throw new Error(`Admin user created but failed to fetch details: ${fetchError.message}`);
      }
      
      if (!newUser) {
        throw new Error('Admin user created but no details found');
      }
      
      return newUser as AdminUser;
    } catch (error: any) {
      console.error('Error in createAdminUser:', error);
      throw error;
    }
  },

  /**
   * Update an existing admin user
   */
  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .update({
        full_name: updates.full_name,
        role: updates.role,
        is_active: updates.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error(`Error updating admin user with ID ${id}:`, error);
      throw error;
    }
    
    return data as AdminUser;
  },

  /**
   * Delete an admin user
   */
  async deleteAdminUser(id: string): Promise<void> {
    // First get the auth_user_id
    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('auth_user_id')
      .eq('id', id)
      .maybeSingle();
    
    if (fetchError) {
      console.error(`Error fetching admin user with ID ${id}:`, fetchError);
      throw fetchError;
    }
    
    if (!adminUser) {
      throw new Error(`Admin user with ID ${id} not found`);
    }
    
    // Delete the auth user (will cascade to admin_users via foreign key)
    const { error } = await supabase.auth.admin.deleteUser(
      adminUser.auth_user_id
    );
    
    if (error) {
      console.error(`Error deleting admin user with ID ${id}:`, error);
      throw error;
    }
  }
};
