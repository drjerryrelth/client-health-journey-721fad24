
import { CheckIn } from '@/types';

// Mock data for development when Supabase is not configured
export const mockCheckIns: CheckIn[] = [
  {
    id: '1',
    clientId: '1',
    date: '2023-05-10',
    weight: 155,
    measurements: {
      waist: 32,
      hips: 38,
      chest: 42,
      thighs: 22,
      arms: 14
    },
    moodScore: 4,
    energyScore: 4,
    sleepHours: 7.5,
    waterIntake: 8,
    meals: {
      breakfast: 'Oatmeal with fruits',
      lunch: 'Grilled chicken salad',
      dinner: 'Fish with vegetables',
      snacks: 'Nuts and yogurt'
    },
    notes: 'Feeling good today, workout was great',
    photos: []
  },
  {
    id: '2',
    clientId: '1',
    date: '2023-05-03',
    weight: 156.5,
    measurements: {
      waist: 32.5,
      hips: 38.5,
      chest: 42,
      thighs: 22.5,
      arms: 14
    },
    moodScore: 3,
    energyScore: 3,
    sleepHours: 6,
    waterIntake: 7,
    meals: {
      breakfast: 'Protein shake',
      lunch: 'Turkey sandwich',
      dinner: 'Pasta with vegetables',
      snacks: 'Apple and protein bar'
    },
    notes: 'Slightly tired today',
    photos: []
  },
  {
    id: '3',
    clientId: '2',
    date: '2023-05-12',
    weight: 180,
    measurements: {
      waist: 34,
      hips: 40,
      chest: 44,
      thighs: 24,
      arms: 16
    },
    moodScore: 5,
    energyScore: 5,
    sleepHours: 8,
    waterIntake: 10,
    meals: {
      breakfast: 'Eggs and avocado toast',
      lunch: 'Large salad with chicken',
      dinner: 'Steak and sweet potatoes',
      snacks: 'Protein shake'
    },
    notes: 'Had a great workout session',
    photos: []
  }
];
