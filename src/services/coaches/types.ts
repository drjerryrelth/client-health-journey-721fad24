
/**
 * Represents a coach in the system
 */
export interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: 'active' | 'inactive';
  clinicId: string; // Used in the frontend as camelCase
  clients: number;
}
