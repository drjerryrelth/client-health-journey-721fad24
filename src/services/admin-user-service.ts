
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
      console.log('Creating admin user with data:', userData);
      
      // First create the auth user directly
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password || '',
        email_confirm: true,
        user_metadata: {
          full_name: userData.fullName,
          role: userData.role || 'admin'
        }
      });
      
      if (authError) {
        console.error('Error creating auth user:', authError);
        throw new Error(`Failed to create admin user: ${authError.message}`);
      }
      
      if (!authData || !authData.user) {
        throw new Error('Failed to create auth user: No data returned');
      }
      
      console.log('Auth user created:', authData.user);
      
      // Then create the admin user entry
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .insert({
          auth_user_id: authData.user.id,
          email: userData.email,
          full_name: userData.fullName,
          role: userData.role || 'admin'
        })
        .select()
        .maybeSingle();
      
      if (adminError) {
        console.error('Error creating admin user record:', adminError);
        throw new Error(`Failed to create admin user record: ${adminError.message}`);
      }
      
      // Also create a profile entry for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: userData.email,
          full_name: userData.fullName,
          role: userData.role || 'admin'
        });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        console.warn('Profile creation failed, but admin user was created');
      }
      
      if (!adminUser) {
        throw new Error('Admin user record created but no details returned');
      }
      
      return adminUser as AdminUser;
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
