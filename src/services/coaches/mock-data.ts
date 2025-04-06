
import { Coach } from './types';

export const getMockCoaches = (): Coach[] => {
  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      status: 'active',
      clinicId: '1',
      clinic_id: '1',
      clients: 12
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '555-987-6543',
      status: 'active',
      clinicId: '1',
      clinic_id: '1',
      clients: 8
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      phone: '555-555-5555',
      status: 'inactive',
      clinicId: '2',
      clinic_id: '2',
      clients: 0
    }
  ];
};
