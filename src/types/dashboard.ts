
// Types for the dashboard statistics
export interface DashboardStats {
  activeClinicCount: number;
  totalCoachCount: number;
  weeklyActivitiesCount: number;
  clinicsSummary: {
    id: string;
    name: string;
    coaches: number;
    clients: number;
    status: string;
  }[];
}

// Types for activity items
export interface ActivityItem {
  id: string;
  type: 'check_in' | 'clinic_signup' | 'coach_added' | 'message' | string;
  description: string;
  timestamp: string;
  userId?: string;
  clinicId?: string;
}
