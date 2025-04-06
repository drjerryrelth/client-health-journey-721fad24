import { Coach } from './types';
import { v4 as uuidv4 } from 'uuid';

// Generate mock coaches for development
export function getMockCoaches(clinicId?: string): Coach[] {
  // If a specific clinic ID is requested, filter for that clinic
  const allMockCoaches = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '555-123-4567',
      status: 'active' as const,
      clinicId: 'clinic-1',
      clients: 8,
      clinicName: 'Main Street Clinic'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '555-987-6543',
      status: 'active' as const,
      clinicId: 'clinic-1',
      clients: 12,
      clinicName: 'Main Street Clinic'
    },
    {
      id: '3',
      name: 'Michael Williams',
      email: 'michael.williams@example.com',
      phone: '555-456-7890',
      status: 'inactive' as const,
      clinicId: 'clinic-2',
      clients: 0,
      clinicName: 'Downtown Health Center'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '555-789-0123',
      status: 'active' as const,
      clinicId: 'clinic-2',
      clients: 15,
      clinicName: 'Downtown Health Center'
    },
    {
      id: '5',
      name: 'David Miller',
      email: 'david.miller@example.com',
      phone: '555-321-6547',
      status: 'active' as const,
      clinicId: 'clinic-3',
      clients: 7,
      clinicName: 'Riverside Wellness'
    }
  ];

  // If a specific clinic ID is provided, filter coaches for that clinic
  if (clinicId) {
    return allMockCoaches.filter(coach => coach.clinicId === clinicId);
  }

  // Otherwise return all mock coaches
  return allMockCoaches;
}

// Function to generate a new mock coach for a specific clinic
export function createMockCoach(name: string, email: string, clinicId: string): Coach {
  return {
    id: uuidv4(),
    name,
    email,
    phone: null,
    status: 'active',
    clinicId,
    clients: 0
  };
}
