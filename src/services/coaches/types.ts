
// Update Coach type to fix the 'clients' type mismatch
export type Coach = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: 'active' | 'inactive';
  clinicId: string;
  clinic_id: string;
  clients: any[]; // Changed from number to any[]
};
