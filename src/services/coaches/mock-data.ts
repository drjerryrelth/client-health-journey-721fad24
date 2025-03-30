
import { Coach } from './types';

// Mock data for fallback when API calls fail
export const getMockCoaches = (): Coach[] => [
  {
    id: '1',
    name: 'Lisa Johnson',
    email: 'lisa@healthtracker.com',
    phone: '(555) 123-4567',
    status: 'active',
    clinicId: '1',
    clients: 8
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@healthtracker.com',
    phone: '(555) 234-5678',
    status: 'active',
    clinicId: '1',
    clients: 6
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah@healthtracker.com',
    phone: '(555) 345-6789',
    status: 'inactive',
    clinicId: '2',
    clients: 4
  },
  {
    id: '4',
    name: 'David Martinez',
    email: 'david@healthtracker.com',
    phone: '(555) 456-7890',
    status: 'active',
    clinicId: '2',
    clients: 7
  },
  {
    id: '5',
    name: 'Jennifer Lee',
    email: 'jennifer@healthtracker.com',
    phone: '(555) 567-8901',
    status: 'active',
    clinicId: '3',
    clients: 9
  }
];
