
import { AdminUserService } from "@/services/admin-user-service";

// Function to promote a specific user to Super Admin
export const promoteAdminUserToSuperAdmin = async (email: string) => {
  try {
    console.log(`Starting promotion process for ${email}...`);
    const result = await AdminUserService.promoteUserToSuperAdmin(email);
    console.log(`Promotion successful:`, result);
    return { success: true, data: result };
  } catch (error) {
    console.error(`Failed to promote ${email} to Super Admin:`, error);
    return { success: false, error };
  }
};

// Execute the promotion for our specific admin user
export const promoteDrRelthToSuperAdmin = async () => {
  return await promoteAdminUserToSuperAdmin("drrelth@contourlight.com");
};
