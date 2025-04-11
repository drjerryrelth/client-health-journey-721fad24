import { supabase } from "@/integrations/supabase/client";
import type { AdminUser, AdminUserFormData } from "@/types/admin";

export const AdminUserService = {
  /**
   * Get all admin users
   */
  async getAllAdminUsers(): Promise<AdminUser[]> {
    console.log('Fetching all admin users');
    try {
      // Use service role key through edge function to bypass RLS
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: { action: 'list' }
      });
      
      if (error) {
        console.error('Error fetching admin users:', error);
        throw error;
      }
      
      // Log the raw response to help debug
      console.log('Raw admin users response:', data);
      
      if (!data || !Array.isArray(data)) {
        console.warn('Invalid response format from admin users endpoint:', data);
        return [];
      }
      
      console.log('Admin users fetched:', data.length || 0);
      return data || [];
    } catch (error) {
      console.error('Error in getAllAdminUsers:', error);
      throw error;
    }
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
   * Find admin user by email
   */
  async findAdminUserByEmail(email: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    
    if (error) {
      console.error(`Error finding admin user with email ${email}:`, error);
      throw error;
    }
    
    return data;
  },

  /**
   * Create a new admin user with auth credentials
   */
  async createAdminUser(userData: AdminUserFormData & { clinicId?: string }): Promise<AdminUser> {
    try {
      console.log('Creating admin user with data:', userData);
      
      // First check if user already exists
      const existingUser = await this.findAdminUserByEmail(userData.email).catch(() => null);
      
      if (existingUser) {
        console.log('User already exists, updating instead:', existingUser.id);
        return await this.updateAdminUser(existingUser.id, {
          full_name: userData.fullName,
          role: userData.role || 'admin'
        });
      }
      
      // Get current user's role to check authorization
      const { data: currentUserProfile } = await supabase.auth.getUser();
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUserProfile?.user?.id)
        .maybeSingle();
      
      // If trying to create super_admin but user is not a super_admin
      if (userData.role === 'super_admin' && profileData?.role !== 'super_admin') {
        throw new Error('Only Super Admins can create other Super Admin accounts');
      }

      // Prepare metadata with clinic ID for clinic admins
      const metadata: Record<string, any> = {
        full_name: userData.fullName,
        role: userData.role || 'admin'
      };
      
      // Add clinic_id to metadata if provided for clinic admin
      if (userData.role === 'clinic_admin' && userData.clinicId) {
        metadata.clinic_id = userData.clinicId;
      }
      
      // Call our edge function instead of using client-side admin API
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: {
          action: 'create',
          email: userData.email,
          password: userData.password,
          fullName: userData.fullName,
          role: userData.role || 'admin',
          clinicId: userData.clinicId
        }
      });
      
      if (error) {
        console.error('Error calling create-admin-user function:', error);
        throw new Error(`Failed to create admin user: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('Admin user created but no details returned');
      }
      
      return data as AdminUser;
    } catch (error: any) {
      console.error('Error in createAdminUser:', error);
      throw error;
    }
  },

  /**
   * Update an existing admin user
   */
  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    try {
      // First check if the current user is allowed to make this update
      if (updates.role === 'super_admin') {
        // Get current user's role
        const { data: currentUserProfile } = await supabase.auth.getUser();
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUserProfile?.user?.id)
          .maybeSingle();
        
        // Only super_admin can promote to super_admin
        if (profileData?.role !== 'super_admin') {
          throw new Error('Only Super Admins can promote users to Super Admin role');
        }
      }
      
      // Use the edge function for more comprehensive updates
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: {
          action: 'update',
          userId: id,
          updates: updates
        }
      });
      
      if (error) {
        console.error(`Error updating admin user with ID ${id}:`, error);
        throw error;
      }
      
      return data as AdminUser;
    } catch (error: any) {
      console.error('Error in updateAdminUser:', error);
      throw error;
    }
  },

  /**
   * Delete an admin user
   */
  async deleteAdminUser(id: string): Promise<void> {
    // First get the auth_user_id and role
    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('auth_user_id, role')
      .eq('id', id)
      .maybeSingle();
    
    if (fetchError) {
      console.error(`Error fetching admin user with ID ${id}:`, fetchError);
      throw fetchError;
    }
    
    if (!adminUser) {
      throw new Error(`Admin user with ID ${id} not found`);
    }
    
    // Check if the user being deleted is a super_admin
    if (adminUser.role === 'super_admin') {
      // Get current user's role
      const { data: currentUserProfile } = await supabase.auth.getUser();
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUserProfile?.user?.id)
        .maybeSingle();
      
      // Only super_admin can delete another super_admin
      if (profileData?.role !== 'super_admin') {
        throw new Error('Only Super Admins can delete Super Admin accounts');
      }
    }
    
    // Call the edge function to delete the user with admin privileges
    const { error } = await supabase.functions.invoke('create-admin-user', {
      body: {
        action: 'delete',
        userId: adminUser.auth_user_id
      }
    });
    
    if (error) {
      console.error(`Error deleting admin user with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Promote a user to Super Admin by email
   */
  async promoteUserToSuperAdmin(email: string): Promise<AdminUser | null> {
    try {
      console.log(`Attempting to promote user with email ${email} to Super Admin`);
      
      // First find the admin user by email
      const adminUser = await this.findAdminUserByEmail(email);
      console.log('Admin user:', adminUser);
      
      if (!adminUser) {
        console.error(`Admin user with email ${email} not found`);
        throw new Error(`Admin user with email ${email} not found`);
      }
      
      console.log(`Found admin user:`, adminUser);
      
      // Update the user's role to super_admin
      const updatedUser = await this.updateAdminUser(adminUser.id, {
        role: 'super_admin'
      });
      
      console.log(`User successfully promoted to Super Admin:`, updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Error promoting user to Super Admin:', error);
      throw error;
    }
  }
};
