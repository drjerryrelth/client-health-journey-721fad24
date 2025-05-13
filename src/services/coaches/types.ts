
// Update Coach type to fix the inconsistent types and make clinic_id optional
export type Coach = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: 'active' | 'inactive';
  clinicId: string;
  clinic_id?: string; // Make this optional since it's redundant with clinicId
  clients: number; // Changed back to number since most code expects this to be a number
  clinicName?: string;
  user_id?: string; // Add user_id property to match implementation in coach-service.ts
};
