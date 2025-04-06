
export interface AdminUser {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  clinic_id?: string;
}

export interface AdminUserFormData {
  email: string;
  password?: string;
  fullName: string;
  role: string;
  clinicId?: string;
}
